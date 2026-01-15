"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

/**
 * Get platform settings (singleton - should always return one record)
 */
export async function getPlatformSettings() {
  try {
    const [settings] = await db
      .select()
      .from(schema.platformSettings)
      .limit(1);

    if (!settings) {
      return {
        success: false,
        error: "Platform settings not found",
      };
    }

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error("Get platform settings error:", error);
    return {
      success: false,
      error: "Failed to fetch platform settings",
    };
  }
}

/**
 * Update Mandatory Subjects Bundle settings (Admin only)
 */
export async function updateAllSubjectsBundle(data: {
  allSubjectsBundleEnabled: boolean;
  allSubjectsBundlePrice: string;
}) {
  try {
    await requireAdmin();

    // Get the platform settings record
    const [settings] = await db
      .select()
      .from(schema.platformSettings)
      .limit(1);

    if (!settings) {
      return {
        success: false,
        error: "Platform settings not found",
      };
    }

    // Validate price
    const price = parseFloat(data.allSubjectsBundlePrice);
    if (isNaN(price) || price < 0) {
      return {
        success: false,
        error: "Invalid price value",
      };
    }

    // Update the settings
    const [updatedSettings] = await db
      .update(schema.platformSettings)
      .set({
        allSubjectsBundleEnabled: data.allSubjectsBundleEnabled,
        allSubjectsBundlePrice: data.allSubjectsBundlePrice,
        updatedAt: new Date(),
      })
      .where(eq(schema.platformSettings.id, settings.id))
      .returning();

    revalidatePath("/admin/offers");
    revalidatePath("/courses");

    return {
      success: true,
      data: updatedSettings,
      message: "Bundle settings updated successfully",
    };
  } catch (error) {
    console.error("Update bundle settings error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update bundle settings",
    };
  }
}
