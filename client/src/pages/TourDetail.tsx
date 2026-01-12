import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, MapPin, Users, Star, Check, X } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/i18n";
import type { TourWithDetails } from "@shared/schema";

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, t } = useLanguage();

  const { data: tour, isLoading } = useQuery<TourWithDetails>({
    queryKey: ["/api/tours", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!tour) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("common.noResults")}</h1>
          <Link href="/tours">
            <Button variant="outline">{t("common.back")}</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const translation = tour.translations.find((tr) => tr.locale === locale) || tour.translations[0];
  const mainImage = tour.images[0];
  const galleryImages = tour.images.slice(0, 6);

  const parseList = (text: string | null | undefined): string[] => {
    if (!text) return [];
    return text.split("\n").filter((item) => item.trim());
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Link href="/tours">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back-tours">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt || translation?.title || "Tour"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-video rounded-md overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.alt || `Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {tour.featured && <Badge>Featured</Badge>}
                {tour.popular && <Badge variant="secondary">Popular</Badge>}
                {tour.category && (
                  <Badge variant="outline">
                    {locale === "tr" ? tour.category.nameTr : tour.category.nameEn}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {translation?.title || "Tour"}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (120 reviews)</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {translation?.summary}
              </p>
            </div>

            {translation?.highlights && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("tours.highlights")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {parseList(translation.highlights).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {translation?.itinerary && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("tours.itinerary")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {parseList(translation.itinerary).map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-left">
                          <span className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                              {i + 1}
                            </span>
                            {item.split(":")[0]}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-11">
                          {item.split(":").slice(1).join(":") || item}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {translation?.includes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">{t("tours.includes")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parseList(translation.includes).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {translation?.excludes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">{t("tours.excludes")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {parseList(translation.excludes).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {(translation?.pickupInfo || translation?.cancellationPolicy) && (
              <div className="grid md:grid-cols-2 gap-6">
                {translation?.pickupInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("tours.pickupInfo")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{translation.pickupInfo}</p>
                    </CardContent>
                  </Card>
                )}
                {translation?.cancellationPolicy && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("tours.cancellation")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{translation.cancellationPolicy}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">{t("tours.from")}</span>
                      <p className="text-3xl font-bold text-primary">${tour.priceFrom}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <InquiryForm tourId={tour.id} tourTitle={translation?.title} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
