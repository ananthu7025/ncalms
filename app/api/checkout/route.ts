import { NextRequest, NextResponse } from "next/server";
import auth from "@/auth";
import { db } from "@/lib/db";
import { cart, subjects, contentTypes, offers } from "@/lib/db/schema";
import { eq, and, inArray, gte, lte } from "drizzle-orm";
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

    // Parse request body for offer information
    const body = await request.json().catch(() => ({}));
    const { offerCode, offerId } = body;

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

    // Validate and apply offer if provided
    let appliedOffer = null;
    let totalDiscount = 0;

    if (offerCode && offerId) {
      const now = new Date();

      // Fetch and validate the offer
      const [offer] = await db
        .select()
        .from(offers)
        .where(eq(offers.id, offerId))
        .limit(1);

      // Validate offer
      if (
        offer &&
        offer.isActive &&
        offer.code === offerCode.toUpperCase() &&
        now >= offer.validFrom &&
        now <= offer.validUntil &&
        (!offer.maxUsage || offer.currentUsage < offer.maxUsage)
      ) {
        // Calculate discount
        for (const item of cartItems) {
          // Check if offer applies to this item
          if (offer.subjectId && offer.subjectId !== item.subjectId) {
            continue;
          }
          if (offer.contentTypeId && offer.contentTypeId !== item.contentTypeId) {
            continue;
          }

          const itemPrice = parseFloat(item.price || "0");

          if (offer.discountType === "percentage") {
            totalDiscount += (itemPrice * parseFloat(offer.discountValue)) / 100;
          } else {
            totalDiscount += parseFloat(offer.discountValue);
          }
        }

        appliedOffer = offer;
      }
    }

    // Calculate the subtotal
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price || "0"),
      0
    );

    // Ensure discount doesn't exceed subtotal
    if (totalDiscount > subtotal) {
      totalDiscount = subtotal;
    }

    // Calculate discount per item proportionally
    const discountPerItem: { [key: string]: number } = {};

    if (totalDiscount > 0 && appliedOffer) {
      for (const item of cartItems) {
        // Check if offer applies to this item
        const itemApplies =
          (!appliedOffer.subjectId || appliedOffer.subjectId === item.subjectId) &&
          (!appliedOffer.contentTypeId || appliedOffer.contentTypeId === item.contentTypeId);

        if (itemApplies) {
          const itemPrice = parseFloat(item.price || "0");

          if (appliedOffer.discountType === "percentage") {
            discountPerItem[item.id] = (itemPrice * parseFloat(appliedOffer.discountValue)) / 100;
          } else {
            // For fixed discounts, distribute proportionally based on price
            discountPerItem[item.id] = (itemPrice / subtotal) * totalDiscount;
          }
        } else {
          discountPerItem[item.id] = 0;
        }
      }
    }

    // Create line items for Stripe checkout with discounts applied
    const lineItems = cartItems.map((item) => {
      const itemName = item.isBundle
        ? `${item.subjectTitle} - Complete Bundle`
        : `${item.subjectTitle} - ${item.contentTypeName}`;

      const itemPrice = parseFloat(item.price || "0");
      const itemDiscount = discountPerItem[item.id] || 0;
      const finalPrice = Math.max(0, itemPrice - itemDiscount);

      // Build description with discount info if applicable
      let description = item.isBundle
        ? "Access to all content types for this subject"
        : `Access to ${item.contentTypeName} content`;

      if (itemDiscount > 0 && appliedOffer) {
        description += ` (${appliedOffer.code}: -$${itemDiscount.toFixed(2)})`;
      }

      return {
        price_data: {
          currency: CURRENCY.toLowerCase(),
          product_data: {
            name: itemName,
            description: description,
          },
          unit_amount: formatAmountForStripe(finalPrice, CURRENCY),
        },
        quantity: 1,
      };
    });

    // Create metadata
    const metadata: {
      userId: string;
      cartItemIds: string[];
      [key: string]: string | string[];
    } = {
      userId,
      cartItemIds: cartItems.map((item) => item.id),
    };

    // Add offer information to metadata
    if (appliedOffer) {
      metadata.offerId = appliedOffer.id;
      metadata.offerCode = appliedOffer.code;
      metadata.discountAmount = totalDiscount.toFixed(2);
    }

    // Get base URL from environment or request headers
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    // If NEXT_PUBLIC_APP_URL is not set or invalid, construct from request headers
    if (!baseUrl || baseUrl === 'undefined' || baseUrl.trim() === '') {
      const host = request.headers.get('host');
      const protocol = request.headers.get('x-forwarded-proto') ||
                      (host?.includes('localhost') ? 'http' : 'https');

      if (host) {
        baseUrl = `${protocol}://${host}`;
      }
    }

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession(lineItems, metadata, baseUrl);

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
