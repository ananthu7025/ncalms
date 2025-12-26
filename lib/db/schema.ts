import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  integer,
  decimal,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Platform settings table - stores global platform configuration (singleton table)
export const platformSettings = pgTable("platform_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  logoUrl: varchar("logo_url", { length: 500 }),
  platformName: varchar("platform_name", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }), // Additional business/display name
  paymentCurrency: varchar("payment_currency", { length: 3 }).notNull().default("USD"), // ISO 4217 code
  timezone: varchar("timezone", { length: 100 }).notNull().default("UTC"), // IANA timezone
  // Social Media Links
  whatsappNumber: varchar("whatsapp_number", { length: 50 }), // WhatsApp phone number with country code
  facebookUrl: varchar("facebook_url", { length: 500 }), // Facebook page URL
  twitterUrl: varchar("twitter_url", { length: 500 }), // Twitter/X profile URL
  instagramUrl: varchar("instagram_url", { length: 500 }), // Instagram profile URL
  linkedinUrl: varchar("linkedin_url", { length: 500 }), // LinkedIn company/profile URL
  youtubeUrl: varchar("youtube_url", { length: 500 }), // YouTube channel URL
  tiktokUrl: varchar("tiktok_url", { length: 500 }), // TikTok profile URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Learning streams table - defines major learning categories (NCA, Ontario Bar)
export const learningStreams = pgTable("learning_streams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(), // NCA, Ontario Bar
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Exam types table - defines exam categories within streams (Solicitor, Barrister for Ontario Bar)
export const examTypes = pgTable("exam_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  streamId: uuid("stream_id")
    .notNull()
    .references(() => learningStreams.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // Solicitor, Barrister
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  streamIdIdx: index("exam_types_stream_id_idx").on(table.streamId),
  // Ensure unique exam type names within a stream
  uniqueExamType: unique("unique_stream_exam_type").on(
    table.streamId,
    table.name
  ),
}));

// Users table - stores user information
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdIdx: index("users_role_id_idx").on(table.roleId),
  })
);

// Subjects table - stores individual subjects within learning streams/exam types
export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    thumbnail: varchar("thumbnail", { length: 500 }),
    demoVideoUrl: varchar("demo_video_url", { length: 500 }),
    streamId: uuid("stream_id")
      .notNull()
      .references(() => learningStreams.id, { onDelete: "restrict" }),
    examTypeId: uuid("exam_type_id")
      .references(() => examTypes.id, { onDelete: "restrict" }), // Optional: only for streams with exam types
    bundlePrice: decimal("bundle_price", { precision: 10, scale: 2 }), // Price for purchasing all content types together
    isBundleEnabled: boolean("is_bundle_enabled").default(false).notNull(), // Whether bundle purchase is available
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    streamIdIdx: index("subjects_stream_id_idx").on(table.streamId),
    examTypeIdIdx: index("subjects_exam_type_id_idx").on(table.examTypeId),
  })
);

// Content types table - defines types of content (VIDEO, PDF, MOCK)
export const contentTypes = pgTable("content_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(), // VIDEO, PDF, MOCK
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subject contents table - stores actual course content (PDFs, Videos, Question Bank) for subjects
export const subjectContents = pgTable(
  "subject_contents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    contentTypeId: uuid("content_type_id")
      .notNull()
      .references(() => contentTypes.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    fileUrl: varchar("file_url", { length: 500 }),
    duration: integer("duration"), // Duration in minutes for videos
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    subjectIdIdx: index("subject_contents_subject_id_idx").on(table.subjectId),
    contentTypeIdIdx: index("subject_contents_content_type_id_idx").on(table.contentTypeId),
  })
);

// Purchases table - records individual content purchases
export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id),
    contentTypeId: uuid("content_type_id")
      .references(() => contentTypes.id), // NULL for bundle purchases
    isBundle: boolean("is_bundle").default(false).notNull(), // True if this is a bundle purchase
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, paid, failed, refunded
    transactionId: varchar("transaction_id", { length: 255 }),
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("purchases_user_id_idx").on(table.userId),
    subjectIdIdx: index("purchases_subject_id_idx").on(table.subjectId),
    stripeSessionIdIdx: index("purchases_stripe_session_id_idx").on(table.stripeSessionId),
  })
);

// User access table - grants lifetime access to content
export const userAccess = pgTable(
  "user_access",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id),
    contentTypeId: uuid("content_type_id")
      .notNull()
      .references(() => contentTypes.id),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_access_user_id_idx").on(table.userId),
    subjectIdIdx: index("user_access_subject_id_idx").on(table.subjectId),
    // CRITICAL: Enforce uniqueness to prevent duplicate access grants
    uniqueUserAccess: unique("unique_user_subject_content").on(
      table.userId,
      table.subjectId,
      table.contentTypeId
    ),
  })
);

// Cart table - stores user shopping cart items
export const cart = pgTable(
  "cart",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    contentTypeId: uuid("content_type_id")
      .references(() => contentTypes.id), // NULL for bundle purchases
    isBundle: boolean("is_bundle").default(false).notNull(), // True if this is a bundle cart item
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("cart_user_id_idx").on(table.userId),
  })
);

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email templates table
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(), // e.g., 'RESET_PASSWORD', 'WELCOME_EMAIL'
  subject: varchar("subject", { length: 255 }).notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===========================
// RELATIONS
// ===========================

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const learningStreamsRelations = relations(learningStreams, ({ many }) => ({
  examTypes: many(examTypes),
  subjects: many(subjects),
}));

export const examTypesRelations = relations(examTypes, ({ one, many }) => ({
  stream: one(learningStreams, {
    fields: [examTypes.streamId],
    references: [learningStreams.id],
  }),
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  stream: one(learningStreams, {
    fields: [subjects.streamId],
    references: [learningStreams.id],
  }),
  examType: one(examTypes, {
    fields: [subjects.examTypeId],
    references: [examTypes.id],
  }),
  contents: many(subjectContents),
  purchases: many(purchases),
  userAccess: many(userAccess),
  cart: many(cart),
}));

export const contentTypesRelations = relations(contentTypes, ({ many }) => ({
  subjectContents: many(subjectContents),
  userAccess: many(userAccess),
  purchases: many(purchases),
  cart: many(cart),
}));

export const subjectContentsRelations = relations(subjectContents, ({ one }) => ({
  subject: one(subjects, {
    fields: [subjectContents.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [subjectContents.contentTypeId],
    references: [contentTypes.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [purchases.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [purchases.contentTypeId],
    references: [contentTypes.id],
  }),
}));

export const userAccessRelations = relations(userAccess, ({ one }) => ({
  user: one(users, {
    fields: [userAccess.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userAccess.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [userAccess.contentTypeId],
    references: [contentTypes.id],
  }),
}));

// Update existing user relations to include purchases and access
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  purchases: many(purchases),
  userAccess: many(userAccess),
  cartItems: many(cart),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [cart.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [cart.contentTypeId],
    references: [contentTypes.id],
  }),
}));

// ===========================
// TypeScript types inferred from schema
// ===========================

export type PlatformSettings = typeof platformSettings.$inferSelect;
export type NewPlatformSettings = typeof platformSettings.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type LearningStream = typeof learningStreams.$inferSelect;
export type NewLearningStream = typeof learningStreams.$inferInsert;

export type ExamType = typeof examTypes.$inferSelect;
export type NewExamType = typeof examTypes.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type ContentType = typeof contentTypes.$inferSelect;
export type NewContentType = typeof contentTypes.$inferInsert;

export type SubjectContent = typeof subjectContents.$inferSelect;
export type NewSubjectContent = typeof subjectContents.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;

export type UserAccess = typeof userAccess.$inferSelect;
export type NewUserAccess = typeof userAccess.$inferInsert;

export type Cart = typeof cart.$inferSelect;
export type NewCart = typeof cart.$inferInsert;

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;
