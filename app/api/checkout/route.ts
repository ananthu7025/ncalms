import { NextRequest, NextResponse } from "next/server";
import auth from "@/auth";
import { db } from "@/lib/db";
import { cart, subjects, contentTypes } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { createCheckoutSession, formatAmountForStripe } from "@/lib/stripe/utils";
import { CURRENCY } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's cart items
    const cartItems = await db
      .select({
        id: cart.id,
        subjectId: cart.subjectId,
        contentTypeId: cart.contentTypeId,
        isBundle: cart.isBundle,
        price: cart.price,
        subjectTitle: subjects.title,
        contentTypeName: contentTypes.name,
      })
      .from(cart)
      .leftJoin(subjects, eq(cart.subjectId, subjects.id))
      .leftJoin(contentTypes, eq(cart.contentTypeId, contentTypes.id))
      .where(eq(cart.userId, userId));

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Create line items for Stripe checkout
    const lineItems = cartItems.map((item) => {
      const itemName = item.isBundle
        ? `${item.subjectTitle} - Complete Bundle`
        : `${item.subjectTitle} - ${item.contentTypeName}`;

      return {
        price_data: {
          currency: CURRENCY.toLowerCase(),
          product_data: {
            name: itemName,
            description: item.isBundle
              ? "Access to all content types for this subject"
              : `Access to ${item.contentTypeName} content`,
          },
          unit_amount: formatAmountForStripe(
            parseFloat(item.price || "0"),
            CURRENCY
          ),
        },
        quantity: 1,
      };
    });

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession(lineItems, {
      userId,
      cartItemIds: cartItems.map((item) => item.id),
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
