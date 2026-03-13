import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { inquiryFormSchema } from "@shared/schema";
import { z } from "zod";
import MemoryStore from "memorystore";
import { sendWhatsAppNotification, logInquiryNotification } from "./whatsapp-notifier";

const MemoryStoreSession = MemoryStore(session);

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

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

  // Change password endpoint
  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      const admin = await storage.getAdminById(req.session.adminId!);
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }

      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateAdminPassword(admin.id, newPasswordHash);

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Image upload endpoint
  app.post(
    "/api/admin/upload",
    requireAdmin,
    upload.single("image"),
    (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
      } catch (error) {
        res.status(500).json({ error: "Upload failed" });
      }
    }
  );

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

  app.get("/api/admin/stats/monthly-inquiries", requireAdmin, async (req, res) => {
    try {
      const monthlyStats = await storage.getMonthlyInquiriesStats();
      res.json(monthlyStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get monthly inquiries stats" });
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

      // Send notifications (console log + optional WhatsApp)
      logInquiryNotification(inquiry);

      // Attempt to send WhatsApp notification (requires Twilio setup)
      // This will fail gracefully if Twilio is not configured
      sendWhatsAppNotification(inquiry).catch((error) => {
        console.error("WhatsApp notification failed:", error);
      });

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

  // Sitemap cache
  let sitemapCache: { xml: string; timestamp: number } | null = null;
  const SITEMAP_CACHE_TTL = 60 * 60 * 1000; // 1 hour

  // Function to invalidate sitemap cache (called after content changes)
  function invalidateSitemapCache() {
    sitemapCache = null;
    console.log("✓ Sitemap cache invalidated");
  }

  // Sitemap.xml endpoint with caching
  app.get("/sitemap.xml", async (req, res) => {
    try {
      // Check cache
      if (sitemapCache && Date.now() - sitemapCache.timestamp < SITEMAP_CACHE_TTL) {
        res.header("Content-Type", "application/xml");
        res.header("X-Cache", "HIT");
        return res.send(sitemapCache.xml);
      }

      const baseUrl = process.env.SITE_URL || "https://cplusandaman.com";
      const currentDate = new Date().toISOString().split("T")[0];

      // Static pages
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/tours", priority: "0.9", changefreq: "daily" },
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/faq", priority: "0.7", changefreq: "weekly" },
        { url: "/reviews", priority: "0.7", changefreq: "weekly" },
        { url: "/blog", priority: "0.8", changefreq: "weekly" },
        { url: "/contact", priority: "0.8", changefreq: "monthly" },
      ];

      // Dynamic pages - tours (only published)
      const tours = await storage.getTours();
      const tourPages = tours
        .filter((tour) => tour.published)
        .map((tour) => ({
          url: `/tours/${tour.slug}`,
          priority: "0.8",
          changefreq: "weekly",
          lastmod: tour.updatedAt ? new Date(tour.updatedAt).toISOString().split("T")[0] : currentDate,
        }));

      // Dynamic pages - blog posts (only published)
      const blogPosts = await storage.getBlogPosts(true);
      const blogPages = blogPosts.map((post) => ({
        url: `/blog/${post.slug}`,
        priority: "0.6",
        changefreq: "monthly",
        lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : currentDate,
      }));

      // Combine all pages
      const allPages = [...staticPages, ...tourPages, ...blogPages];

      // Generate XML
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      // Cache the sitemap
      sitemapCache = { xml: sitemap, timestamp: Date.now() };

      res.header("Content-Type", "application/xml");
      res.header("X-Cache", "MISS");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  return httpServer;
}
