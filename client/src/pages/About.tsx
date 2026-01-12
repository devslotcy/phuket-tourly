import { Users, Award, Heart, Globe } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

const values = [
  {
    icon: Heart,
    titleEn: "Passion",
    titleTr: "Tutku",
    descEn: "We're passionate about creating unforgettable travel experiences",
    descTr: "Unutulmaz seyahat deneyimleri yaratma konusunda tutkuluyuz",
  },
  {
    icon: Users,
    titleEn: "Community",
    titleTr: "Topluluk",
    descEn: "Supporting local communities and sustainable tourism",
    descTr: "Yerel toplulukları ve sürdürülebilir turizmi destekliyoruz",
  },
  {
    icon: Award,
    titleEn: "Excellence",
    titleTr: "Mükemmellik",
    descEn: "Committed to delivering the highest quality service",
    descTr: "En yüksek kalitede hizmet sunmaya kararlıyız",
  },
  {
    icon: Globe,
    titleEn: "Adventure",
    titleTr: "Macera",
    descEn: "Helping you discover the wonders of Thailand",
    descTr: "Tayland'ın harikalarını keşfetmenize yardımcı oluyoruz",
  },
];

export default function About() {
  const { locale, t } = useLanguage();

  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=2070')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("about.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            {locale === "tr"
              ? "2015'ten beri Phuket'in en güzel yerlerini keşfetmenize yardımcı oluyoruz"
              : "Helping you discover the most beautiful places in Phuket since 2015"}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("about.story")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {locale === "tr"
                    ? "Phuket Tours, yerel Taylandlı rehberler ve seyahat tutkunları tarafından 2015 yılında kuruldu. Misyonumuz, ziyaretçilere Phuket'in gerçek güzelliğini göstermek ve unutulmaz anılar yaratmaktır."
                    : "Phuket Tours was founded in 2015 by local Thai guides and travel enthusiasts. Our mission is to show visitors the true beauty of Phuket and create unforgettable memories."}
                </p>
                <p>
                  {locale === "tr"
                    ? "Yıllar içinde binlerce mutlu müşteriye hizmet verdik ve Tayland'ın en güvenilir tur operatörlerinden biri haline geldik. Küçük grup turlarından özel tekne turlarına kadar geniş bir yelpazede hizmet sunuyoruz."
                    : "Over the years, we've served thousands of happy customers and become one of Thailand's most trusted tour operators. We offer a wide range of services from small group tours to private boat excursions."}
                </p>
                <p>
                  {locale === "tr"
                    ? "Ekibimiz, yerel kültür ve doğa hakkında derin bilgiye sahip deneyimli rehberlerden oluşuyor. Her turda size en iyi deneyimi sunmak için çalışıyoruz."
                    : "Our team consists of experienced guides with deep knowledge of local culture and nature. We work to give you the best experience on every tour."}
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=1980"
                alt="Our team"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold">8+</p>
                <p className="text-sm">
                  {locale === "tr" ? "Yıllık Deneyim" : "Years Experience"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.values")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`card-value-${index}`}>
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === "tr" ? value.titleTr : value.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {locale === "tr" ? value.descTr : value.descEn}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5000+", labelEn: "Happy Travelers", labelTr: "Mutlu Gezgin" },
              { value: "50+", labelEn: "Unique Tours", labelTr: "Benzersiz Tur" },
              { value: "15+", labelEn: "Expert Guides", labelTr: "Uzman Rehber" },
              { value: "4.9", labelEn: "Average Rating", labelTr: "Ortalama Puan" },
            ].map((stat, i) => (
              <div key={i} data-testid={`stat-${i}`}>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">
                  {locale === "tr" ? stat.labelTr : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
