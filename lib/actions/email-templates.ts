"use server";

import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  type CreateEmailTemplateInput,
  type UpdateEmailTemplateInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all email templates
 */
export async function getEmailTemplates() {
  try {
    await requireAdmin();

    const templates = await db
      .select()
      .from(schema.emailTemplates)
      .orderBy(schema.emailTemplates.name);

    return {
      success: true,
      data: templates,
    };
  } catch (error) {
    console.error("Get email templates error:", error);
    return {
      success: false,
      error: "Failed to fetch email templates",
    };
  }
}

/**
 * Get email template statistics
 */
export async function getEmailTemplateStats() {
  try {
    await requireAdmin();

    // Get total templates count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.emailTemplates);

    const totalTemplates = Number(totalResult[0]?.count || 0);

    // Get commonly used template names
    const commonTemplates = [
      'WELCOME_EMAIL',
      'RESET_PASSWORD',
      'BOOKING_CONFIRMATION',
      'BOOKING_CANCELLATION',
    ];

    const existingTemplatesResult = await db
      .select({ name: schema.emailTemplates.name })
      .from(schema.emailTemplates)
      .where(sql`${schema.emailTemplates.name} IN (${sql.raw(commonTemplates.map(t => `'${t}'`).join(','))})`);

    const configuredTemplates = existingTemplatesResult.length;

    return {
      success: true,
      data: {
        totalTemplates,
        configuredTemplates,
        missingTemplates: commonTemplates.length - configuredTemplates,
      },
    };
  } catch (error) {
    console.error("Get email template stats error:", error);
    return {
      success: false,
      error: "Failed to fetch email template statistics",
    };
  }
}

/**
 * Get a single email template by ID
 */
export async function getEmailTemplateById(id: string) {
  try {
    await requireAdmin();

    const [template] = await db
      .select()
      .from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.id, id))
      .limit(1);

    if (!template) {
      return {
        success: false,
        error: "Email template not found",
      };
    }

    return {
      success: true,
      data: template,
    };
  } catch (error) {
    console.error("Get email template error:", error);
    return {
      success: false,
      error: "Failed to fetch email template",
    };
  }
}

/**
 * Create a new email template (Admin only)
 */
export async function createEmailTemplate(data: CreateEmailTemplateInput) {
  try {
    await requireAdmin();

    // Validate input
    const validatedData = createEmailTemplateSchema.parse(data);

    // Check if template name already exists
    const [existing] = await db
      .select()
      .from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.name, validatedData.name))
      .limit(1);

    if (existing) {
      return {
        success: false,
        error: "Email template with this name already exists",
      };
    }

    // Create the template
    const [newTemplate] = await db
      .insert(schema.emailTemplates)
      .values({
        name: validatedData.name,
        subject: validatedData.subject,
        htmlContent: validatedData.htmlContent,
        textContent: validatedData.textContent,
      })
      .returning();

    revalidatePath("/admin/email-templates");

    return {
      success: true,
      data: newTemplate,
      message: "Email template created successfully",
    };
  } catch (error) {
    console.error("Create email template error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create email template",
    };
  }
}

/**
 * Update an existing email template (Admin only)
 */
export async function updateEmailTemplate(data: UpdateEmailTemplateInput) {
  try {
    await requireAdmin();

    // Validate input
    const validatedData = updateEmailTemplateSchema.parse(data);

    // Check if template exists
    const [existing] = await db
      .select()
      .from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Email template not found",
      };
    }

    // Check if name is taken by another template
    const [nameExists] = await db
      .select()
      .from(schema.emailTemplates)
      .where(
        sql`${schema.emailTemplates.name} = ${validatedData.name} AND ${schema.emailTemplates.id} != ${validatedData.id}`
      )
      .limit(1);

    if (nameExists) {
      return {
        success: false,
        error: "Email template name already exists",
      };
    }

    // Update the template
    const [updatedTemplate] = await db
      .update(schema.emailTemplates)
      .set({
        name: validatedData.name,
        subject: validatedData.subject,
        htmlContent: validatedData.htmlContent,
        textContent: validatedData.textContent,
        updatedAt: new Date(),
      })
      .where(eq(schema.emailTemplates.id, validatedData.id))
      .returning();

    revalidatePath("/admin/email-templates");

    return {
      success: true,
      data: updatedTemplate,
      message: "Email template updated successfully",
    };
  } catch (error) {
    console.error("Update email template error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update email template",
    };
  }
}

/**
 * Delete an email template (Admin only)
 */
export async function deleteEmailTemplate(id: string) {
  try {
    await requireAdmin();

    // Check if template exists
    const [existing] = await db
      .select()
      .from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Email template not found",
      };
    }

    // Delete the template
    await db.delete(schema.emailTemplates).where(eq(schema.emailTemplates.id, id));

    revalidatePath("/admin/email-templates");

    return {
      success: true,
      message: "Email template deleted successfully",
    };
  } catch (error) {
    console.error("Delete email template error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete email template",
    };
  }
}
