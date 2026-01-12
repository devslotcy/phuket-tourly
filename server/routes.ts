import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { inquiryFormSchema } from "@shared/schema";
import { z } from "zod";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    adminId?: string;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000,
      }),
      secret: process.env.SESSION_SECRET || "phuket-tours-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.adminId = admin.id;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", async (req, res) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const admin = await storage.getAdminById(req.session.adminId);
    if (!admin) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ id: admin.id, email: admin.email, role: admin.role });
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const cats = await storage.getCategories();
      res.json(cats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const cat = await storage.createCategory(req.body);
      res.json(cat);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const cat = await storage.updateCategory(req.params.id, req.body);
      res.json(cat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/tours", async (req, res) => {
    try {
      const allTours = await storage.getTours();
      res.json(allTours);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tours" });
    }
  });

  app.get("/api/tours/:slug", async (req, res) => {
    try {
      const tour = await storage.getTourBySlug(req.params.slug);
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tour" });
    }
  });

  app.get("/api/admin/tours/:id", requireAdmin, async (req, res) => {
    try {
      const tour = await storage.getTourById(req.params.id);
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tour" });
    }
  });

  app.post("/api/admin/tours", requireAdmin, async (req, res) => {
    try {
      const { tour: tourData, translations, images } = req.body;
      const tour = await storage.createTour(tourData);
      if (translations) {
        const transArr = [];
        if (translations.en) transArr.push({ ...translations.en, tourId: tour.id, locale: "en" });
        if (translations.tr) transArr.push({ ...translations.tr, tourId: tour.id, locale: "tr" });
        for (const t of transArr) {
          await storage.createTourTranslation(t);
        }
      }
      if (images && images.length > 0) {
        await storage.updateTourImages(tour.id, images);
      }
      const enrichedTour = await storage.getTourById(tour.id);
      res.json(enrichedTour);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create tour" });
    }
  });

  app.put("/api/admin/tours/:id", requireAdmin, async (req, res) => {
    try {
      const { tour: tourData, translations, images } = req.body;
      await storage.updateTour(req.params.id, tourData);
      if (translations) {
        const transArr = [];
        if (translations.en) transArr.push({ ...translations.en, tourId: req.params.id, locale: "en" });
        if (translations.tr) transArr.push({ ...translations.tr, tourId: req.params.id, locale: "tr" });
        await storage.updateTourTranslations(req.params.id, transArr);
      }
      if (images) {
        await storage.updateTourImages(req.params.id, images);
      }
      const enrichedTour = await storage.getTourById(req.params.id);
      res.json(enrichedTour);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update tour" });
    }
  });

  app.delete("/api/admin/tours/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTour(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tour" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const parsed = inquiryFormSchema.parse(req.body);
      const inquiry = await storage.createInquiry(parsed);
      res.json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
    try {
      const inqs = await storage.getInquiries();
      res.json(inqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateInquiry(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  app.get("/api/faqs", async (req, res) => {
    try {
      const allFaqs = await storage.getFaqs();
      res.json(allFaqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get FAQs" });
    }
  });

  app.post("/api/admin/faqs", requireAdmin, async (req, res) => {
    try {
      const faq = await storage.createFaq(req.body);
      res.json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to create FAQ" });
    }
  });

  app.put("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    try {
      const faq = await storage.updateFaq(req.params.id, req.body);
      res.json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  });

  app.delete("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteFaq(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const allReviews = await storage.getReviews();
      res.json(allReviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.post("/api/admin/reviews", requireAdmin, async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.put("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
    try {
      const review = await storage.updateReview(req.params.id, req.body);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  app.delete("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteReview(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to get blog post" });
    }
  });

  app.get("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to get blog post" });
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const { post: postData, translations } = req.body;
      const post = await storage.createBlogPost(postData);
      if (translations) {
        const transArr = [];
        if (translations.en) transArr.push({ ...translations.en, blogPostId: post.id, locale: "en" });
        if (translations.tr) transArr.push({ ...translations.tr, blogPostId: post.id, locale: "tr" });
        for (const t of transArr) {
          await storage.createBlogPostTranslation(t);
        }
      }
      const enrichedPost = await storage.getBlogPostById(post.id);
      res.json(enrichedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const { post: postData, translations } = req.body;
      await storage.updateBlogPost(req.params.id, postData);
      if (translations) {
        const transArr = [];
        if (translations.en) transArr.push({ ...translations.en, blogPostId: req.params.id, locale: "en" });
        if (translations.tr) transArr.push({ ...translations.tr, blogPostId: req.params.id, locale: "tr" });
        await storage.updateBlogPostTranslations(req.params.id, transArr);
      }
      const enrichedPost = await storage.getBlogPostById(req.params.id);
      res.json(enrichedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  return httpServer;
}
