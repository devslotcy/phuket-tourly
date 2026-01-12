import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { Review } from "@shared/schema";

export default function ReviewsPage() {
  const { locale, t } = useLanguage();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const stats = reviews
    ? {
        total: reviews.length,
        average: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        fiveStars: reviews.filter((r) => r.rating === 5).length,
      }
    : null;

  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=2068')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("reviews.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            {t("reviews.subtitle")}
          </p>
        </div>
      </section>

      {stats && (
        <section className="py-12 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">{stats.average}</p>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(parseFloat(stats.average))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "tr" ? "Ortalama Puan" : "Average Rating"}
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {locale === "tr" ? "Toplam Yorum" : "Total Reviews"}
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold">{stats.fiveStars}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {locale === "tr" ? "5 Yıldızlı" : "5-Star Reviews"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover-elevate" data-testid={`card-review-${review.id}`}>
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-primary/20 mb-4" />
                    
                    <p className="text-muted-foreground mb-6">
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
              <p className="text-lg text-muted-foreground">{t("common.noResults")}</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
