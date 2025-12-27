import { z } from "zod";

// ===========================
// LEARNING STREAMS
// ===========================
export const createLearningStreamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional().nullable(),
});

export const updateLearningStreamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional().nullable(),
});

// ===========================
// EXAM TYPES
// ===========================
export const createExamTypeSchema = z.object({
  streamId: z.string().uuid("Invalid stream ID"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional().nullable(),
});

export const updateExamTypeSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  streamId: z.string().uuid("Invalid stream ID"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().optional().nullable(),
});

// ===========================
// CONTENT TYPES
// ===========================
export const createContentTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().optional().nullable(),
});

export const updateContentTypeSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().optional().nullable(),
});

// ===========================
// SUBJECTS
// ===========================
export const createSubjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().optional().nullable(),
  thumbnail: z.string().max(500, "URL too long").optional().nullable(),
  demoVideoUrl: z.string().url("Invalid URL").max(500, "URL too long").optional().nullable(),
  streamId: z.string().uuid("Invalid stream ID"),
  examTypeId: z.string().uuid("Invalid exam type ID").optional().nullable(),
  bundlePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional().nullable(),
  isBundleEnabled: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateSubjectSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().optional().nullable(),
  thumbnail: z.string().max(500, "URL too long").optional().nullable(),
  demoVideoUrl: z.string().url("Invalid URL").max(500, "URL too long").optional().nullable(),
  streamId: z.string().uuid("Invalid stream ID"),
  examTypeId: z.string().uuid("Invalid exam type ID").optional().nullable(),
  bundlePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional().nullable(),
  isBundleEnabled: z.boolean(),
  isActive: z.boolean(),
});

// ===========================
// SUBJECT CONTENTS
// ===========================
export const createSubjectContentSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID"),
  contentTypeId: z.string().uuid("Invalid content type ID"),
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(), // Accept JSON string or single URL
  duration: z.number().int().positive().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").default("0"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateSubjectContentSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  subjectId: z.string().uuid("Invalid subject ID"),
  contentTypeId: z.string().uuid("Invalid content type ID"),
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(), // Accept JSON string or single URL
  duration: z.number().int().positive().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

// ===========================
// S3 UPLOAD
// ===========================
export const getUploadUrlSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  subjectId: z.string().uuid("Invalid subject ID"),
  contentType: z.enum(["video", "pdf"], {
    message: "Content type must be either 'video' or 'pdf'",
  }),
});

// ===========================
// OFFERS
// ===========================
export const createOfferSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters"),
  code: z.string().min(3, "Code must be at least 3 characters").max(100, "Code must be less than 100 characters").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"], {
    message: "Discount type must be either 'percentage' or 'fixed'",
  }),
  discountValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid discount value format"),
  subjectId: z.string().uuid("Invalid subject ID").optional().nullable(),
  contentTypeId: z.string().uuid("Invalid content type ID").optional().nullable(),
  maxUsage: z.number().int().positive("Max usage must be a positive number").optional().nullable(),
  validFrom: z.date({
    message: "Valid from date is required",
  }),
  validUntil: z.date({
    message: "Valid until date is required",
  }),
  isActive: z.boolean().default(true),
}).refine((data) => data.validUntil > data.validFrom, {
  message: "Valid until date must be after valid from date",
  path: ["validUntil"],
});

export const updateOfferSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters"),
  code: z.string().min(3, "Code must be at least 3 characters").max(100, "Code must be less than 100 characters").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"], {
    message: "Discount type must be either 'percentage' or 'fixed'",
  }),
  discountValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid discount value format"),
  subjectId: z.string().uuid("Invalid subject ID").optional().nullable(),
  contentTypeId: z.string().uuid("Invalid content type ID").optional().nullable(),
  maxUsage: z.number().int().positive("Max usage must be a positive number").optional().nullable(),
  validFrom: z.date({
    message: "Valid from date is required",
  }),
  validUntil: z.date({
    message: "Valid until date is required",
  }),
  isActive: z.boolean(),
}).refine((data) => data.validUntil > data.validFrom, {
  message: "Valid until date must be after valid from date",
  path: ["validUntil"],
});

// ===========================
// EMAIL TEMPLATES
// ===========================
export const createEmailTemplateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").toUpperCase(),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(255, "Subject must be less than 255 characters"),
  htmlContent: z.string().min(10, "HTML content must be at least 10 characters"),
  textContent: z.string().min(10, "Text content must be at least 10 characters"),
});

export const updateEmailTemplateSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").toUpperCase(),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(255, "Subject must be less than 255 characters"),
  htmlContent: z.string().min(10, "HTML content must be at least 10 characters"),
  textContent: z.string().min(10, "Text content must be at least 10 characters"),
});

// ===========================
// TYPE EXPORTS
// ===========================
export type CreateLearningStreamInput = z.infer<typeof createLearningStreamSchema>;
export type UpdateLearningStreamInput = z.infer<typeof updateLearningStreamSchema>;

export type CreateExamTypeInput = z.infer<typeof createExamTypeSchema>;
export type UpdateExamTypeInput = z.infer<typeof updateExamTypeSchema>;

export type CreateContentTypeInput = z.infer<typeof createContentTypeSchema>;
export type UpdateContentTypeInput = z.infer<typeof updateContentTypeSchema>;

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;

export type CreateSubjectContentInput = z.infer<typeof createSubjectContentSchema>;
export type UpdateSubjectContentInput = z.infer<typeof updateSubjectContentSchema>;

export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
