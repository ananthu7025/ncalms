import { z } from "zod";

// Session type validation schema
export const sessionTypeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
  description: z.string().optional(),
  duration: z.number().int().min(15, "Duration must be at least 15 minutes").max(480, "Duration cannot exceed 8 hours"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  isActive: z.boolean().default(true),
});

export const updateSessionTypeSchema = sessionTypeSchema.partial().extend({
  id: z.string().uuid("Invalid session type ID"),
});

// Booking request validation schema
export const bookingRequestSchema = z.object({
  sessionTypeId: z.string().uuid("Invalid session type ID"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  gmail: z.string().email("Invalid Gmail address").max(255, "Gmail is too long").optional().or(z.literal("")),
  whatsapp: z.string().max(50, "WhatsApp number is too long").optional().or(z.literal("")),
  province: z.string().max(100, "Province is too long").optional().or(z.literal("")),
  country: z.string().max(100, "Country is too long").optional().or(z.literal("")),
});

// Booking status update validation schema
export const bookingStatusUpdateSchema = z.object({
  id: z.string().uuid("Invalid booking ID"),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"], {
    message: "Invalid status. Must be pending, confirmed, completed, or cancelled",
  }),
  notes: z.string().optional(),
});

// TypeScript types
export type SessionTypeInput = z.infer<typeof sessionTypeSchema>;
export type UpdateSessionTypeInput = z.infer<typeof updateSessionTypeSchema>;
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
