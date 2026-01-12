import {
  adminUsers, categories, tours, tourTranslations, tourImages,
  inquiries, faqs, reviews, blogPosts, blogPostTranslations,
  type AdminUser, type InsertAdminUser,
  type Category, type InsertCategory,
  type Tour, type InsertTour,
  type TourTranslation, type InsertTourTranslation,
  type TourImage, type InsertTourImage,
  type Inquiry, type InsertInquiry,
  type FAQ, type InsertFAQ,
  type Review, type InsertReview,
  type BlogPost, type InsertBlogPost,
  type BlogPostTranslation, type InsertBlogPostTranslation,
  type TourWithDetails, type BlogPostWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  getAdminById(id: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  updateAdminPassword(id: string, passwordHash: string): Promise<void>;
  getAdminCount(): Promise<number>;

  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  getTours(): Promise<TourWithDetails[]>;
  getTourBySlug(slug: string): Promise<TourWithDetails | undefined>;
  getTourById(id: string): Promise<TourWithDetails | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: string, tour: Partial<InsertTour>): Promise<Tour | undefined>;
  deleteTour(id: string): Promise<void>;

  createTourTranslation(translation: InsertTourTranslation): Promise<TourTranslation>;
  updateTourTranslations(tourId: string, translations: InsertTourTranslation[]): Promise<void>;
  deleteTourTranslations(tourId: string): Promise<void>;

  createTourImage(image: InsertTourImage): Promise<TourImage>;
  updateTourImages(tourId: string, images: { url: string; alt?: string }[]): Promise<void>;
  deleteTourImages(tourId: string): Promise<void>;

  getInquiries(): Promise<Inquiry[]>;
  getInquiryById(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | undefined>;

  getFaqs(): Promise<FAQ[]>;
  getFaqById(id: string): Promise<FAQ | undefined>;
  createFaq(faq: InsertFAQ): Promise<FAQ>;
  updateFaq(id: string, faq: Partial<InsertFAQ>): Promise<FAQ | undefined>;
  deleteFaq(id: string): Promise<void>;

  getReviews(): Promise<Review[]>;
  getReviewById(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<void>;

  getBlogPosts(publishedOnly?: boolean): Promise<BlogPostWithDetails[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPostWithDetails | undefined>;
  getBlogPostById(id: string): Promise<BlogPostWithDetails | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  createBlogPostTranslation(translation: InsertBlogPostTranslation): Promise<BlogPostTranslation>;
  updateBlogPostTranslations(postId: string, translations: InsertBlogPostTranslation[]): Promise<void>;
  deleteBlogPostTranslations(postId: string): Promise<void>;

  getStats(): Promise<{
    totalTours: number;
    totalInquiries: number;
    newInquiries: number;
    totalReviews: number;
    totalBlogPosts: number;
    totalFaqs: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values(admin).returning();
    return created;
  }

  async updateAdminPassword(id: string, passwordHash: string): Promise<void> {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
  }

  async getAdminCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(adminUsers);
    return Number(result[0]?.count || 0);
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id));
    return cat || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.update(tours).set({ categoryId: null }).where(eq(tours.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getTours(): Promise<TourWithDetails[]> {
    const allTours = await db.select().from(tours).orderBy(desc(tours.createdAt));
    return Promise.all(allTours.map((t) => this.enrichTour(t)));
  }

  async getTourBySlug(slug: string): Promise<TourWithDetails | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.slug, slug));
    if (!tour) return undefined;
    return this.enrichTour(tour);
  }

  async getTourById(id: string): Promise<TourWithDetails | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    if (!tour) return undefined;
    return this.enrichTour(tour);
  }

  private async enrichTour(tour: Tour): Promise<TourWithDetails> {
    const [translations, images, category] = await Promise.all([
      db.select().from(tourTranslations).where(eq(tourTranslations.tourId, tour.id)),
      db.select().from(tourImages).where(eq(tourImages.tourId, tour.id)).orderBy(tourImages.sortOrder),
      tour.categoryId ? db.select().from(categories).where(eq(categories.id, tour.categoryId)).then((r) => r[0]) : null,
    ]);
    return { ...tour, translations, images, category };
  }

  async createTour(tour: InsertTour): Promise<Tour> {
    const [created] = await db.insert(tours).values(tour).returning();
    return created;
  }

  async updateTour(id: string, tour: Partial<InsertTour>): Promise<Tour | undefined> {
    const [updated] = await db.update(tours).set({ ...tour, updatedAt: new Date() }).where(eq(tours.id, id)).returning();
    return updated || undefined;
  }

  async deleteTour(id: string): Promise<void> {
    await db.delete(tourTranslations).where(eq(tourTranslations.tourId, id));
    await db.delete(tourImages).where(eq(tourImages.tourId, id));
    await db.delete(tours).where(eq(tours.id, id));
  }

  async createTourTranslation(translation: InsertTourTranslation): Promise<TourTranslation> {
    const [created] = await db.insert(tourTranslations).values(translation).returning();
    return created;
  }

  async updateTourTranslations(tourId: string, translations: InsertTourTranslation[]): Promise<void> {
    await db.delete(tourTranslations).where(eq(tourTranslations.tourId, tourId));
    if (translations.length > 0) {
      await db.insert(tourTranslations).values(translations);
    }
  }

  async deleteTourTranslations(tourId: string): Promise<void> {
    await db.delete(tourTranslations).where(eq(tourTranslations.tourId, tourId));
  }

  async createTourImage(image: InsertTourImage): Promise<TourImage> {
    const [created] = await db.insert(tourImages).values(image).returning();
    return created;
  }

  async updateTourImages(tourId: string, images: { url: string; alt?: string }[]): Promise<void> {
    await db.delete(tourImages).where(eq(tourImages.tourId, tourId));
    if (images.length > 0) {
      await db.insert(tourImages).values(images.map((img, i) => ({ tourId, url: img.url, alt: img.alt, sortOrder: i })));
    }
  }

  async deleteTourImages(tourId: string): Promise<void> {
    await db.delete(tourImages).where(eq(tourImages.tourId, tourId));
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiryById(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db.insert(inquiries).values(inquiry).returning();
    return created;
  }

  async updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const [updated] = await db.update(inquiries).set(data).where(eq(inquiries.id, id)).returning();
    return updated || undefined;
  }

  async getFaqs(): Promise<FAQ[]> {
    return await db.select().from(faqs).orderBy(faqs.sortOrder);
  }

  async getFaqById(id: string): Promise<FAQ | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }

  async createFaq(faq: InsertFAQ): Promise<FAQ> {
    const [created] = await db.insert(faqs).values(faq).returning();
    return created;
  }

  async updateFaq(id: string, faq: Partial<InsertFAQ>): Promise<FAQ | undefined> {
    const [updated] = await db.update(faqs).set(faq).where(eq(faqs.id, id)).returning();
    return updated || undefined;
  }

  async deleteFaq(id: string): Promise<void> {
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async getReviewById(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined> {
    const [updated] = await db.update(reviews).set(review).where(eq(reviews.id, id)).returning();
    return updated || undefined;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async getBlogPosts(publishedOnly = false): Promise<BlogPostWithDetails[]> {
    let query = db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    const allPosts = publishedOnly
      ? await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt))
      : await query;
    return Promise.all(allPosts.map((p) => this.enrichBlogPost(p)));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPostWithDetails | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    if (!post) return undefined;
    return this.enrichBlogPost(post);
  }

  async getBlogPostById(id: string): Promise<BlogPostWithDetails | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!post) return undefined;
    return this.enrichBlogPost(post);
  }

  private async enrichBlogPost(post: BlogPost): Promise<BlogPostWithDetails> {
    const translations = await db.select().from(blogPostTranslations).where(eq(blogPostTranslations.blogPostId, post.id));
    return { ...post, translations };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPostTranslations).where(eq(blogPostTranslations.blogPostId, id));
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async createBlogPostTranslation(translation: InsertBlogPostTranslation): Promise<BlogPostTranslation> {
    const [created] = await db.insert(blogPostTranslations).values(translation).returning();
    return created;
  }

  async updateBlogPostTranslations(postId: string, translations: InsertBlogPostTranslation[]): Promise<void> {
    await db.delete(blogPostTranslations).where(eq(blogPostTranslations.blogPostId, postId));
    if (translations.length > 0) {
      await db.insert(blogPostTranslations).values(translations);
    }
  }

  async deleteBlogPostTranslations(postId: string): Promise<void> {
    await db.delete(blogPostTranslations).where(eq(blogPostTranslations.blogPostId, postId));
  }

  async getStats(): Promise<{
    totalTours: number;
    totalInquiries: number;
    newInquiries: number;
    totalReviews: number;
    totalBlogPosts: number;
    totalFaqs: number;
  }> {
    const [tourCount, inquiryCount, newInquiryCount, reviewCount, blogCount, faqCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(tours),
      db.select({ count: sql<number>`count(*)` }).from(inquiries),
      db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.status, "NEW")),
      db.select({ count: sql<number>`count(*)` }).from(reviews),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts),
      db.select({ count: sql<number>`count(*)` }).from(faqs),
    ]);
    return {
      totalTours: Number(tourCount[0]?.count || 0),
      totalInquiries: Number(inquiryCount[0]?.count || 0),
      newInquiries: Number(newInquiryCount[0]?.count || 0),
      totalReviews: Number(reviewCount[0]?.count || 0),
      totalBlogPosts: Number(blogCount[0]?.count || 0),
      totalFaqs: Number(faqCount[0]?.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();
