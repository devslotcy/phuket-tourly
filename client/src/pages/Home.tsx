import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTours } from "@/components/home/FeaturedTours";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { BlogPreview } from "@/components/home/BlogPreview";

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedTours />
      <WhyChooseUs />
      <ReviewsPreview />
      <BlogPreview />
    </PublicLayout>
  );
}
