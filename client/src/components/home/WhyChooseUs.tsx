import { Shield, Users, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

const features = [
  {
    icon: Shield,
    titleEn: "Safe & Secure",
    titleTr: "Güvenli",
    descEn: "All tours are fully insured with experienced guides",
    descTr: "Tüm turlar tam sigortalı ve deneyimli rehberler eşliğinde",
  },
  {
    icon: Users,
    titleEn: "Expert Guides",
    titleTr: "Uzman Rehberler",
    descEn: "Local experts with years of experience",
    descTr: "Yıllarca deneyime sahip yerel uzmanlar",
  },
  {
    icon: Award,
    titleEn: "Best Price Guarantee",
    titleTr: "En İyi Fiyat Garantisi",
    descEn: "We match any comparable tour price",
    descTr: "Karşılaştırılabilir her tur fiyatını eşliyoruz",
  },
  {
    icon: Clock,
    titleEn: "24/7 Support",
    titleTr: "7/24 Destek",
    descEn: "Round the clock customer support",
    descTr: "Kesintisiz müşteri desteği",
  },
];

export function WhyChooseUs() {
  const { locale } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === "tr" ? "Neden Bizi Seçmelisiniz?" : "Why Choose Us?"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {locale === "tr"
              ? "Size en iyi deneyimi sunmak için elimizden gelenin en iyisini yapıyoruz"
              : "We go above and beyond to give you the best experience"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover-elevate" data-testid={`card-feature-${index}`}>
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {locale === "tr" ? feature.titleTr : feature.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "tr" ? feature.descTr : feature.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
