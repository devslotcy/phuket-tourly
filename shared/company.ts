// Company Identity & Branding
// This file contains all official company information for C Plus Andaman Travel

export const COMPANY = {
  // Brand names
  name: "C Plus Andaman Travel | Phuket",
  shortName: "C Plus Andaman Travel",
  tagline: "Premium Tours & Excursions in Phuket, Thailand",

  // Business type & location
  type: "Travel Agency",
  city: "Patong",
  region: "Phuket",
  country: "Thailand",

  // Contact information (NAP - Name, Address, Phone)
  address: {
    street: "Pa Tong",
    district: "Kathu District",
    city: "Phuket",
    postalCode: "83150",
    country: "Thailand",
    full: "Pa Tong, Kathu District, Phuket 83150, Thailand",
  },

  phone: {
    display: "095 441 6562", // Thailand local number
    international: "+66 95 441 6562", // Thailand international format
    displayTurkey: "+90 533 553 12 08", // Turkey number for display
    whatsapp: "+905335531208", // Turkey WhatsApp (no spaces)
  },

  // Business hours
  hours: {
    display: "Open daily • Closes 21:00",
    structured: {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
  },

  // Social media
  social: {
    facebook: "https://www.facebook.com/p/C-Plus-Andaman-Travel-100057473498746/?locale=tr_TR",
    instagram: "https://www.instagram.com/ceceysphuket/",
  },

  // Website & email
  website: "https://cplusandaman.com", // Update with actual domain
  email: "info@cplusandaman.com", // Update if available

  // SEO defaults
  seo: {
    defaultTitle: "C Plus Andaman Travel | Premium Tours & Excursions in Phuket",
    defaultDescription: "Experience unforgettable adventures in Phuket with C Plus Andaman Travel. Expert local guides, premium island tours, cultural experiences, and water activities. Contact us for personalized service in Patong, Phuket, Thailand.",
    keywords: "Phuket tours, Patong travel agency, Thailand tours, island tours, Phuket excursions, C Plus Andaman Travel, travel Phuket, tour packages, Andaman Sea tours",
    ogImage: "/og-image-cplus.jpg", // Update with actual branded image
  },

  // Google Maps
  maps: {
    searchQuery: "C Plus Andaman Travel Patong Phuket",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=C+Plus+Andaman+Travel+Patong+Phuket+83150+Thailand",
  },
} as const;

// Helper function to get full address
export function getFullAddress(): string {
  return COMPANY.address.full;
}

// Helper function to get phone for display
export function getPhoneDisplay(): string {
  return COMPANY.phone.display;
}

// Helper function to get phone for links (tel:)
export function getPhoneLink(): string {
  return `tel:${COMPANY.phone.international}`;
}

// Helper function to get WhatsApp link
export function getWhatsAppNumber(): string {
  return COMPANY.phone.whatsapp;
}
