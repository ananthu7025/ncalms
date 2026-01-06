"use server";

import auth from "@/auth";
import { db } from "@/lib/db";
import { cart, subjects, contentTypes, userAccess, offers, subjectContents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CartItem = {
  id: string;
  subjectId: string;
  contentTypeId: string | null;
  isBundle: boolean;
  price: string;
  subjectTitle: string;
  subjectThumbnail: string | null;
  contentTypeName: string | null;
  createdAt: Date;
};

/**
 * Get all cart items for the current user
 */
export async function getCartItems(): Promise<CartItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const items = await db
    .select({
      id: cart.id,
      subjectId: cart.subjectId,
      contentTypeId: cart.contentTypeId,
      isBundle: cart.isBundle,
      price: cart.price,
      subjectTitle: subjects.title,
      subjectThumbnail: subjects.thumbnail,
      contentTypeName: contentTypes.name,
      createdAt: cart.createdAt,
    })
    .from(cart)
    .leftJoin(subjects, eq(cart.subjectId, subjects.id))
    .leftJoin(contentTypes, eq(cart.contentTypeId, contentTypes.id))
    .where(eq(cart.userId, session.user.id))
    .orderBy(cart.createdAt);

  return items.map((item) => ({
    ...item,
    price: item.price || "0",
    subjectTitle: item.subjectTitle || "Unknown Subject",
  }));
}

/**
 * Add item to cart
 */
export async function addToCart(
  subjectId: string,
  contentTypeId: string | null,
  isBundle: boolean,
  price: number
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Check if user already has access to this content
    if (!isBundle && contentTypeId) {
      const hasAccess = await db
        .select()
        .from(userAccess)
        .where(
          and(
            eq(userAccess.userId, session.user.id),
            eq(userAccess.subjectId, subjectId),
            eq(userAccess.contentTypeId, contentTypeId)
          )
        );

      if (hasAccess.length > 0) {
        return {
          success: false,
          message: "You already have access to this content",
        };
      }
    }

    // Check if item already in cart
    const existingCartItem = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, session.user.id),
          eq(cart.subjectId, subjectId),
          isBundle
            ? eq(cart.isBundle, true)
            : and(
                eq(cart.contentTypeId, contentTypeId!),
                eq(cart.isBundle, false)
              )
        )
      );

    if (existingCartItem.length > 0) {
      return {
        success: false,
        message: "This item is already in your cart",
      };
    }

    // Add to cart
    await db.insert(cart).values({
      userId: session.user.id,
      subjectId,
      contentTypeId: isBundle ? null : contentTypeId,
      isBundle,
      price: price.toString(),
    });

    revalidatePath("/learner/cart");
    return { success: true, message: "Added to cart successfully" };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Failed to add to cart" };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await db
      .delete(cart)
      .where(
        and(eq(cart.id, cartItemId), eq(cart.userId, session.user.id))
      );

    revalidatePath("/learner/cart");
    return { success: true, message: "Removed from cart" };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: "Failed to remove from cart" };
  }
}

/**
 * Remove item from cart by subject and content type
 */
export async function removeFromCartByItem(
  subjectId: string,
  contentTypeId: string | null,
  isBundle: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await db
      .delete(cart)
      .where(
        and(
          eq(cart.userId, session.user.id),
          eq(cart.subjectId, subjectId),
          isBundle
            ? eq(cart.isBundle, true)
            : and(
                eq(cart.contentTypeId, contentTypeId!),
                eq(cart.isBundle, false)
              )
        )
      );

    revalidatePath("/learner/cart");
    revalidatePath("/learner/courses/[id]", "page");
    return { success: true, message: "Removed from cart" };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: "Failed to remove from cart" };
  }
}

/**
 * Clear all items from cart
 */
export async function clearCart(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(cart).where(eq(cart.userId, session.user.id));

    revalidatePath("/learner/cart");
    return { success: true, message: "Cart cleared" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: "Failed to clear cart" };
  }
}

/**
 * Get cart total
 */
export async function getCartTotal(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    return 0;
  }

  const items = await db
    .select({ price: cart.price })
    .from(cart)
    .where(eq(cart.userId, session.user.id));

  return items.reduce((total, item) => {
    return total + parseFloat(item.price || "0");
  }, 0);
}

/**
 * Get cart item count
 */
export async function getCartItemCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    return 0;
  }

  const items = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, session.user.id));

  return items.length;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckout(): Promise<{
  success: boolean;
  url?: string;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Check if cart has items
    const items = await getCartItems();
    if (items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Call checkout API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();
    return { success: true, url: data.url };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { success: false, message: "Failed to create checkout session" };
  }
}

/**
 * Apply an offer code to the cart
 */
export async function applyOfferCode(code: string): Promise<{
  success: boolean;
  message: string;
  offer?: {
    id: string;
    code: string;
    name: string;
    discountType: string;
    discountValue: string;
    subjectId: string | null;
    contentTypeId: string | null;
  };
  discount?: number;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const now = new Date();

    // Find the offer
    const [offer] = await db
      .select()
      .from(offers)
      .where(eq(offers.code, code.toUpperCase()))
      .limit(1);

    if (!offer) {
      return {
        success: false,
        message: "Invalid offer code",
      };
    }

    // Check if offer is active
    if (!offer.isActive) {
      return {
        success: false,
        message: "This offer is no longer active",
      };
    }

    // Check if offer is valid (date range)
    if (now < offer.validFrom || now > offer.validUntil) {
      return {
        success: false,
        message: "This offer has expired or is not yet valid",
      };
    }

    // Check if offer has reached max usage
    if (offer.maxUsage && offer.currentUsage >= offer.maxUsage) {
      return {
        success: false,
        message: "This offer has reached its maximum usage limit",
      };
    }

    // Get cart items
    const cartItems = await getCartItems();
    if (cartItems.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
      };
    }

    // Calculate discount based on applicable items
    let discount = 0;
    let applicableItems = 0;

    for (const item of cartItems) {
      // Check if offer applies to this item
      if (offer.subjectId && offer.subjectId !== item.subjectId) {
        continue; // Skip items that don't match the subject restriction
      }

      if (offer.contentTypeId && offer.contentTypeId !== item.contentTypeId) {
        continue; // Skip items that don't match the content type restriction
      }

      applicableItems++;
      const itemPrice = parseFloat(item.price || "0");

      if (offer.discountType === "percentage") {
        discount += (itemPrice * parseFloat(offer.discountValue)) / 100;
      } else {
        // Fixed discount
        discount += parseFloat(offer.discountValue);
      }
    }

    if (applicableItems === 0) {
      return {
        success: false,
        message: "This offer does not apply to any items in your cart",
      };
    }

    // For fixed discounts, cap at cart total
    const cartTotal = await getCartTotal();
    if (discount > cartTotal) {
      discount = cartTotal;
    }

    return {
      success: true,
      message: `Offer "${offer.name}" applied successfully!`,
      offer: {
        id: offer.id,
        code: offer.code,
        name: offer.name,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        subjectId: offer.subjectId,
        contentTypeId: offer.contentTypeId,
      },
      discount: Math.round(discount * 100) / 100,
    };
  } catch (error) {
    console.error("Error applying offer code:", error);
    return { success: false, message: "Failed to apply offer code" };
  }
}

/**
 * Calculate cart total with discount
 */
export async function getCartTotalWithDiscount(offerCode?: string): Promise<{
  subtotal: number;
  discount: number;
  total: number;
}> {
  const subtotal = await getCartTotal();

  if (!offerCode) {
    return {
      subtotal,
      discount: 0,
      total: subtotal,
    };
  }

  const result = await applyOfferCode(offerCode);
  const discount = result.discount || 0;

  return {
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
  };
}

export type BundleOpportunity = {
  subjectId: string;
  subjectTitle: string;
  subjectThumbnail: string | null;
  bundlePrice: number;
  currentIndividualTotal: number;
  savings: number;
  cartItemIds: string[];
  contentTypeIds: string[];
  availableContentTypeIds: string[];
};

/**
 * Detect if user has all individual content types in cart for any subject,
 * making them eligible for the complete bundle instead
 */
export async function detectBundleOpportunities(): Promise<BundleOpportunity[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    // Get all cart items for the user (non-bundle items only)
    const cartItems = await db
      .select({
        id: cart.id,
        subjectId: cart.subjectId,
        contentTypeId: cart.contentTypeId,
        price: cart.price,
        subjectTitle: subjects.title,
        subjectThumbnail: subjects.thumbnail,
        bundlePrice: subjects.bundlePrice,
        isBundleEnabled: subjects.isBundleEnabled,
      })
      .from(cart)
      .innerJoin(subjects, eq(cart.subjectId, subjects.id))
      .where(
        and(
          eq(cart.userId, session.user.id),
          eq(cart.isBundle, false)
        )
      );

    if (cartItems.length === 0) {
      return [];
    }

    // Get unique subject IDs from cart
    const subjectIds = [...new Set(cartItems.map(item => item.subjectId))];

    // Get all available content types for these subjects in one query
    const allAvailableContents = await db
      .select({
        subjectId: subjectContents.subjectId,
        contentTypeId: subjectContents.contentTypeId,
      })
      .from(subjectContents)
      .where(
        and(
          eq(subjectContents.isActive, true)
        )
      );

    // Group by subject
    const contentTypesBySubject = new Map<string, Set<string>>();
    for (const content of allAvailableContents) {
      if (!contentTypesBySubject.has(content.subjectId)) {
        contentTypesBySubject.set(content.subjectId, new Set());
      }
      contentTypesBySubject.get(content.subjectId)!.add(content.contentTypeId);
    }

    // Group cart items by subject
    const itemsBySubject = new Map<string, typeof cartItems>();
    for (const item of cartItems) {
      if (!itemsBySubject.has(item.subjectId)) {
        itemsBySubject.set(item.subjectId, []);
      }
      itemsBySubject.get(item.subjectId)!.push(item);
    }

    const opportunities: BundleOpportunity[] = [];

    // Check each subject for bundle opportunities
    for (const [subjectId, items] of itemsBySubject.entries()) {
      const firstItem = items[0];

      // Skip if bundle not enabled or no bundle price
      if (!firstItem.isBundleEnabled || !firstItem.bundlePrice) {
        continue;
      }

      const availableContentTypeIds = Array.from(contentTypesBySubject.get(subjectId) || []);

      if (availableContentTypeIds.length === 0) continue;

      // Get content type IDs in cart for this subject
      const cartContentTypeIds = items
        .filter(item => item.contentTypeId)
        .map(item => item.contentTypeId!);

      // Check if user has all available content types in cart
      const hasAllContentTypes = availableContentTypeIds.every(ctId =>
        cartContentTypeIds.includes(ctId)
      );

      if (!hasAllContentTypes) continue;

      const bundlePrice = parseFloat(firstItem.bundlePrice);
      const currentTotal = items.reduce((sum, item) => sum + parseFloat(item.price || "0"), 0);
      const savings = currentTotal - bundlePrice;

      // Only suggest if there are actual savings
      if (savings > 0) {
        opportunities.push({
          subjectId,
          subjectTitle: firstItem.subjectTitle || "Unknown Subject",
          subjectThumbnail: firstItem.subjectThumbnail,
          bundlePrice,
          currentIndividualTotal: currentTotal,
          savings,
          cartItemIds: items.map(item => item.id),
          contentTypeIds: cartContentTypeIds,
          availableContentTypeIds,
        });
      }
    }

    return opportunities;
  } catch (error) {
    console.error("Error detecting bundle opportunities:", error);
    return [];
  }
}

/**
 * Swap individual content type items with the complete bundle
 */
export async function swapWithBundle(
  subjectId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Get subject details
    const [subject] = await db
      .select({
        id: subjects.id,
        title: subjects.title,
        bundlePrice: subjects.bundlePrice,
        isBundleEnabled: subjects.isBundleEnabled,
      })
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1);

    if (!subject || !subject.isBundleEnabled || !subject.bundlePrice) {
      return {
        success: false,
        message: "Bundle is not available for this subject",
      };
    }

    // Check if user already has bundle in cart
    const existingBundle = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, session.user.id),
          eq(cart.subjectId, subjectId),
          eq(cart.isBundle, true)
        )
      );

    if (existingBundle.length > 0) {
      return {
        success: false,
        message: "Bundle is already in your cart",
      };
    }

    // Remove all individual items for this subject
    await db
      .delete(cart)
      .where(
        and(
          eq(cart.userId, session.user.id),
          eq(cart.subjectId, subjectId),
          eq(cart.isBundle, false)
        )
      );

    // Add bundle to cart
    await db.insert(cart).values({
      userId: session.user.id,
      subjectId,
      contentTypeId: null,
      isBundle: true,
      price: subject.bundlePrice,
    });

    revalidatePath("/learner/cart");
    return {
      success: true,
      message: `Switched to ${subject.title} complete bundle! You're saving money.`,
    };
  } catch (error) {
    console.error("Error swapping with bundle:", error);
    return { success: false, message: "Failed to swap with bundle" };
  }
}
