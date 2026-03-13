# 🌴 Phuket Tourly — Travel & Tour Platform

A travel and tour booking platform for Phuket, Thailand. Tourists can browse tours, read itineraries, and book experiences — all managed through a backend CMS.

## Features

- **Tour Listings** — browse by category (island hopping, diving, cultural, etc.)
- **Tour Detail Pages** — full itinerary, inclusions, pricing, gallery
- **Online Booking** — reservation form with confirmation
- **Admin CMS** — manage tours, bookings, and customer inquiries
- **SEO Optimized** — server-side rendered for search visibility
- **Mobile Responsive** — optimized for tourist on-the-go browsing

## Tech Stack

- **Frontend:** React, Next.js
- **Language:** TypeScript
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Styling:** Tailwind CSS
- **Deployment:** Vercel + Railway

## Pages

- `/` — Homepage with featured tours
- `/tours` — All tours with category filters
- `/tours/[slug]` — Tour detail & booking
- `/about` — About the agency
- `/contact` — Contact & inquiries
- `/admin` — Management dashboard

## Setup

```bash
git clone https://github.com/devslotcy/phuket-tourly
cd phuket-tourly
npm install
cp .env.example .env.local
npm run dev
```

---

Built by [Mucahit Tiglioglu](https://github.com/devslotcy)
