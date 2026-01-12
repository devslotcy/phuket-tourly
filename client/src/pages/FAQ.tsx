import { useQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n";
import type { FAQ } from "@shared/schema";

export default function FAQPage() {
  const { locale, t } = useLanguage();

  const { data: faqs, isLoading } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs"],
  });

  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("faq.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            {t("faq.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : faqs && faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border rounded-lg px-4 data-[state=open]:bg-card"
                  data-testid={`faq-item-${faq.id}`}
                >
                  <AccordionTrigger className="text-left py-4 hover:no-underline">
                    <span className="font-semibold">
                      {locale === "tr" ? faq.questionTr : faq.questionEn}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {locale === "tr" ? faq.answerTr : faq.answerEn}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">{t("common.noResults")}</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
