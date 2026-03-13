import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { TourCard } from "@/components/tours/TourCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { SEO } from "@/components/SEO";
import { COMPANY } from "@shared/company";
import type { TourWithDetails, Category } from "@shared/schema";

export default function Tours() {
  const { locale, t } = useLanguage();
  const [location] = useLocation();

  // Get search query from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get("q") || "";
  const initialDate = urlParams.get("date") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Update search when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setSearch(queryParam);
    }
  }, [location]);

  const { data: tours, isLoading: toursLoading } = useQuery<TourWithDetails[]>({
    queryKey: ["/api/tours"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredTours = tours?.filter((tour) => {
    const translation = tour.translations.find((tr) => tr.locale === locale) || tour.translations[0];
    const matchesSearch = !search || 
      translation?.title.toLowerCase().includes(search.toLowerCase()) ||
      translation?.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tour.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === "price-low") return a.priceFrom - b.priceFrom;
    if (sortBy === "price-high") return b.priceFrom - a.priceFrom;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <PublicLayout>
      <SEO
        title="All Tours in Phuket"
        description="Browse all premium tours and excursions in Phuket with C Plus Andaman Travel. Island hopping, diving, cultural tours, and more. Contact us for personalized service."
        keywords={`Phuket tours, ${COMPANY.seo.keywords}, island tours, diving tours, cultural tours`}
        url={`${COMPANY.website}/tours`}
      />

      <div className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("tours.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search") + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-tours-search"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]" data-testid="select-category">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {locale === "tr" ? "Tüm Kategoriler" : "All Categories"}
              </SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {locale === "tr" ? cat.nameTr : cat.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
              data-testid="badge-category-all"
            >
              {locale === "tr" ? "Tümü" : "All"}
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.id)}
                data-testid={`badge-category-${cat.id}`}
              >
                {locale === "tr" ? cat.nameTr : cat.nameEn}
              </Badge>
            ))}
          </div>
        )}

        {toursLoading ? (
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
        ) : filteredTours && filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">{t("common.noResults")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
