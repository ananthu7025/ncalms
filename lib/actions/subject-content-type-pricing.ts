"use server";

import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema for pricing
const pricingSchema = z.object({
  subjectId: z.string().uuid(),
  contentTypeId: z.string().uuid(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
});

/**
 * Get all pricing for a specific subject
 */
export async function getPricingForSubject(subjectId: string) {
  try {
    const pricing = await db
      .select({
        id: schema.subjectContentTypePricing.id,
        subjectId: schema.subjectContentTypePricing.subjectId,
        contentTypeId: schema.subjectContentTypePricing.contentTypeId,
        price: schema.subjectContentTypePricing.price,
        contentTypeName: schema.contentTypes.name,
        contentTypeDescription: schema.contentTypes.description,
        createdAt: schema.subjectContentTypePricing.createdAt,
        updatedAt: schema.subjectContentTypePricing.updatedAt,
      })
      .from(schema.subjectContentTypePricing)
      .leftJoin(
        schema.contentTypes,
        eq(schema.subjectContentTypePricing.contentTypeId, schema.contentTypes.id)
      )
      .where(eq(schema.subjectContentTypePricing.subjectId, subjectId));

    return { success: true, data: pricing };
  } catch (error) {
    console.error("Error fetching pricing for subject:", error);
    return { success: false, error: "Failed to fetch pricing" };
  }
}

/**
 * Get pricing for a specific subject and content type
 */
export async function getPricing(subjectId: string, contentTypeId: string) {
  try {
    const pricing = await db
      .select()
      .from(schema.subjectContentTypePricing)
      .where(
        and(
          eq(schema.subjectContentTypePricing.subjectId, subjectId),
          eq(schema.subjectContentTypePricing.contentTypeId, contentTypeId)
        )
      )
      .limit(1);

    if (pricing.length === 0) {
      return { success: false, error: "Pricing not found" };
    }

    return { success: true, data: pricing[0] };
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return { success: false, error: "Failed to fetch pricing" };
  }
}

/**
 * Update or create pricing for a subject and content type
 */
export async function upsertPricing(data: {
  subjectId: string;
  contentTypeId: string;
  price: string;
}) {
  try {
    // Validate input
    const validated = pricingSchema.parse(data);

    // Check if pricing already exists
    const existing = await db
      .select()
      .from(schema.subjectContentTypePricing)
      .where(
        and(
          eq(schema.subjectContentTypePricing.subjectId, validated.subjectId),
          eq(schema.subjectContentTypePricing.contentTypeId, validated.contentTypeId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing pricing
      const updated = await db
        .update(schema.subjectContentTypePricing)
        .set({
          price: validated.price,
          updatedAt: new Date(),
        })
        .where(eq(schema.subjectContentTypePricing.id, existing[0].id))
        .returning();

      return { success: true, data: updated[0] };
    } else {
      // Insert new pricing
      const inserted = await db
        .insert(schema.subjectContentTypePricing)
        .values({
          subjectId: validated.subjectId,
          contentTypeId: validated.contentTypeId,
          price: validated.price,
        })
        .returning();

      return { success: true, data: inserted[0] };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    console.error("Error upserting pricing:", error);
    return { success: false, error: "Failed to save pricing" };
  }
}

/**
 * Update multiple pricing entries for a subject at once
 */
export async function updateSubjectPricing(
  subjectId: string,
  pricingList: Array<{ contentTypeId: string; price: string }>
) {
  try {
    const results = [];

    for (const pricing of pricingList) {
      const result = await upsertPricing({
        subjectId,
        contentTypeId: pricing.contentTypeId,
        price: pricing.price,
      });

      if (!result.success) {
        return {
          success: false,
          error: `Failed to update pricing for content type ${pricing.contentTypeId}`,
        };
      }

      results.push(result.data);
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("Error updating subject pricing:", error);
    return { success: false, error: "Failed to update pricing" };
  }
}

/**
 * Delete pricing for a specific subject and content type
 */
export async function deletePricing(subjectId: string, contentTypeId: string) {
  try {
    await db
      .delete(schema.subjectContentTypePricing)
      .where(
        and(
          eq(schema.subjectContentTypePricing.subjectId, subjectId),
          eq(schema.subjectContentTypePricing.contentTypeId, contentTypeId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error deleting pricing:", error);
    return { success: false, error: "Failed to delete pricing" };
  }
}

/**
 * Get all subjects with their pricing
 */
export async function getAllSubjectsWithPricing() {
  try {
    const subjects = await db
      .select({
        id: schema.subjects.id,
        title: schema.subjects.title,
        pricing: {
          id: schema.subjectContentTypePricing.id,
          contentTypeId: schema.subjectContentTypePricing.contentTypeId,
          contentTypeName: schema.contentTypes.name,
          price: schema.subjectContentTypePricing.price,
        },
      })
      .from(schema.subjects)
      .leftJoin(
        schema.subjectContentTypePricing,
        eq(schema.subjects.id, schema.subjectContentTypePricing.subjectId)
      )
      .leftJoin(
        schema.contentTypes,
        eq(schema.subjectContentTypePricing.contentTypeId, schema.contentTypes.id)
      )
      .where(eq(schema.subjects.isActive, true));

    // Group pricing by subject
    const subjectsMap = new Map();

    for (const row of subjects) {
      if (!subjectsMap.has(row.id)) {
        subjectsMap.set(row.id, {
          id: row.id,
          title: row.title,
          pricing: [],
        });
      }

      if (row.pricing.id) {
        subjectsMap.get(row.id).pricing.push(row.pricing);
      }
    }

    return {
      success: true,
      data: Array.from(subjectsMap.values()),
    };
  } catch (error) {
    console.error("Error fetching subjects with pricing:", error);
    return { success: false, error: "Failed to fetch subjects with pricing" };
  }
}
