"use server";

import { db, schema } from "@/lib/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createOfferSchema,
  updateOfferSchema,
  type CreateOfferInput,
  type UpdateOfferInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all offers with related data
 */
export async function getOffers() {
  try {
    await requireAdmin();

    const offers = await db
      .select({
        offer: schema.offers,
        subject: schema.subjects,
        contentType: schema.contentTypes,
      })
      .from(schema.offers)
      .leftJoin(schema.subjects, eq(schema.offers.subjectId, schema.subjects.id))
      .leftJoin(schema.contentTypes, eq(schema.offers.contentTypeId, schema.contentTypes.id))
      .orderBy(schema.offers.createdAt);

    return {
      success: true,
      data: offers,
    };
  } catch (error) {
    console.error("Get offers error:", error);
    return {
      success: false,
      error: "Failed to fetch offers",
    };
  }
}

/**
 * Get offer statistics
 */
export async function getOfferStats() {
  try {
    await requireAdmin();

    const now = new Date();

    // Get active offers count
    const activeOffersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.offers)
      .where(
        and(
          eq(schema.offers.isActive, true),
          lte(schema.offers.validFrom, now),
          gte(schema.offers.validUntil, now)
        )
      );

    const activeOffers = Number(activeOffersResult[0]?.count || 0);

    // Get total redemptions
    const totalRedemptionsResult = await db
      .select({ total: sql<number>`sum(current_usage)` })
      .from(schema.offers);

    const totalRedemptions = Number(totalRedemptionsResult[0]?.total || 0);

    // Get expiring soon offers (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoonResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.offers)
      .where(
        and(
          eq(schema.offers.isActive, true),
          lte(schema.offers.validFrom, now),
          gte(schema.offers.validUntil, now),
          lte(schema.offers.validUntil, sevenDaysFromNow)
        )
      );

    const expiringSoon = Number(expiringSoonResult[0]?.count || 0);

    // Get average discount (percentage only)
    const avgDiscountResult = await db
      .select({ avg: sql<number>`avg(discount_value)` })
      .from(schema.offers)
      .where(eq(schema.offers.discountType, "percentage"));

    const avgDiscount = Number(avgDiscountResult[0]?.avg || 0);

    return {
      success: true,
      data: {
        activeOffers,
        totalRedemptions,
        expiringSoon,
        avgDiscount: Math.round(avgDiscount),
      },
    };
  } catch (error) {
    console.error("Get offer stats error:", error);
    return {
      success: false,
      error: "Failed to fetch offer statistics",
    };
  }
}

/**
 * Get a single offer by ID
 */
export async function getOfferById(id: string) {
  try {
    await requireAdmin();

    const [result] = await db
      .select({
        offer: schema.offers,
        subject: schema.subjects,
        contentType: schema.contentTypes,
      })
      .from(schema.offers)
      .leftJoin(schema.subjects, eq(schema.offers.subjectId, schema.subjects.id))
      .leftJoin(schema.contentTypes, eq(schema.offers.contentTypeId, schema.contentTypes.id))
      .where(eq(schema.offers.id, id))
      .limit(1);

    if (!result) {
      return {
        success: false,
        error: "Offer not found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Get offer error:", error);
    return {
      success: false,
      error: "Failed to fetch offer",
    };
  }
}

/**
 * Create a new offer (Admin only)
 */
export async function createOffer(data: CreateOfferInput) {
  try {
    await requireAdmin();

    // Validate input
    const validatedData = createOfferSchema.parse(data);

    // Check if code already exists
    const [existing] = await db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.code, validatedData.code))
      .limit(1);

    if (existing) {
      return {
        success: false,
        error: "Offer code already exists",
      };
    }

    // If subject is specified, verify it exists
    if (validatedData.subjectId) {
      const [subject] = await db
        .select()
        .from(schema.subjects)
        .where(eq(schema.subjects.id, validatedData.subjectId))
        .limit(1);

      if (!subject) {
        return {
          success: false,
          error: "Subject not found",
        };
      }
    }

    // If content type is specified, verify it exists
    if (validatedData.contentTypeId) {
      const [contentType] = await db
        .select()
        .from(schema.contentTypes)
        .where(eq(schema.contentTypes.id, validatedData.contentTypeId))
        .limit(1);

      if (!contentType) {
        return {
          success: false,
          error: "Content type not found",
        };
      }
    }

    // Validate discount value based on type
    const discountValue = parseFloat(validatedData.discountValue);
    if (validatedData.discountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
      return {
        success: false,
        error: "Percentage discount must be between 0 and 100",
      };
    }

    // Create the offer
    const [newOffer] = await db
      .insert(schema.offers)
      .values({
        name: validatedData.name,
        code: validatedData.code,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        subjectId: validatedData.subjectId || null,
        contentTypeId: validatedData.contentTypeId || null,
        maxUsage: validatedData.maxUsage || null,
        currentUsage: 0,
        validFrom: validatedData.validFrom,
        validUntil: validatedData.validUntil,
        isActive: validatedData.isActive,
      })
      .returning();

    revalidatePath("/admin/offers");

    return {
      success: true,
      data: newOffer,
      message: "Offer created successfully",
    };
  } catch (error) {
    console.error("Create offer error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create offer",
    };
  }
}

/**
 * Update an existing offer (Admin only)
 */
export async function updateOffer(data: UpdateOfferInput) {
  try {
    await requireAdmin();

    // Validate input
    const validatedData = updateOfferSchema.parse(data);

    // Check if offer exists
    const [existing] = await db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Offer not found",
      };
    }

    // Check if code is taken by another offer
    const [codeExists] = await db
      .select()
      .from(schema.offers)
      .where(
        and(
          eq(schema.offers.code, validatedData.code),
          sql`${schema.offers.id} != ${validatedData.id}`
        )
      )
      .limit(1);

    if (codeExists) {
      return {
        success: false,
        error: "Offer code already exists",
      };
    }

    // If subject is specified, verify it exists
    if (validatedData.subjectId) {
      const [subject] = await db
        .select()
        .from(schema.subjects)
        .where(eq(schema.subjects.id, validatedData.subjectId))
        .limit(1);

      if (!subject) {
        return {
          success: false,
          error: "Subject not found",
        };
      }
    }

    // If content type is specified, verify it exists
    if (validatedData.contentTypeId) {
      const [contentType] = await db
        .select()
        .from(schema.contentTypes)
        .where(eq(schema.contentTypes.id, validatedData.contentTypeId))
        .limit(1);

      if (!contentType) {
        return {
          success: false,
          error: "Content type not found",
        };
      }
    }

    // Validate discount value based on type
    const discountValue = parseFloat(validatedData.discountValue);
    if (validatedData.discountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
      return {
        success: false,
        error: "Percentage discount must be between 0 and 100",
      };
    }

    // Update the offer
    const [updatedOffer] = await db
      .update(schema.offers)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        subjectId: validatedData.subjectId || null,
        contentTypeId: validatedData.contentTypeId || null,
        maxUsage: validatedData.maxUsage || null,
        validFrom: validatedData.validFrom,
        validUntil: validatedData.validUntil,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.offers.id, validatedData.id))
      .returning();

    revalidatePath("/admin/offers");

    return {
      success: true,
      data: updatedOffer,
      message: "Offer updated successfully",
    };
  } catch (error) {
    console.error("Update offer error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update offer",
    };
  }
}

/**
 * Delete an offer (Admin only)
 */
export async function deleteOffer(id: string) {
  try {
    await requireAdmin();

    // Check if offer exists
    const [existing] = await db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Offer not found",
      };
    }

    // Delete the offer
    await db.delete(schema.offers).where(eq(schema.offers.id, id));

    revalidatePath("/admin/offers");

    return {
      success: true,
      message: "Offer deleted successfully",
    };
  } catch (error) {
    console.error("Delete offer error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete offer",
    };
  }
}

/**
 * Toggle offer active status (Admin only)
 */
export async function toggleOfferStatus(id: string) {
  try {
    await requireAdmin();

    // Get current status
    const [offer] = await db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.id, id))
      .limit(1);

    if (!offer) {
      return {
        success: false,
        error: "Offer not found",
      };
    }

    // Toggle status
    const [updatedOffer] = await db
      .update(schema.offers)
      .set({
        isActive: !offer.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.offers.id, id))
      .returning();

    revalidatePath("/admin/offers");

    return {
      success: true,
      data: updatedOffer,
      message: `Offer ${updatedOffer.isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Toggle offer status error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to toggle offer status",
    };
  }
}

/**
 * Validate and apply offer code (for checkout)
 */
export async function validateOfferCode(code: string, subjectId?: string, contentTypeId?: string) {
  try {
    const now = new Date();

    // Find the offer
    const [offer] = await db
      .select()
      .from(schema.offers)
      .where(eq(schema.offers.code, code.toUpperCase()))
      .limit(1);

    if (!offer) {
      return {
        success: false,
        error: "Invalid offer code",
      };
    }

    // Check if offer is active
    if (!offer.isActive) {
      return {
        success: false,
        error: "This offer is no longer active",
      };
    }

    // Check if offer is valid (date range)
    if (now < offer.validFrom || now > offer.validUntil) {
      return {
        success: false,
        error: "This offer has expired or is not yet valid",
      };
    }

    // Check if offer has reached max usage
    if (offer.maxUsage && offer.currentUsage >= offer.maxUsage) {
      return {
        success: false,
        error: "This offer has reached its maximum usage limit",
      };
    }

    // Check if offer applies to the specific subject/content type
    if (offer.subjectId && subjectId && offer.subjectId !== subjectId) {
      return {
        success: false,
        error: "This offer does not apply to this course",
      };
    }

    if (offer.contentTypeId && contentTypeId && offer.contentTypeId !== contentTypeId) {
      return {
        success: false,
        error: "This offer does not apply to this content type",
      };
    }

    return {
      success: true,
      data: offer,
      message: "Offer code is valid",
    };
  } catch (error) {
    console.error("Validate offer code error:", error);
    return {
      success: false,
      error: "Failed to validate offer code",
    };
  }
}

/**
 * Increment offer usage count
 */
export async function incrementOfferUsage(offerId: string) {
  try {
    await db
      .update(schema.offers)
      .set({
        currentUsage: sql`${schema.offers.currentUsage} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.offers.id, offerId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Increment offer usage error:", error);
    return {
      success: false,
      error: "Failed to increment offer usage",
    };
  }
}
