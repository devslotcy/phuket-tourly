import { MapPin, Mail, Phone, Clock, MessageCircle } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const contactInfo = [
  {
    icon: MapPin,
    titleEn: "Address",
    titleTr: "Adres",
    content: "123 Beach Road, Patong, Phuket 83150, Thailand",
  },
  {
    icon: Mail,
    titleEn: "Email",
    titleTr: "E-posta",
    content: "info@phuket-tours.com",
  },
  {
    icon: Phone,
    titleEn: "Phone",
    titleTr: "Telefon",
    content: "+66 76 123 456",
  },
  {
    icon: Clock,
    titleEn: "Working Hours",
    titleTr: "Çalışma Saatleri",
    content: "Mon-Sun: 8:00 AM - 8:00 PM",
  },
];

export default function Contact() {
  const { locale, t } = useLanguage();

  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=2070')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {locale === "tr" ? "Bize Mesaj Gönderin" : "Send Us a Message"}
              </h2>
              <Card>
                <CardContent className="p-6">
                  <InquiryForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {locale === "tr" ? "İletişim Bilgileri" : "Contact Information"}
                </h2>
                <div className="grid gap-4">
                  {contactInfo.map((item, index) => (
                    <Card key={index} className="hover-elevate" data-testid={`card-contact-${index}`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {locale === "tr" ? item.titleTr : item.titleEn}
                          </h3>
                          <p className="text-muted-foreground">{item.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="bg-[#25D366] border-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 text-white">
                    <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                    <p className="text-white/80 text-sm">
                      {locale === "tr"
                        ? "Hızlı yanıt için WhatsApp'tan yazın"
                        : "Message us on WhatsApp for quick response"}
                    </p>
                  </div>
                  <a
                    href="https://wa.me/6676123456"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      className="bg-white text-[#25D366] hover:bg-white/90"
                      data-testid="button-whatsapp-contact"
                    >
                      {locale === "tr" ? "Sohbet Başlat" : "Start Chat"}
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63349.73631881!2d98.26544744863279!3d7.8844269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30503a0110b3a337%3A0x30223d9ca0e3b30!2sPatong%2C%20Kathu%20District%2C%20Phuket%2083150%2C%20Thailand!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
