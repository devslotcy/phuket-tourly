/**
 * SEO Utilities - Automatic SEO Field Generation
 *
 * This module provides utilities for generating SEO metadata from content.
 * All functions provide smart defaults when optional SEO fields are empty.
 */

import { COMPANY } from "./company";

/**
 * Strip HTML tags and truncate text to specified length
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Truncate text to specified length, adding ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Try to truncate at last complete word
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Slugify text: convert to lowercase, replace spaces/special chars with hyphens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Generate SEO title for tours
 * Format: "{TourTitle} | C Plus Andaman Travel | Phuket"
 */
export function generateTourSeoTitle(tourTitle: string, customSeoTitle?: string | null): string {
  if (customSeoTitle && customSeoTitle.trim()) {
    return customSeoTitle;
  }

  return `${tourTitle} | ${COMPANY.shortName} | ${COMPANY.region}`;
}

/**
 * Generate SEO description for tours
 * Uses summary (first 150-160 chars), or highlights if summary is too short
 */
export function generateTourSeoDescription(
  summary?: string | null,
  highlights?: string | null,
  customSeoDescription?: string | null
): string {
  if (customSeoDescription && customSeoDescription.trim()) {
    return customSeoDescription;
  }

  // Try summary first
  if (summary) {
    const cleaned = stripHtml(summary);
    if (cleaned.length >= 50) {
      return truncate(cleaned, 160);
    }
  }

  // Fallback to highlights
  if (highlights) {
    const cleaned = stripHtml(highlights);
    return truncate(cleaned, 160);
  }

  // Ultimate fallback
  return `Experience ${COMPANY.shortName}'s premium tours in ${COMPANY.region}, Thailand. Contact us for details and availability.`;
}

/**
 * Generate SEO title for blog posts
 * Format: "{PostTitle} | C Plus Andaman Travel Blog"
 */
export function generateBlogSeoTitle(blogTitle: string, customSeoTitle?: string | null): string {
  if (customSeoTitle && customSeoTitle.trim()) {
    return customSeoTitle;
  }

  return `${blogTitle} | ${COMPANY.shortName} Blog`;
}

/**
 * Generate SEO description for blog posts
 * Uses excerpt (first 150-160 chars), or content if excerpt is missing
 */
export function generateBlogSeoDescription(
  excerpt?: string | null,
  content?: string | null,
  customSeoDescription?: string | null
): string {
  if (customSeoDescription && customSeoDescription.trim()) {
    return customSeoDescription;
  }

  // Try excerpt first
  if (excerpt) {
    const cleaned = stripHtml(excerpt);
    return truncate(cleaned, 160);
  }

  // Fallback to content
  if (content) {
    const cleaned = stripHtml(content);
    return truncate(cleaned, 160);
  }

  // Ultimate fallback
  return `Read the latest travel tips and guides from ${COMPANY.shortName} in ${COMPANY.region}, Thailand.`;
}

/**
 * Get OG image URL (with fallback to default)
 */
export function getOgImageUrl(
  customOgImage?: string | null,
  firstGalleryImage?: string | null,
  siteUrl?: string
): string {
  const baseUrl = siteUrl || COMPANY.website;

  if (customOgImage) {
    return customOgImage.startsWith("http") ? customOgImage : `${baseUrl}${customOgImage}`;
  }

  if (firstGalleryImage) {
    return firstGalleryImage.startsWith("http") ? firstGalleryImage : `${baseUrl}${firstGalleryImage}`;
  }

  // Fallback to company default
  return `${baseUrl}${COMPANY.seo.ogImage}`;
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string, siteUrl?: string): string {
  const baseUrl = siteUrl || COMPANY.website;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate keywords from title and tags
 */
export function generateKeywords(
  title: string,
  category?: string | null,
  tags?: string | null,
  additionalKeywords?: string[]
): string {
  const keywords: string[] = [];

  // Add title words (skip common words)
  const titleWords = title.split(" ").filter(word =>
    word.length > 3 && !["the", "and", "for", "with", "from"].includes(word.toLowerCase())
  );
  keywords.push(...titleWords);

  // Add category
  if (category) keywords.push(category);

  // Add tags
  if (tags) {
    const tagList = tags.split(",").map(t => t.trim());
    keywords.push(...tagList);
  }

  // Add additional keywords
  if (additionalKeywords) {
    keywords.push(...additionalKeywords);
  }

  // Add company keywords
  keywords.push(...COMPANY.seo.keywords.split(", "));

  // Deduplicate and join
  return Array.from(new Set(keywords)).join(", ");
}

/**
 * Validate SEO title length (ideal: 50-60 chars, max: 70)
 */
export function validateSeoTitleLength(title: string): {
  valid: boolean;
  length: number;
  warning?: string;
} {
  const length = title.length;

  if (length > 70) {
    return {
      valid: false,
      length,
      warning: "SEO title is too long (>70 chars). It may be truncated in search results."
    };
  }

  if (length < 30) {
    return {
      valid: false,
      length,
      warning: "SEO title is too short (<30 chars). Consider adding more descriptive text."
    };
  }

  return { valid: true, length };
}

/**
 * Validate SEO description length (ideal: 150-160 chars, max: 165)
 */
export function validateSeoDescriptionLength(description: string): {
  valid: boolean;
  length: number;
  warning?: string;
} {
  const length = description.length;

  if (length > 165) {
    return {
      valid: false,
      length,
      warning: "SEO description is too long (>165 chars). It may be truncated in search results."
    };
  }

  if (length < 50) {
    return {
      valid: false,
      length,
      warning: "SEO description is too short (<50 chars). Add more detail for better SEO."
    };
  }

  return { valid: true, length };
}

/**
 * Get content quality warnings for admin panel
 */
export interface ContentQualityWarning {
  field: string;
  severity: "warning" | "error";
  message: string;
}

export function getContentQualityWarnings(content: {
  title?: string;
  summary?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: any[];
  slug?: string;
}): ContentQualityWarning[] {
  const warnings: ContentQualityWarning[] = [];

  // Title validation
  if (!content.title || content.title.length < 10) {
    warnings.push({
      field: "title",
      severity: "error",
      message: "Title is too short. Aim for at least 10 characters."
    });
  }

  // Summary/Description validation
  const desc = content.summary || content.description;
  if (!desc || desc.length < 50) {
    warnings.push({
      field: "description",
      severity: "warning",
      message: "Description is missing or too short. Add more detail for better SEO."
    });
  }

  // Images validation
  if (!content.images || content.images.length === 0) {
    warnings.push({
      field: "images",
      severity: "warning",
      message: "No images added. Social sharing preview will use default image."
    });
  }

  // SEO Title validation
  if (content.seoTitle) {
    const titleCheck = validateSeoTitleLength(content.seoTitle);
    if (!titleCheck.valid && titleCheck.warning) {
      warnings.push({
        field: "seoTitle",
        severity: "warning",
        message: titleCheck.warning
      });
    }
  }

  // SEO Description validation
  if (content.seoDescription) {
    const descCheck = validateSeoDescriptionLength(content.seoDescription);
    if (!descCheck.valid && descCheck.warning) {
      warnings.push({
        field: "seoDescription",
        severity: "warning",
        message: descCheck.warning
      });
    }
  }

  // Slug validation
  if (content.slug && !isValidSlug(content.slug)) {
    warnings.push({
      field: "slug",
      severity: "error",
      message: "Slug contains invalid characters. Use only lowercase letters, numbers, and hyphens."
    });
  }

  return warnings;
}
