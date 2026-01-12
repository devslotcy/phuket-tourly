# Phuket Tour Company Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Airbnb's visual richness and Booking.com's conversion-focused layouts, optimized for premium travel experiences.

## Core Design Principles
- **Visual Storytelling First**: Large, immersive photography drives engagement
- **White Space as Luxury**: Generous spacing conveys premium positioning
- **Effortless Conversion**: Clear CTAs guide users toward booking at every stage
- **Trust Through Transparency**: Prominent reviews, certifications, and contact options

---

## Typography System
**Font Stack**:
- Headings: Inter (600, 700) - modern, professional
- Body: Inter (400, 500) - excellent readability
- Accent: Optional Playfair Display for hero taglines

**Hierarchy**:
- H1: text-5xl md:text-6xl lg:text-7xl font-bold
- H2: text-3xl md:text-4xl lg:text-5xl font-semibold
- H3: text-2xl md:text-3xl font-semibold
- Body: text-base md:text-lg
- Small: text-sm

---

## Layout System
**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 20, 24, 32 (px-4, py-8, gap-12, etc.)

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Content-focused: max-w-4xl mx-auto
- Reading width: max-w-prose

**Grid Patterns**:
- Tours/Blog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8
- Features: grid-cols-1 md:grid-cols-2 gap-8 md:gap-12
- Mobile-first: Always stack to single column on mobile

---

## Component Library

### Navigation
- Sticky header with logo left, nav center, language switcher + CTA right
- Mobile: Hamburger menu, full-screen overlay
- Include: Tours dropdown, About, Blog, Reviews, FAQ, Contact

### Hero Sections
- Full-viewport height (min-h-screen) with background image
- Gradient overlay for text readability
- Centered content: headline + subheadline + dual CTAs (primary "Book Now" + secondary "View Tours")
- Search bar on home hero (destination, date, people count)

### Tour Cards
- Aspect ratio 4:3 image
- Overlay badges: "Featured", "Popular"
- Content: Title, category tag, duration, "From $X", rating stars
- Hover: Subtle scale transform (scale-105) + shadow increase

### Inquiry/Contact Forms
- Two-column layout on desktop (form left, contact info/map right)
- Single column mobile
- Include: Success states, loading indicators, field validation

### Footer
- Four-column layout: About (short), Quick Links, Popular Tours, Contact + Social
- Newsletter signup above footer
- Trust badges (payment methods, certifications)

---

## Page-Specific Layouts

**Home**: Hero → Featured Tours (3 columns) → Why Choose Us (4 icon features) → Popular Categories → Reviews Carousel → Blog Preview (3 posts) → Newsletter → Footer

**Tours Listing**: Search/filter sidebar (desktop) or drawer (mobile) → Tours grid with sorting options

**Tour Detail**: Image gallery (main + thumbnails) → Overview section → Highlights grid (2 columns) → Detailed itinerary (accordion) → What's Included/Excluded (two columns) → Reviews → Booking form (sticky on desktop) → Related Tours

**About**: Hero → Story (text + image alternating) → Team grid → Values (icon cards) → CTA

**FAQ**: Hero → Category tabs → Accordion items with smooth expand/collapse

**Reviews**: Hero → Stats overview → Review grid with filtering → CTA

**Blog**: Hero → Featured post → Grid of posts with image, title, excerpt, read time

**Contact**: Split layout (form + contact details + embedded map)

---

## Interactive Elements

**Buttons**:
- Primary: Large padding (px-8 py-4), rounded-lg, font-semibold
- Secondary: Outlined variant
- Ghost: Text-only with hover underline
- Buttons over images: Backdrop blur (backdrop-blur-sm bg-white/90)

**WhatsApp Button**: Fixed bottom-right (bottom-6 right-6), circular, green background, chat icon, subtle pulse animation

**Animations**: Use sparingly
- Fade-in on scroll for sections
- Hover transforms on cards (scale, shadow)
- Smooth page transitions
- NO parallax effects or complex scroll animations

---

## Images

**Hero Images Required**:
- **Home**: Stunning Phuket beach/ocean view at golden hour, wide angle
- **Tours Page**: Aerial view of Phi Phi Islands or similar landmark
- **About**: Team photo on boat or beach setting
- **Contact**: Map or coastal scenery

**Tour Detail Images**: 
- Gallery of 6-10 high-quality photos per tour
- Mix of landscape, activities, cultural sites, food

**Supporting Images**:
- Team photos for About page
- Blog post featured images (16:9 ratio)
- Category icons/illustrations
- Review profile photos (circular avatars)

**Image Treatment**: All images use next/image with responsive sizing, lazy loading, subtle rounded corners (rounded-lg), and soft shadows where appropriate

---

## Admin Panel Design
- Sidebar navigation (pinned left)
- Clean table layouts with action buttons
- Form layouts: Labels above fields, clear section dividers
- Dashboard: Card-based metrics with icons
- Minimal, functional aesthetic - focus on usability over decoration