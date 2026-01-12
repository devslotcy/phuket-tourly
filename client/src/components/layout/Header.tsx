import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/tours", label: t("nav.tours") },
    { href: "/about", label: t("nav.about") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">Phuket Tours</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1" data-testid="button-language">
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{locale}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLocale("en")}
                  className={locale === "en" ? "bg-accent" : ""}
                  data-testid="button-lang-en"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocale("tr")}
                  className={locale === "tr" ? "bg-accent" : ""}
                  data-testid="button-lang-tr"
                >
                  Türkçe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contact" className="hidden sm:block">
              <Button size="sm" data-testid="button-header-book">
                {t("hero.cta.book")}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  data-testid={`link-mobile-nav-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full mt-2" data-testid="button-mobile-book">
                {t("hero.cta.book")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
