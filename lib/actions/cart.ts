"use server";

import auth from "@/auth";
import { db } from "@/lib/db";
import { cart, subjects, contentTypes, userAccess } from "@/lib/db/schema";
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
      return { success: false, message: "Item already in cart" };
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
