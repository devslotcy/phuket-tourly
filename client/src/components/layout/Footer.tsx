import { Link } from "wouter";
import { MapPin, Mail, Phone, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/tours", label: t("nav.tours") },
    { href: "/about", label: t("nav.about") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-semibold text-lg">Phuket Tours</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for unforgettable adventures in Phuket and beyond. We create memories that last a lifetime.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="link-social-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="link-social-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" data-testid="link-social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid={`link-footer-${link.href.replace("/", "")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t("contact.title")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Beach Road, Patong, Phuket 83150, Thailand</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@phuket-tours.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+66 76 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Mon-Sun: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.newsletter")}</h3>
            <p className="text-muted-foreground text-sm">{t("footer.newsletterText")}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button size="default" data-testid="button-subscribe">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Phuket Tours. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
