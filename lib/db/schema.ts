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
  // All Subjects Bundle Pricing
  allSubjectsBundlePrice: decimal("all_subjects_bundle_price", { precision: 10, scale: 2 }), // Price for purchasing all subjects
  allSubjectsBundleEnabled: boolean("all_subjects_bundle_enabled").default(false).notNull(), // Whether all-subjects bundle is available
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
    isActiveIdx: index("users_is_active_idx").on(table.isActive),
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
    syllabusPdfUrl: varchar("syllabus_pdf_url", { length: 500 }), // URL to syllabus PDF
    objectives: text("objectives"), // JSON array of course objectives
    additionalCoverage: text("additional_coverage"), // Additional topics covered beyond main syllabus
    streamId: uuid("stream_id")
      .notNull()
      .references(() => learningStreams.id, { onDelete: "restrict" }),
    examTypeId: uuid("exam_type_id")
      .references(() => examTypes.id, { onDelete: "restrict" }), // Optional: only for streams with exam types
    bundlePrice: decimal("bundle_price", { precision: 10, scale: 2 }), // Price for purchasing all content types together
    isBundleEnabled: boolean("is_bundle_enabled").default(false).notNull(), // Whether bundle purchase is available
    isFeatured: boolean("is_featured").default(false).notNull(), // Whether course is featured
    isMandatory: boolean("is_mandatory").default(false).notNull(), // Whether course is mandatory
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    streamIdIdx: index("subjects_stream_id_idx").on(table.streamId),
    examTypeIdIdx: index("subjects_exam_type_id_idx").on(table.examTypeId),
    isActiveIdx: index("subjects_is_active_idx").on(table.isActive),
  })
);

// Content types table - defines types of content (VIDEO, PDF, MOCK)
export const contentTypes = pgTable("content_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).unique().notNull(), // VIDEO, PDF, MOCK
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subject content type pricing table - defines prices for each content type per subject
export const subjectContentTypePricing = pgTable(
  "subject_content_type_pricing",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    contentTypeId: uuid("content_type_id")
      .notNull()
      .references(() => contentTypes.id, { onDelete: "cascade" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    subjectIdIdx: index("subject_content_type_pricing_subject_id_idx").on(table.subjectId),
    contentTypeIdIdx: index("subject_content_type_pricing_content_type_id_idx").on(table.contentTypeId),
    // Ensure unique pricing per subject per content type
    uniquePricing: unique("unique_subject_content_type_pricing").on(
      table.subjectId,
      table.contentTypeId
    ),
  })
);

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
    fileUrl: text("file_url"), // Stores JSON array of file URLs
    duration: integer("duration"), // Duration in minutes for videos
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
    statusIdx: index("purchases_status_idx").on(table.status),
    userSubjectIdx: index("purchases_user_subject_idx").on(table.userId, table.subjectId),
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

// Offers/Coupons table - stores promotional discount codes
export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 100 }).unique().notNull(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // 'percentage' or 'fixed'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }), // NULL for all courses
  contentTypeId: uuid("content_type_id").references(() => contentTypes.id), // NULL for all bundles
  maxUsage: integer("max_usage"), // NULL for unlimited
  currentUsage: integer("current_usage").default(0).notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: index("offers_code_idx").on(table.code),
  activeIdx: index("offers_active_idx").on(table.isActive),
}));

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

// Session types table - defines available session types for booking
export const sessionTypes = pgTable("session_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // Duration in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Session bookings table - stores booking requests from learners
export const sessionBookings = pgTable(
  "session_bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionTypeId: uuid("session_type_id")
      .notNull()
      .references(() => sessionTypes.id, { onDelete: "restrict" }),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    gmail: varchar("gmail", { length: 255 }),
    whatsapp: varchar("whatsapp", { length: 50 }),
    province: varchar("province", { length: 100 }),
    country: varchar("country", { length: 100 }),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, completed, cancelled
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    stripePurchaseId: varchar("stripe_purchase_id", { length: 255 }),
    amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
    notes: text("notes"), // For admin notes
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("session_bookings_user_id_idx").on(table.userId),
    sessionTypeIdIdx: index("session_bookings_session_type_id_idx").on(table.sessionTypeId),
    statusIdx: index("session_bookings_status_idx").on(table.status),
    stripeSessionIdIdx: index("session_bookings_stripe_session_id_idx").on(table.stripeSessionId),
  })
);

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
  offers: many(offers),
  subjectContentTypePricing: many(subjectContentTypePricing),
}));

export const contentTypesRelations = relations(contentTypes, ({ many }) => ({
  subjectContents: many(subjectContents),
  userAccess: many(userAccess),
  purchases: many(purchases),
  cart: many(cart),
  offers: many(offers),
  subjectContentTypePricing: many(subjectContentTypePricing),
}));

export const subjectContentTypePricingRelations = relations(subjectContentTypePricing, ({ one }) => ({
  subject: one(subjects, {
    fields: [subjectContentTypePricing.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [subjectContentTypePricing.contentTypeId],
    references: [contentTypes.id],
  }),
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
  sessionBookings: many(sessionBookings),
  supportTickets: many(supportTickets),
  blogPosts: many(blogPosts),
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

export const sessionTypesRelations = relations(sessionTypes, ({ many }) => ({
  bookings: many(sessionBookings),
}));

export const sessionBookingsRelations = relations(sessionBookings, ({ one }) => ({
  user: one(users, {
    fields: [sessionBookings.userId],
    references: [users.id],
  }),
  sessionType: one(sessionTypes, {
    fields: [sessionBookings.sessionTypeId],
    references: [sessionTypes.id],
  }),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  subject: one(subjects, {
    fields: [offers.subjectId],
    references: [subjects.id],
  }),
  contentType: one(contentTypes, {
    fields: [offers.contentTypeId],
    references: [contentTypes.id],
  }),
}));

// Support tickets table - stores user support requests
export const supportTickets = pgTable(
  "support_tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 500 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(), // issue, question, feedback, refund
    status: varchar("status", { length: 50 }).notNull().default("new"), // new, pending, resolved
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("support_tickets_user_id_idx").on(table.userId),
    statusIdx: index("support_tickets_status_idx").on(table.status),
  })
);

// Support ticket messages table - stores conversation thread for each ticket
export const supportTicketMessages = pgTable(
  "support_ticket_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => supportTickets.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), // NULL for system messages
    message: text("message").notNull(),
    isFromAdmin: boolean("is_from_admin").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    ticketIdIdx: index("support_ticket_messages_ticket_id_idx").on(table.ticketId),
  })
);

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  messages: many(supportTicketMessages),
}));

export const supportTicketMessagesRelations = relations(supportTicketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportTicketMessages.ticketId],
    references: [supportTickets.id],
  }),
  user: one(users, {
    fields: [supportTicketMessages.userId],
    references: [users.id],
  }),
}));

// Blog posts table - stores blog articles
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).unique().notNull(),
    image: varchar("image", { length: 1000 }), // Featured image URL
    content: text("content").notNull(), // Main blog content (HTML/Markdown)
    excerpt: text("excerpt"), // Short summary for listing pages
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("blog_posts_slug_idx").on(table.slug),
    authorIdIdx: index("blog_posts_author_id_idx").on(table.authorId),
    publishedIdx: index("blog_posts_published_idx").on(table.isPublished),
  })
);

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
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

export type SessionType = typeof sessionTypes.$inferSelect;
export type NewSessionType = typeof sessionTypes.$inferInsert;

export type SessionBooking = typeof sessionBookings.$inferSelect;
export type NewSessionBooking = typeof sessionBookings.$inferInsert;

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type NewSupportTicket = typeof supportTickets.$inferInsert;

export type SupportTicketMessage = typeof supportTicketMessages.$inferSelect;
export type NewSupportTicketMessage = typeof supportTicketMessages.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type SubjectContentTypePricing = typeof subjectContentTypePricing.$inferSelect;
export type NewSubjectContentTypePricing = typeof subjectContentTypePricing.$inferInsert;
