import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const inquiryStatusEnum = pgEnum("inquiry_status", ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"]);

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameTr: text("name_tr").notNull(),
});

// Tours Table
export const tours = pgTable("tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").default(false).notNull(),
  popular: boolean("popular").default(false).notNull(),
  priceFrom: integer("price_from").notNull(),
  duration: text("duration").notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tour Translations Table
export const tourTranslations = pgTable("tour_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").references(() => tours.id, { onDelete: "cascade" }).notNull(),
  locale: text("locale").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  highlights: text("highlights").notNull(),
  itinerary: text("itinerary").notNull(),
  includes: text("includes").notNull(),
  excludes: text("excludes").notNull(),
  pickupInfo: text("pickup_info"),
  cancellationPolicy: text("cancellation_policy"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

// Tour Images Table
export const tourImages = pgTable("tour_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").references(() => tours.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0),
});

// Inquiries Table
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").references(() => tours.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  date: text("date"),
  peopleCount: integer("people_count"),
  hotel: text("hotel"),
  message: text("message"),
  status: inquiryStatusEnum("status").default("NEW").notNull(),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// FAQs Table
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionEn: text("question_en").notNull(),
  answerEn: text("answer_en").notNull(),
  questionTr: text("question_tr").notNull(),
  answerTr: text("answer_tr").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  textEn: text("text_en").notNull(),
  textTr: text("text_tr").notNull(),
  source: text("source"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  tags: text("tags"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Post Translations Table
export const blogPostTranslations = pgTable("blog_post_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blogPostId: varchar("blog_post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
  locale: text("locale").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

// Relations
export const toursRelations = relations(tours, ({ one, many }) => ({
  category: one(categories, {
    fields: [tours.categoryId],
    references: [categories.id],
  }),
  translations: many(tourTranslations),
  images: many(tourImages),
  inquiries: many(inquiries),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tours: many(tours),
}));

export const tourTranslationsRelations = relations(tourTranslations, ({ one }) => ({
  tour: one(tours, {
    fields: [tourTranslations.tourId],
    references: [tours.id],
  }),
}));

export const tourImagesRelations = relations(tourImages, ({ one }) => ({
  tour: one(tours, {
    fields: [tourImages.tourId],
    references: [tours.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  tour: one(tours, {
    fields: [inquiries.tourId],
    references: [tours.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ many }) => ({
  translations: many(blogPostTranslations),
}));

export const blogPostTranslationsRelations = relations(blogPostTranslations, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [blogPostTranslations.blogPostId],
    references: [blogPosts.id],
  }),
}));

// Insert Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertTourSchema = createInsertSchema(tours).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTourTranslationSchema = createInsertSchema(tourTranslations).omit({ id: true });
export const insertTourImageSchema = createInsertSchema(tourImages).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, status: true, internalNotes: true });
export const insertFaqSchema = createInsertSchema(faqs).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPostTranslationSchema = createInsertSchema(blogPostTranslations).omit({ id: true });

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tour = typeof tours.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;

export type TourTranslation = typeof tourTranslations.$inferSelect;
export type InsertTourTranslation = z.infer<typeof insertTourTranslationSchema>;

export type TourImage = typeof tourImages.$inferSelect;
export type InsertTourImage = z.infer<typeof insertTourImageSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogPostTranslation = typeof blogPostTranslations.$inferSelect;
export type InsertBlogPostTranslation = z.infer<typeof insertBlogPostTranslationSchema>;

// Extended types for frontend
export type TourWithDetails = Tour & {
  category?: Category | null;
  translations: TourTranslation[];
  images: TourImage[];
};

export type BlogPostWithDetails = BlogPost & {
  translations: BlogPostTranslation[];
};

// Validation schemas for forms
export const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  date: z.string().optional(),
  peopleCount: z.number().min(1).optional(),
  hotel: z.string().optional(),
  message: z.string().optional(),
  tourId: z.string().optional(),
});

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
