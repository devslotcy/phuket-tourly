import { Link } from "wouter";
import { Clock, Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import type { TourWithDetails } from "@shared/schema";

interface TourCardProps {
  tour: TourWithDetails;
}

export function TourCard({ tour }: TourCardProps) {
  const { locale, t } = useLanguage();
  
  const translation = tour.translations.find((tr) => tr.locale === locale) || tour.translations[0];
  const mainImage = tour.images[0];
  
  return (
    <Link href={`/tours/${tour.slug}`}>
      <Card 
        className="group overflow-visible hover-elevate cursor-pointer h-full"
        data-testid={`card-tour-${tour.id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-md">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={mainImage.alt || translation?.title || "Tour image"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {tour.featured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            {tour.popular && (
              <Badge variant="secondary">
                Popular
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          {tour.category && (
            <Badge variant="outline" className="text-xs">
              {locale === "tr" ? tour.category.nameTr : tour.category.nameEn}
            </Badge>
          )}
          
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {translation?.title || "Untitled Tour"}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {translation?.summary || ""}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-muted-foreground">{t("tours.from")}</span>
              <p className="font-bold text-lg text-primary">${tour.priceFrom}</p>
            </div>
            <Button size="sm" variant="outline">
              {t("tours.viewDetails")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
