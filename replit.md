# Phuket Tour Company

## Overview

A production-ready MVP for a Phuket tour company featuring a public-facing website with tour listings, booking inquiries, and a full admin panel for content management. The application supports bilingual content (English and Turkish) and is built as a modern full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration and CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation schemas
- **Internationalization**: Custom i18n context provider supporting English (en) and Turkish (tr) locales

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API endpoints under `/api/` prefix
- **Session Management**: Express-session with MemoryStore for development (connect-pg-simple available for production)
- **Authentication**: Session-based admin authentication with bcrypt password hashing
- **Build Process**: Custom esbuild script bundling server code, Vite for client build

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions and Zod validation schemas
- **Migrations**: Drizzle Kit for database migrations (`drizzle.config.ts`)
- **Key Tables**: adminUsers, categories, tours, tourTranslations, tourImages, inquiries, faqs, reviews, blogPosts, blogPostTranslations

### Project Structure
```
├── client/src/          # React frontend application
│   ├── components/      # UI components (layout, forms, tours, home sections)
│   ├── pages/           # Route pages (public + admin)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities (auth, i18n, queryClient)
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database access layer
│   ├── seed.ts          # Database seeding logic
│   └── db.ts            # Database connection
├── shared/              # Shared code between frontend and backend
│   └── schema.ts        # Drizzle schema and Zod validators
└── migrations/          # Database migration files
```

### Authentication Flow
- Admin login at `/admin/login` creates session
- Protected routes check `req.session.adminId`
- Default admin credentials seeded on first run: `admin@phuket-tours.com` / `Admin123!`

### Content Model
- Tours have translations for each locale (en/tr) with fields: title, summary, highlights, itinerary, includes/excludes, pickup info, cancellation policy, SEO metadata
- Categories support bilingual names
- Blog posts follow similar translation pattern
- Inquiries track customer booking requests with status workflow (NEW → CONTACTED → CONFIRMED/CANCELLED)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- Drizzle ORM handles all database operations with type-safe queries

### Third-Party UI Libraries
- **Radix UI**: Headless accessible UI primitives (dialogs, dropdowns, accordions, etc.)
- **Lucide React**: Icon library
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **vaul**: Drawer component

### Build & Development
- **Vite**: Frontend dev server and bundler with HMR
- **esbuild**: Server code bundling for production
- **Replit Plugins**: Dev banner and cartographer for Replit environment

### Form & Validation
- **Zod**: Schema validation shared between frontend and backend
- **drizzle-zod**: Generates Zod schemas from Drizzle table definitions

### Session Storage
- **memorystore**: In-memory session storage (development)
- **connect-pg-simple**: PostgreSQL session storage (production-ready)