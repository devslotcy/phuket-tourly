import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTours } from "@/components/home/FeaturedTours";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { SEO } from "@/components/SEO";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { COMPANY } from "@shared/company";

export default function Home() {
  return (
    <PublicLayout>
      <SEO
        title="Discover Paradise in Phuket"
        description={COMPANY.seo.defaultDescription}
        keywords={COMPANY.seo.keywords}
        url={COMPANY.website}
      />
      <LocalBusinessSchema />
      <HeroSection />
      <FeaturedTours />
      <WhyChooseUs />
      <ReviewsPreview />
      <BlogPreview />
    </PublicLayout>
  );
}
