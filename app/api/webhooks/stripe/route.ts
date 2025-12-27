import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { purchases, userAccess, cart, subjects, contentTypes, sessionBookings, sessionTypes, offers } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/stripe/utils";
import { STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/config";
import { sendBookingConfirmationEmail } from "@/lib/email/service";

// Disable body parsing, need raw body for webhook signature verification
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  console.log("[Webhook] Received webhook request");

  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("[Webhook] No Stripe signature found in headers");
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, STRIPE_WEBHOOK_SECRET);
      console.log(`[Webhook] Verified event: ${event.type} [${event.id}]`);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log(`[Webhook] Processing checkout.session.completed`);
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        console.log(`[Webhook] PaymentIntent succeeded: ${event.data.object.id}`);
        break;

      case "payment_intent.payment_failed":
        console.log(`[Webhook] Processing payment_intent.payment_failed`);
        await handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    console.log(`[Webhook] Successfully processed event: ${event.type}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const userId = session.metadata?.userId;
    const checkoutType = session.metadata?.type;

    // Handle session booking checkout
    if (checkoutType === "session_booking") {
      await handleSessionBookingPayment(session);
      return;
    }

    // Handle regular course purchase checkout
    const cartItemIds = session.metadata?.cartItemIds
      ? JSON.parse(session.metadata.cartItemIds)
      : [];

    if (!userId || cartItemIds.length === 0) {
      console.error("Missing metadata in checkout session:", session.id);
      return;
    }

    // Get cart items to process
    const cartItems = await db
      .select({
        id: cart.id,
        subjectId: cart.subjectId,
        contentTypeId: cart.contentTypeId,
        isBundle: cart.isBundle,
        price: cart.price,
      })
      .from(cart)
      .where(
        and(
          eq(cart.userId, userId),
          eq(cart.id, cartItemIds[0]) // Start with first item, we'll get all below
        )
      );

    if (cartItems.length === 0) {
      console.error("No cart items found for session:", session.id);
      return;
    }

    // Get all cart items for this user that match the IDs
    const allCartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    const itemsToProcess = allCartItems.filter((item) =>
      cartItemIds.includes(item.id)
    );

    // Process each cart item
    for (const item of itemsToProcess) {
      // Create purchase record
      const [purchase] = await db
        .insert(purchases)
        .values({
          userId,
          subjectId: item.subjectId,
          contentTypeId: item.isBundle ? null : item.contentTypeId,
          isBundle: item.isBundle,
          amount: item.price,
          status: "paid",
          transactionId: session.payment_intent as string,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        })
        .returning();

      // Grant user access
      if (item.isBundle) {
        // Grant access to all content types for this subject
        const allContentTypes = await db
          .select()
          .from(contentTypes);

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
    await db
      .delete(cart)
      .where(eq(cart.userId, userId));

    // Track offer usage if an offer was applied
    const offerId = session.metadata?.offerId;
    if (offerId) {
      console.log(`[Webhook] Incrementing usage for offer ${offerId}`);
      try {
        await db
          .update(offers)
          .set({
            currentUsage: sql`${offers.currentUsage} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(offers.id, offerId));
        console.log(`[Webhook] Successfully incremented offer usage for ${offerId}`);
      } catch (offerError) {
        console.error(`[Webhook] Error incrementing offer usage:`, offerError);
        // Don't throw - we still want the purchase to succeed even if offer tracking fails
      }
    }

    console.log(`Successfully processed checkout for user ${userId}`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
}

/**
 * Handle session booking payment completion
 */
async function handleSessionBookingPayment(
  session: Stripe.Checkout.Session
) {
  try {
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("[Webhook] Missing bookingId in session metadata:", session.id);
      return;
    }

    console.log(`[Webhook] Processing session booking payment for booking ${bookingId}`);

    // Get booking and session type details
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
      console.error(`[Webhook] Booking not found: ${bookingId}`);
      return;
    }

    // Check if booking was already processed
    if (bookingData.booking.status === "confirmed" && bookingData.booking.amountPaid) {
      console.log(`[Webhook] Booking ${bookingId} already processed, skipping`);
      return;
    }

    // Update booking with payment details
    const amountPaid = session.amount_total ? (session.amount_total / 100).toString() : "0";

    await db
      .update(sessionBookings)
      .set({
        status: "confirmed",
        stripePurchaseId: session.payment_intent as string,
        amountPaid,
        updatedAt: new Date(),
      })
      .where(eq(sessionBookings.id, bookingId));

    console.log(`[Webhook] Updated booking ${bookingId} status to confirmed`);

    // Send confirmation email
    if (bookingData.sessionType) {
      await sendBookingConfirmationEmail({
        email: bookingData.booking.email,
        fullName: bookingData.booking.fullName,
        sessionTitle: bookingData.sessionType.title,
        sessionDuration: bookingData.sessionType.duration,
        sessionPrice: bookingData.sessionType.price,
        bookingId: bookingData.booking.id,
      });
      console.log(`[Webhook] Sent confirmation email to ${bookingData.booking.email}`);
    }

    console.log(`[Webhook] Successfully processed session booking payment for ${bookingId}`);
  } catch (error) {
    console.error("[Webhook] Error handling session booking payment:", error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id);

    // Find purchase by payment intent ID and update status
    await db
      .update(purchases)
      .set({ status: "failed" })
      .where(eq(purchases.stripePaymentIntentId, paymentIntent.id));

    console.log(`Updated purchase status to failed for payment ${paymentIntent.id}`);
  } catch (error) {
    console.error("Error handling payment failed:", error);
    throw error;
  }
}
