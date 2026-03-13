# C Plus Andaman Travel | Phuket

A modern, inquiry-first tour platform built with React, Express, and PostgreSQL. Branded for **C Plus Andaman Travel**, a premium travel agency in Patong, Phuket, Thailand. Designed to prioritize personalized service over transactional bookings with strong SEO for ranking "Phuket tours" in Google.

## 🎯 Philosophy

This platform follows an **inquiry-first** approach:
- No aggressive "Book Now" or checkout flows
- WhatsApp as primary conversion channel
- Personal touch with inquiry management
- Premium, informative tone throughout

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Express + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Express Session + bcrypt
- **File Uploads**: Multer
- **i18n**: English + Turkish
- **SEO**: react-helmet-async + JSON-LD structured data
- **Sitemap**: Dynamic generation from database

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd Phuket-Tourly
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/phuket_tourly"

# Session Secret (change in production!)
SESSION_SECRET="your-secret-key-change-in-production"

# Server
PORT=3001
NODE_ENV=development
SITE_URL="http://localhost:3001"  # Change to your domain in production

# WhatsApp - C Plus Andaman Travel
VITE_WHATSAPP_NUMBER="+66954416562"

# Google Reviews (optional - for future implementation)
GOOGLE_MAPS_API_KEY=""
GOOGLE_PLACE_ID=""
```

**Important**:
- C Plus Andaman Travel phone: `+66 95 441 6562` (already configured)
- Update `SITE_URL` to your actual domain in production (e.g., `https://cplusandaman.com`)

### 3. Database Setup

```bash
# Create database
createdb phuket_tourly

# Push schema
npm run db:push

# Database will auto-seed on first run with:
# - Admin user: admin@phuket-tours.com / Admin123!
# - Sample categories, tours, FAQs, reviews, blog posts
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3001

## 📁 Project Structure

```
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── admin/     # Admin-specific components
│   │   │   ├── forms/     # Inquiry forms
│   │   │   ├── home/      # Homepage sections
│   │   │   ├── layout/    # Header, Footer, Layouts
│   │   │   ├── tours/     # Tour cards and lists
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities (i18n, queryClient, whatsapp)
│   │   ├── pages/         # Route pages
│   │   │   └── admin/     # Admin panel pages
│   │   └── main.tsx       # App entry point
│   └── index.html         # HTML template with SEO meta tags
│
├── server/                # Backend (Express + Node.js)
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   ├── seed.ts           # Database seeding
│   ├── index.ts          # Server entry point
│   └── static.ts         # Static file serving
│
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle schema + Zod validation
│
└── public/
    └── uploads/          # User-uploaded images
```

## 🔐 Admin Panel

### Access

- URL: http://localhost:3001/admin
- **Default credentials**:
  - Email: `admin@phuket-tours.com`
  - Password: `Admin123!`

⚠️ **IMPORTANT**: Change the default password immediately using the password change endpoint!

### Features

- ✅ Dashboard with statistics
- ✅ Tour management (CRUD)
- ✅ Category management
- ✅ Inquiry management with WhatsApp quick actions
- ✅ **Real-time notifications** (sound + browser + WhatsApp)
- ✅ FAQ management
- ✅ Review management
- ✅ Blog post management
- ✅ Image upload (drag & drop)

### Password Change API

```bash
POST /api/admin/change-password
Content-Type: application/json

{
  "currentPassword": "Admin123!",
  "newPassword": "your-new-secure-password"
}
```

## 🔔 Inquiry Notifications

When customers submit inquiries, you receive **multiple notifications**:

1. **Browser Notifications** - Desktop alerts with sound (30-second polling)
2. **Visual Badge** - "X New" badge in admin panel
3. **Console Log** - Detailed inquiry logged in terminal
4. **WhatsApp Link** - Click-to-send notification message (manual)
5. **Twilio WhatsApp** - Automatic WhatsApp messages (optional)

**See full documentation:** [NOTIFICATIONS.md](NOTIFICATIONS.md)

### Quick Setup

```env
# Admin WhatsApp for notifications
ADMIN_WHATSAPP_NUMBER="+905335531208"

# Optional: Twilio for automatic WhatsApp
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_NUMBER=""
```

**To enable notifications:**
1. Go to `/admin/inquiries`
2. Click "Notifications On" button
3. Allow browser notification permission
4. Submit test inquiry to verify

## 📱 WhatsApp Integration

### Configuration

Set your WhatsApp Business number in `.env`:

```env
VITE_WHATSAPP_NUMBER="+905335531208"
```

Format: `"+[country_code][number]"` (with +, no spaces)

### Features

- Sticky WhatsApp button on all public pages
- Localized messages (EN/TR)
- Pre-filled messages with tour details
- Admin panel: "Open WhatsApp" button per inquiry
- Admin panel: "Copy Message" for quick responses

### Message Template

**English**:
```
Hi, I'm interested in [Tour Name].
Date: [Selected Date]
People: [Number]
Hotel: [Hotel Name]
Can you share availability and details?
```

**Turkish**:
```
Merhaba, [Tur Adı] ile ilgileniyorum.
Tarih: [Seçilen Tarih]
Kişi Sayısı: [Sayı]
Otel: [Otel Adı]
Müsaitlik ve detayları paylaşabilir misiniz?
```

## 🌍 Internationalization (i18n)

Supported languages: **English (en)** | **Turkish (tr)**

- Language switcher in header
- Persists to localStorage
- All UI elements translated
- Tour content translated (title, summary, details)

## 🎨 Features

### Public Site
- ✅ Homepage with hero search (live search with 500ms debounce)
- ✅ Tours catalog with filters (category, price, search)
- ✅ Tour detail pages with WhatsApp CTA
- ✅ Inquiry forms (not "booking")
- ✅ About, FAQ, Reviews, Blog, Contact pages
- ✅ Responsive design (mobile-first)
- ✅ SEO-optimized (meta tags, Open Graph)

### Admin Panel
- ✅ Session-based authentication
- ✅ Tour CRUD with image upload
- ✅ Multilingual content management
- ✅ Inquiry lifecycle tracking (NEW → CONTACTED → CONFIRMED → CANCELLED)
- ✅ WhatsApp quick actions
- ✅ Internal notes for inquiries

## 🏗 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Migration
```bash
npm run db:push
```

## 📝 API Endpoints

### Public Endpoints
```
GET  /api/categories          # List categories
GET  /api/tours               # List all tours
GET  /api/tours/:slug         # Get tour by slug
POST /api/inquiries           # Submit inquiry
GET  /api/faqs                # List FAQs
GET  /api/reviews             # List reviews
GET  /api/blog                # List blog posts (published only)
GET  /api/blog/:slug          # Get blog post by slug
```

### Admin Endpoints (requires authentication)
```
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/me
POST   /api/admin/change-password

GET    /api/admin/stats
GET    /api/admin/tours
GET    /api/admin/tours/:id
POST   /api/admin/tours
PUT    /api/admin/tours/:id
DELETE /api/admin/tours/:id

POST   /api/admin/upload      # Image upload
...and more for categories, inquiries, FAQs, reviews, blog
```

## 🔒 Security

- ✅ bcrypt password hashing (salt rounds: 10)
- ✅ Session-based authentication
- ✅ Password change endpoint with validation
- ✅ File upload validation (5MB limit, images only)
- ✅ CSRF protection via same-origin policy
- ✅ No passwords in plain text anywhere

**Security Recommendations**:
1. Change default admin password immediately
2. Use strong `SESSION_SECRET` in production
3. Use HTTPS in production
4. Configure PostgreSQL with strong credentials
5. Implement rate limiting for login endpoint
6. Regular security audits

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS: Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
PORT=3002
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql --version
brew services list | grep postgres

# Verify DATABASE_URL format
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### WhatsApp Link Not Working
- Verify `VITE_WHATSAPP_NUMBER` format: `"+66XXXXXXXXXX"`
- Restart dev server after changing `.env`
- Check browser console for errors

## 🔍 SEO Implementation

This platform includes comprehensive SEO for ranking "Phuket tours" in Google search results.

### ✅ SEO Features Implemented

**1. Per-Route Metadata** (react-helmet-async)
- Unique title, description, and keywords for each page
- Open Graph tags for social sharing (Facebook, Twitter)
- Canonical URLs on all pages
- Dynamic metadata for tour detail pages

**2. Structured Data** (JSON-LD)
- **LocalBusiness schema** on home + contact pages with NAP (Name, Address, Phone)
- **TouristAttraction schema** on every tour detail page
- **FAQPage schema** on FAQ page
- **Breadcrumb schema** on tour pages for navigation

**3. Dynamic Sitemap**
- Auto-generated from database at `/sitemap.xml`
- Includes all tours, blog posts, and static pages
- Updates automatically when content changes

**4. SEO-Optimized Content**
- H1 tags on every page
- Breadcrumb navigation on tour pages
- Internal linking structure
- Image optimization ready
- Mobile-first responsive design

### 📊 How to Verify SEO

**1. View Page Source**
```bash
# Open any page in browser
# Right-click → View Page Source
# Search for "C Plus Andaman Travel" in source
# Verify: title, meta tags, JSON-LD scripts visible
```

**2. Check Sitemap**
```bash
curl http://localhost:3001/sitemap.xml
# Should return XML with all published tours and pages
```

**3. Test Social Sharing**
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Paste tour URLs to verify Open Graph images/titles

**4. Validate Structured Data**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Paste URLs to validate JSON-LD schemas

### 🚀 SEO Deployment Checklist

Before going live:
- [ ] Update `SITE_URL` in `.env` to actual domain
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Claim Google My Business listing (critical for local SEO!)
- [ ] Add website to Google Search Console
- [ ] Enable HTTPS (required for SEO ranking)
- [ ] Optimize images (compress, add alt tags)
- [ ] Get 5-10 Google reviews (boosts local SEO)

### 📈 SEO Strategy for "Phuket Tours"

**High-Priority Actions:**
1. **Google My Business** - Critical for ranking "Phuket tours near me"
2. **Content Marketing** - Create blog posts: "Best Phuket Tours 2026", "Phi Phi Island Guide"
3. **Internal Linking** - Link from blog posts to tour pages
4. **Reviews** - Encourage customers to leave Google reviews
5. **Local Citations** - List on TripAdvisor, Viator with website link

**Technical SEO Notes:**
- Current implementation: Client-side rendering (CSR) with react-helmet-async
- Google crawls JavaScript and sees all meta tags
- For maximum crawlability, consider pre-rendering in future (Phase 2)

**Detailed SEO Documentation:**
See `SEO_IMPLEMENTATION.md` for comprehensive guide including:
- Per-route metadata examples
- JSON-LD schema reference
- Social media optimization
- Performance optimization
- Conversion rate optimization

## 🏢 Company Information

**Business Name:** C Plus Andaman Travel | Phuket
**Address:** Pa Tong, Kathu District, Phuket 83150, Thailand
**Phone:** +66 95 441 6562
**Hours:** Open daily • Closes 21:00
**Facebook:** https://www.facebook.com/p/C-Plus-Andaman-Travel-100057473498746
**Instagram:** https://www.instagram.com/ceceysphuket/

This information (NAP - Name, Address, Phone) is consistently displayed in:
- Footer on every page
- Contact page with Google Maps link
- LocalBusiness JSON-LD schema
- All SEO meta tags

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow the inquiry-first philosophy and maintain the premium tone.

---

**Built with ❤️ for premium travel experiences**
