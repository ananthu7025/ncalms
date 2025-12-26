"use server";

import auth from "@/auth";
import { db } from "@/lib/db";
import {
  cart,
  purchases,
  userAccess,
  contentTypes,
  sessionBookings,
  sessionTypes,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCheckoutSession, formatAmountForStripe } from "@/lib/stripe/utils";
import { stripe } from "@/lib/stripe/config";
import { requireAuth } from "@/lib/auth/helpers";

/**
 * Verify and process a Stripe checkout session
 * This serves as a fallback when webhooks don't fire (e.g., in local development)
 */
export async function verifyAndProcessCheckout(sessionId: string): Promise<{
  success: boolean;
  message: string;
  alreadyProcessed?: boolean;
}> {
  console.log(`[Success Page] Verifying checkout session: ${sessionId}`);

  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log("[Success Page] Unauthorized - no user session");
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;
    console.log(`[Success Page] User ID: ${userId}`);

    // Retrieve the checkout session from Stripe
    console.log("[Success Page] Fetching checkout session from Stripe...");
    const checkoutSession = await getCheckoutSession(sessionId);
    console.log(`[Success Page] Stripe session status: ${checkoutSession.payment_status}`);

    // Verify the session belongs to this user
    if (checkoutSession.metadata?.userId !== userId) {
      console.log(`[Success Page] Session user mismatch. Expected: ${userId}, Got: ${checkoutSession.metadata?.userId}`);
      return { success: false, message: "Session does not belong to this user" };
    }

    // Check if payment was successful
    if (checkoutSession.payment_status !== "paid") {
      console.log(`[Success Page] Payment not completed. Status: ${checkoutSession.payment_status}`);
      return {
        success: false,
        message: `Payment not completed. Status: ${checkoutSession.payment_status}`,
      };
    }

    // Check if this session was already processed (to avoid duplicate processing)
    console.log("[Success Page] Checking if purchase already processed...");
    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeSessionId, sessionId))
      .limit(1);

    if (existingPurchase.length > 0) {
      // Already processed by webhook
      console.log("[Success Page] Purchase already processed by webhook");
      return {
        success: true,
        message: "Purchase already processed",
        alreadyProcessed: true,
      };
    }

    console.log("[Success Page] Purchase not yet processed, processing now...");

    // Process the purchase
    const cartItemIds = checkoutSession.metadata?.cartItemIds
      ? JSON.parse(checkoutSession.metadata.cartItemIds)
      : [];

    if (cartItemIds.length === 0) {
      return { success: false, message: "No cart items found in session" };
    }

    // Get all cart items for this user
    const allCartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    const itemsToProcess = allCartItems.filter((item) =>
      cartItemIds.includes(item.id)
    );

    if (itemsToProcess.length === 0) {
      return {
        success: false,
        message: "Cart items no longer exist (may have been processed)",
      };
    }

    // Process each cart item
    for (const item of itemsToProcess) {
      // Create purchase record
      await db.insert(purchases).values({
        userId,
        subjectId: item.subjectId,
        contentTypeId: item.isBundle ? null : item.contentTypeId,
        isBundle: item.isBundle,
        amount: item.price,
        status: "paid",
        transactionId: checkoutSession.payment_intent as string,
        stripeSessionId: sessionId,
        stripePaymentIntentId: checkoutSession.payment_intent as string,
      });

      // Grant user access
      if (item.isBundle) {
        // Grant access to all content types for this subject
        const allContentTypes = await db.select().from(contentTypes);

        for (const contentType of allContentTypes) {
          // Check if access already exists
          const existingAccess = await db
            .select()
            .from(userAccess)
            .where(
              and(
                eq(userAccess.userId, userId),
                eq(userAccess.subjectId, item.subjectId),
                eq(userAccess.contentTypeId, contentType.id)
              )
            );

          if (existingAccess.length === 0) {
            await db.insert(userAccess).values({
              userId,
              subjectId: item.subjectId,
              contentTypeId: contentType.id,
            });
          }
        }
      } else if (item.contentTypeId) {
        // Grant access to specific content type
        const existingAccess = await db
          .select()
          .from(userAccess)
          .where(
            and(
              eq(userAccess.userId, userId),
              eq(userAccess.subjectId, item.subjectId),
              eq(userAccess.contentTypeId, item.contentTypeId)
            )
          );

        if (existingAccess.length === 0) {
          await db.insert(userAccess).values({
            userId,
            subjectId: item.subjectId,
            contentTypeId: item.contentTypeId,
          });
        }
      }
    }

    // Clear cart items
    console.log(`[Success Page] Clearing cart for user ${userId}`);
    await db.delete(cart).where(eq(cart.userId, userId));

    // Revalidate relevant paths
    revalidatePath("/learner/cart");
    revalidatePath("/learner/library");
    revalidatePath("/learner/courses");

    console.log(`[Success Page] Successfully processed purchase for user ${userId}`);
    return {
      success: true,
      message: "Purchase processed successfully",
      alreadyProcessed: false,
    };
  } catch (error) {
    console.error("[Success Page] Error verifying checkout:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process checkout",
    };
  }
}

/**
 * Check if a checkout session has been processed
 */
export async function isCheckoutProcessed(sessionId: string): Promise<boolean> {
  try {
    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeSessionId, sessionId))
      .limit(1);

    return existingPurchase.length > 0;
  } catch (error) {
    console.error("Error checking checkout status:", error);
    return false;
  }
}

/**
 * Create Stripe checkout session for session booking
 */
export async function createSessionCheckout(bookingId: string): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // Get booking details
    const [bookingData] = await db
      .select({
        booking: sessionBookings,
        sessionType: sessionTypes,
      })
      .from(sessionBookings)
      .leftJoin(sessionTypes, eq(sessionBookings.sessionTypeId, sessionTypes.id))
      .where(eq(sessionBookings.id, bookingId))
      .limit(1);

    if (!bookingData) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Verify booking belongs to user
    if (bookingData.booking.userId !== userId) {
      return {
        success: false,
        error: "Unauthorized - booking does not belong to you",
      };
    }

    // Verify session type exists
    if (!bookingData.sessionType) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    // Check if booking already has a Stripe session
    if (bookingData.booking.stripeSessionId) {
      return {
        success: false,
        error: "Booking already has a payment session",
      };
    }

    // Create Stripe checkout session
    const priceInCents = formatAmountForStripe(
      parseFloat(bookingData.sessionType.price),
      "CAD"
    );

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: bookingData.sessionType.title,
              description: bookingData.sessionType.description || undefined,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/learner/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=session`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/learner/book-session?cancelled=true`,
      metadata: {
        userId,
        bookingId,
        type: "session_booking",
      },
      allow_promotion_codes: false,
      billing_address_collection: "required",
      customer_email: bookingData.booking.email,
    });

    // Update booking with Stripe session ID
    await db
      .update(sessionBookings)
      .set({
        stripeSessionId: checkoutSession.id,
        updatedAt: new Date(),
      })
      .where(eq(sessionBookings.id, bookingId));

    return {
      success: true,
      checkoutUrl: checkoutSession.url || undefined,
    };
  } catch (error) {
    console.error("Create session checkout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    };
  }
}
