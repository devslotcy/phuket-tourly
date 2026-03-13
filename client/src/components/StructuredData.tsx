import { Helmet } from "react-helmet-async";
import { COMPANY } from "@shared/company";

interface LocalBusinessProps {
  showInHelmet?: boolean;
}

export function LocalBusinessSchema({ showInHelmet = true }: LocalBusinessProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: COMPANY.name,
    image: COMPANY.seo.ogImage,
    "@id": COMPANY.website,
    url: COMPANY.website,
    telephone: COMPANY.phone.international,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.region,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.8804,
      longitude: 98.3923,
    },
    openingHoursSpecification: COMPANY.hours.structured.dayOfWeek.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: COMPANY.hours.structured.opens,
      closes: COMPANY.hours.structured.closes,
    })),
    sameAs: [COMPANY.social.facebook, COMPANY.social.instagram],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "250",
    },
  };

  if (!showInHelmet) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface TourSchemaProps {
  name: string;
  description: string;
  image?: string;
  price?: number;
  duration?: string;
  url: string;
}

export function TourSchema({ name, description, image, price, duration, url }: TourSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description,
    image: image || COMPANY.seo.ogImage,
    provider: {
      "@type": "TravelAgency",
      name: COMPANY.name,
      url: COMPANY.website,
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "THB",
        availability: "https://schema.org/InStock",
        url,
      },
    }),
    ...(duration && { duration }),
    location: {
      "@type": "Place",
      name: "Phuket, Thailand",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Phuket",
        addressCountry: "Thailand",
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
