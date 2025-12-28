"use server";

import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireAuth } from "@/lib/auth/helpers";
import {
  sessionTypeSchema,
  updateSessionTypeSchema,
  bookingRequestSchema,
  bookingStatusUpdateSchema,
  type SessionTypeInput,
  type UpdateSessionTypeInput,
  type BookingRequestInput,
  type BookingStatusUpdateInput,
} from "@/lib/validations/sessions";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmationEmail, sendBookingCancellationEmail } from "@/lib/email/service";

// ===========================
// SESSION TYPE MANAGEMENT (ADMIN)
// ===========================

/**
 * Get all session types (admin)
 */
export async function getSessionTypes() {
  try {
    await requireAdmin();

    const sessionTypes = await db
      .select()
      .from(schema.sessionTypes)
      .orderBy(desc(schema.sessionTypes.createdAt));

    return {
      success: true,
      data: sessionTypes,
    };
  } catch (error) {
    console.error("Get session types error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch session types",
    };
  }
}

/**
 * Get active session types (for learners)
 */
export async function getActiveSessionTypes() {
  try {
    const sessionTypes = await db
      .select()
      .from(schema.sessionTypes)
      .where(eq(schema.sessionTypes.isActive, true))
      .orderBy(schema.sessionTypes.title);

    return {
      success: true,
      data: sessionTypes,
    };
  } catch (error) {
    console.error("Get active session types error:", error);
    return {
      success: false,
      error: "Failed to fetch session types",
    };
  }
}

/**
 * Create new session type (admin)
 */
export async function createSessionType(data: SessionTypeInput) {
  try {
    await requireAdmin();

    // Validate input
    const validated = sessionTypeSchema.parse(data);

    // Create session type
    const [sessionType] = await db
      .insert(schema.sessionTypes)
      .values({
        title: validated.title,
        description: validated.description,
        duration: validated.duration,
        price: validated.price,
        isActive: validated.isActive,
      })
      .returning();

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: sessionType,
      message: "Session type created successfully",
    };
  } catch (error) {
    console.error("Create session type error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create session type",
    };
  }
}

/**
 * Update session type (admin)
 */
export async function updateSessionType(data: UpdateSessionTypeInput) {
  try {
    await requireAdmin();

    // Validate input
    const validated = updateSessionTypeSchema.parse(data);

    // Update session type
    const [sessionType] = await db
      .update(schema.sessionTypes)
      .set({
        title: validated.title,
        description: validated.description,
        duration: validated.duration,
        price: validated.price,
        isActive: validated.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.sessionTypes.id, validated.id))
      .returning();

    if (!sessionType) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: sessionType,
      message: "Session type updated successfully",
    };
  } catch (error) {
    console.error("Update session type error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update session type",
    };
  }
}

/**
 * Delete session type (admin)
 */
export async function deleteSessionType(id: string) {
  try {
    await requireAdmin();

    // Check if there are any bookings for this session type
    const bookings = await db
      .select()
      .from(schema.sessionBookings)
      .where(eq(schema.sessionBookings.sessionTypeId, id))
      .limit(1);

    if (bookings.length > 0) {
      return {
        success: false,
        error: "Cannot delete session type with existing bookings. Set it as inactive instead.",
      };
    }

    // Delete session type
    const [deleted] = await db
      .delete(schema.sessionTypes)
      .where(eq(schema.sessionTypes.id, id))
      .returning();

    if (!deleted) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      message: "Session type deleted successfully",
    };
  } catch (error) {
    console.error("Delete session type error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete session type",
    };
  }
}

/**
 * Toggle session type active status (admin)
 */
export async function toggleSessionTypeStatus(id: string) {
  try {
    await requireAdmin();

    // Get current status
    const [current] = await db
      .select()
      .from(schema.sessionTypes)
      .where(eq(schema.sessionTypes.id, id))
      .limit(1);

    if (!current) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    // Toggle status
    const [updated] = await db
      .update(schema.sessionTypes)
      .set({
        isActive: !current.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.sessionTypes.id, id))
      .returning();

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: updated,
      message: `Session type ${updated.isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Toggle session type status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle session type status",
    };
  }
}

// ===========================
// BOOKING MANAGEMENT
// ===========================

/**
 * Create booking request (learner)
 */
export async function createBooking(data: BookingRequestInput) {
  try {
    const session = await requireAuth();

    // Validate input
    const validated = bookingRequestSchema.parse(data);

    // Verify session type exists and is active
    const [sessionType] = await db
      .select()
      .from(schema.sessionTypes)
      .where(eq(schema.sessionTypes.id, validated.sessionTypeId))
      .limit(1);

    if (!sessionType) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    if (!sessionType.isActive) {
      return {
        success: false,
        error: "This session type is no longer available",
      };
    }

    // Create booking with pending status
    const [booking] = await db
      .insert(schema.sessionBookings)
      .values({
        userId: session.user.id,
        sessionTypeId: validated.sessionTypeId,
        fullName: validated.fullName,
        email: validated.email,
        gmail: validated.gmail || null,
        whatsapp: validated.whatsapp || null,
        province: validated.province || null,
        country: validated.country || null,
        status: "pending",
      })
      .returning();

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: booking,
      message: "Booking request created successfully",
    };
  } catch (error) {
    console.error("Create booking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

/**
 * Get all bookings (admin)
 */
export async function getAllBookings() {
  try {
    await requireAdmin();

    const bookings = await db
      .select({
        booking: schema.sessionBookings,
        user: schema.users,
        sessionType: schema.sessionTypes,
      })
      .from(schema.sessionBookings)
      .leftJoin(schema.users, eq(schema.sessionBookings.userId, schema.users.id))
      .leftJoin(schema.sessionTypes, eq(schema.sessionBookings.sessionTypeId, schema.sessionTypes.id))
      .orderBy(desc(schema.sessionBookings.createdAt));

    return {
      success: true,
      data: bookings,
    };
  } catch (error) {
    console.error("Get all bookings error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}

/**
 * Get user's bookings (learner)
 */
export async function getMyBookings() {
  try {
    const session = await requireAuth();

    const bookings = await db
      .select({
        booking: schema.sessionBookings,
        sessionType: schema.sessionTypes,
      })
      .from(schema.sessionBookings)
      .leftJoin(schema.sessionTypes, eq(schema.sessionBookings.sessionTypeId, schema.sessionTypes.id))
      .where(eq(schema.sessionBookings.userId, session.user.id))
      .orderBy(desc(schema.sessionBookings.createdAt));

    return {
      success: true,
      data: bookings,
    };
  } catch (error) {
    console.error("Get my bookings error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}

/**
 * Update booking status (admin)
 */
export async function updateBookingStatus(data: BookingStatusUpdateInput) {
  try {
    await requireAdmin();

    // Validate input
    const validated = bookingStatusUpdateSchema.parse(data);

    // Get current booking
    const [currentBooking] = await db
      .select({
        booking: schema.sessionBookings,
        sessionType: schema.sessionTypes,
        user: schema.users,
      })
      .from(schema.sessionBookings)
      .leftJoin(schema.sessionTypes, eq(schema.sessionBookings.sessionTypeId, schema.sessionTypes.id))
      .leftJoin(schema.users, eq(schema.sessionBookings.userId, schema.users.id))
      .where(eq(schema.sessionBookings.id, validated.id))
      .limit(1);

    if (!currentBooking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    const previousStatus = currentBooking.booking.status;

    // Update booking status
    const [updatedBooking] = await db
      .update(schema.sessionBookings)
      .set({
        status: validated.status,
        notes: validated.notes,
        updatedAt: new Date(),
      })
      .where(eq(schema.sessionBookings.id, validated.id))
      .returning();

    // Send email notifications based on status change
    if (validated.status === "confirmed" && previousStatus !== "confirmed") {
      // Send confirmation email
      await sendBookingConfirmationEmail({
        email: updatedBooking.email,
        fullName: updatedBooking.fullName,
        sessionTitle: currentBooking.sessionType?.title || "Session",
        sessionDuration: currentBooking.sessionType?.duration || 0,
        sessionPrice: currentBooking.sessionType?.price || "0",
        bookingId: updatedBooking.id,
      });
    } else if (validated.status === "cancelled" && previousStatus !== "cancelled") {
      // Send cancellation email
      await sendBookingCancellationEmail({
        email: updatedBooking.email,
        fullName: updatedBooking.fullName,
        sessionTitle: currentBooking.sessionType?.title || "Session",
        bookingId: updatedBooking.id,
      });
    }

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: updatedBooking,
      message: "Booking status updated successfully",
    };
  } catch (error) {
    console.error("Update booking status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update booking status",
    };
  }
}

/**
 * Cancel booking (learner or admin)
 */
export async function cancelBooking(id: string) {
  try {
    const session = await requireAuth();

    // Get booking
    const [booking] = await db
      .select({
        booking: schema.sessionBookings,
        sessionType: schema.sessionTypes,
      })
      .from(schema.sessionBookings)
      .leftJoin(schema.sessionTypes, eq(schema.sessionBookings.sessionTypeId, schema.sessionTypes.id))
      .where(eq(schema.sessionBookings.id, id))
      .limit(1);

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Check if user owns this booking or is admin
    const isAdmin = session.user.role === "admin";
    const isOwner = booking.booking.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return {
        success: false,
        error: "You don't have permission to cancel this booking",
      };
    }

    // Can only cancel pending or confirmed bookings
    if (booking.booking.status === "completed" || booking.booking.status === "cancelled") {
      return {
        success: false,
        error: `Cannot cancel a ${booking.booking.status} booking`,
      };
    }

    // Update booking status to cancelled
    const [updatedBooking] = await db
      .update(schema.sessionBookings)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(schema.sessionBookings.id, id))
      .returning();

    // Send cancellation email
    await sendBookingCancellationEmail({
      email: updatedBooking.email,
      fullName: updatedBooking.fullName,
      sessionTitle: booking.sessionType?.title || "Session",
      bookingId: updatedBooking.id,
    });

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: updatedBooking,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Cancel booking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel booking",
    };
  }
}

// ===========================
// PUBLIC BOOKING (NO AUTH REQUIRED)
// ===========================

/**
 * Create booking request from public page (no authentication required)
 * Will auto-create user account if email doesn't exist
 */
export async function createPublicBooking(data: BookingRequestInput) {
  try {
    // Validate input
    const validated = bookingRequestSchema.parse(data);

    // Verify session type exists and is active
    const [sessionType] = await db
      .select()
      .from(schema.sessionTypes)
      .where(eq(schema.sessionTypes.id, validated.sessionTypeId))
      .limit(1);

    if (!sessionType) {
      return {
        success: false,
        error: "Session type not found",
      };
    }

    if (!sessionType.isActive) {
      return {
        success: false,
        error: "This session type is no longer available",
      };
    }

    // Check if user exists with this email
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, validated.email))
      .limit(1);

    let userId: string;

    if (existingUser) {
      // Use existing user
      userId = existingUser.id;
    } else {
      // Get USER role ID (for learners)
      const [userRole] = await db
        .select()
        .from(schema.roles)
        .where(eq(schema.roles.name, "USER"))
        .limit(1);

      if (!userRole) {
        return {
          success: false,
          error: "System configuration error: USER role not found",
        };
      }

      // Create new user account automatically
      // Use a temporary password hash - user will need to set password via reset
      const [newUser] = await db
        .insert(schema.users)
        .values({
          name: validated.fullName,
          email: validated.email,
          passwordHash: "", // User will set password later
          roleId: userRole.id,
          isActive: true,
        })
        .returning();

      userId = newUser.id;
    }

    // Create booking with pending status
    const [booking] = await db
      .insert(schema.sessionBookings)
      .values({
        userId,
        sessionTypeId: validated.sessionTypeId,
        fullName: validated.fullName,
        email: validated.email,
        gmail: validated.gmail || null,
        whatsapp: validated.whatsapp || null,
        province: validated.province || null,
        country: validated.country || null,
        status: "pending",
      })
      .returning();

    revalidatePath("/admin/sessions");
    revalidatePath("/learner/book-session");

    return {
      success: true,
      data: booking,
      message: "Booking request created successfully",
    };
  } catch (error) {
    console.error("Create public booking error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}
