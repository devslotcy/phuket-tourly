import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TourCard } from "@/components/tours/TourCard";
import { useLanguage } from "@/lib/i18n";
import type { TourWithDetails } from "@shared/schema";

export function FeaturedTours() {
  const { t } = useLanguage();
  
  const { data: allTours, isLoading } = useQuery<TourWithDetails[]>({
    queryKey: ["/api/tours"],
  });
  
  const tours = allTours?.filter((t) => t.featured).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t("tours.featured")}
            </h2>
            <p className="text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>
          <Link href="/tours">
            <Button variant="outline" className="gap-2" data-testid="link-view-all-tours">
              {t("tours.all")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
