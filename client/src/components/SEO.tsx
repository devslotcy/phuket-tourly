import { Helmet } from "react-helmet-async";
import { COMPANY } from "@shared/company";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noindex = false,
}: SEOProps) {
  const siteTitle = COMPANY.seo.defaultTitle;
  const fullTitle = title ? `${title} | ${COMPANY.shortName}` : siteTitle;
  const metaDescription = description || COMPANY.seo.defaultDescription;
  const metaKeywords = keywords || COMPANY.seo.keywords;
  const metaImage = image || COMPANY.seo.ogImage;
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : COMPANY.website);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={COMPANY.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content={COMPANY.shortName} />
      <meta name="geo.region" content="TH-83" />
      <meta name="geo.placename" content="Phuket" />
      <meta name="geo.position" content="7.8804;98.3923" />
      <meta name="ICBM" content="7.8804, 98.3923" />
    </Helmet>
  );
}
