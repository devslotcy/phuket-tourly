import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, ArrowRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { Review } from "@shared/schema";

export function ReviewsPreview() {
  const { locale, t } = useLanguage();

  const { data: allReviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });
  
  const reviews = allReviews?.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t("reviews.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("reviews.subtitle")}
            </p>
          </div>
          <Link href="/reviews">
            <Button variant="outline" className="gap-2" data-testid="link-view-all-reviews">
              {t("reviews.title")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="hover-elevate" data-testid={`card-review-${review.id}`}>
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  <p className="text-muted-foreground mb-6 line-clamp-4">
                    {locale === "tr" ? review.textTr : review.textEn}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarImage src={review.avatarUrl || undefined} alt={review.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{review.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.source && (
                      <span className="text-xs text-muted-foreground">
                        {review.source}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
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
