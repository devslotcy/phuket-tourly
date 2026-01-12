import { Link } from "wouter";
import { Search, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=2070')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/contact">
            <Button size="lg" className="min-w-[180px] text-base" data-testid="button-hero-book">
              {t("hero.cta.book")}
            </Button>
          </Link>
          <Link href="/tours">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px] text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-explore"
            >
              {t("hero.cta.explore")}
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tours..."
                  className="pl-10 bg-background"
                  data-testid="input-hero-search"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 bg-background"
                  data-testid="input-hero-date"
                />
              </div>
              <Button className="w-full" data-testid="button-hero-search">
                {t("common.search")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
