import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Locale = "en" | "tr";

interface Translations {
  [key: string]: {
    en: string;
    tr: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", tr: "Ana Sayfa" },
  "nav.tours": { en: "Tours", tr: "Turlar" },
  "nav.about": { en: "About", tr: "Hakkımızda" },
  "nav.faq": { en: "FAQ", tr: "SSS" },
  "nav.reviews": { en: "Reviews", tr: "Yorumlar" },
  "nav.blog": { en: "Blog", tr: "Blog" },
  "nav.contact": { en: "Contact", tr: "İletişim" },
  
  // Company
  "company.name": { en: "C Plus Andaman Travel | Phuket", tr: "C Plus Andaman Travel | Phuket" },
  "company.shortName": { en: "C Plus Andaman Travel", tr: "C Plus Andaman Travel" },
  "company.tagline": { en: "Premium Tours & Excursions in Phuket", tr: "Phuket'te Premium Turlar ve Geziler" },

  // Hero
  "hero.title": { en: "Discover Paradise in Phuket", tr: "Phuket'te Cenneti Keşfedin" },
  "hero.subtitle": { en: "Experience unforgettable adventures with C Plus Andaman Travel - your trusted travel agency in Patong", tr: "C Plus Andaman Travel ile unutulmaz maceralar yaşayın - Patong'daki güvenilir seyahat acenteniz" },
  "hero.cta.contact": { en: "Contact Us", tr: "İletişime Geç" },
  "hero.cta.explore": { en: "Explore Tours", tr: "Turları Keşfet" },
  
  // Tours
  "tours.title": { en: "Our Tours", tr: "Turlarımız" },
  "tours.featured": { en: "Featured Tours", tr: "Öne Çıkan Turlar" },
  "tours.popular": { en: "Popular Tours", tr: "Popüler Turlar" },
  "tours.all": { en: "All Tours", tr: "Tüm Turlar" },
  "tours.from": { en: "From", tr: "Başlayan" },
  "tours.duration": { en: "Duration", tr: "Süre" },
  "tours.viewDetails": { en: "View Details", tr: "Detayları Gör" },
  "tours.highlights": { en: "Highlights", tr: "Öne Çıkanlar" },
  "tours.itinerary": { en: "Itinerary", tr: "Program" },
  "tours.includes": { en: "What's Included", tr: "Dahil Olanlar" },
  "tours.excludes": { en: "What's Not Included", tr: "Dahil Olmayanlar" },
  "tours.pickupInfo": { en: "Pickup Information", tr: "Alış Bilgileri" },
  "tours.cancellation": { en: "Cancellation Policy", tr: "İptal Politikası" },
  
  // Inquiry Form
  "inquiry.title": { en: "Request Information", tr: "Bilgi Talebi" },
  "inquiry.name": { en: "Full Name", tr: "Ad Soyad" },
  "inquiry.email": { en: "Email", tr: "E-posta" },
  "inquiry.phone": { en: "Phone / WhatsApp", tr: "Telefon / WhatsApp" },
  "inquiry.date": { en: "Preferred Date", tr: "Tercih Edilen Tarih" },
  "inquiry.people": { en: "Number of People", tr: "Kişi Sayısı" },
  "inquiry.hotel": { en: "Hotel Name", tr: "Otel Adı" },
  "inquiry.message": { en: "Message", tr: "Mesaj" },
  "inquiry.submit": { en: "Send Inquiry", tr: "Talep Gönder" },
  "inquiry.success": { en: "Thank you! We'll contact you shortly.", tr: "Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz." },
  "inquiry.whatsappCta": { en: "Message on WhatsApp", tr: "WhatsApp'ta Sor" },
  "inquiry.checkAvailability": { en: "Check Availability", tr: "Müsaitlik Sorgula" },
  "inquiry.getQuote": { en: "Get a Quote", tr: "Fiyat Teklifi Al" },
  
  // About
  "about.title": { en: "About Us", tr: "Hakkımızda" },
  "about.story": { en: "Our Story", tr: "Hikayemiz" },
  "about.mission": { en: "Our Mission", tr: "Misyonumuz" },
  "about.values": { en: "Our Values", tr: "Değerlerimiz" },
  
  // FAQ
  "faq.title": { en: "Frequently Asked Questions", tr: "Sıkça Sorulan Sorular" },
  "faq.subtitle": { en: "Find answers to common questions", tr: "Sık sorulan sorulara cevaplar" },
  
  // Reviews
  "reviews.title": { en: "What Our Guests Say", tr: "Misafirlerimiz Ne Diyor" },
  "reviews.subtitle": { en: "Real experiences from real travelers", tr: "Gerçek gezginlerden gerçek deneyimler" },
  
  // Blog
  "blog.title": { en: "Travel Blog", tr: "Seyahat Blogu" },
  "blog.readMore": { en: "Read More", tr: "Devamını Oku" },
  "blog.subtitle": { en: "Tips, guides and stories from Phuket", tr: "Phuket'ten ipuçları, rehberler ve hikayeler" },
  
  // Contact
  "contact.title": { en: "Contact Us", tr: "İletişim" },
  "contact.subtitle": { en: "Visit us in Patong or get in touch", tr: "Patong'daki ofisimizi ziyaret edin veya iletişime geçin" },
  "contact.address": { en: "Address", tr: "Adres" },
  "contact.email": { en: "Email", tr: "E-posta" },
  "contact.phone": { en: "Phone", tr: "Telefon" },
  "contact.hours": { en: "Working Hours", tr: "Çalışma Saatleri" },
  "contact.getDirections": { en: "Get Directions", tr: "Yol Tarifi Al" },
  "contact.followUs": { en: "Follow Us", tr: "Bizi Takip Edin" },

  // Google Reviews
  "reviews.google.title": { en: "Google Reviews", tr: "Google Yorumları" },
  "reviews.google.basedOn": { en: "Based on {count} Google reviews", tr: "{count} Google yorumuna göre" },
  "reviews.google.readMore": { en: "Read more on Google", tr: "Google'da devamını oku" },
  "reviews.google.viewAll": { en: "View all reviews on Google", tr: "Tüm yorumları Google'da görüntüle" },
  "reviews.google.loading": { en: "Loading reviews...", tr: "Yorumlar yükleniyor..." },
  
  // Footer
  "footer.quickLinks": { en: "Quick Links", tr: "Hızlı Linkler" },
  "footer.popularTours": { en: "Popular Tours", tr: "Popüler Turlar" },
  "footer.newsletter": { en: "Newsletter", tr: "Bülten" },
  "footer.newsletterText": { en: "Subscribe for exclusive offers", tr: "Özel teklifler için abone olun" },
  "footer.subscribe": { en: "Subscribe", tr: "Abone Ol" },
  "footer.rights": { en: "All rights reserved", tr: "Tüm hakları saklıdır" },
  
  // Common
  "common.loading": { en: "Loading...", tr: "Yükleniyor..." },
  "common.error": { en: "An error occurred", tr: "Bir hata oluştu" },
  "common.noResults": { en: "No results found", tr: "Sonuç bulunamadı" },
  "common.search": { en: "Search", tr: "Ara" },
  "common.filter": { en: "Filter", tr: "Filtre" },
  "common.close": { en: "Close", tr: "Kapat" },
  "common.back": { en: "Back", tr: "Geri" },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return (saved === "en" || saved === "tr") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[locale] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function getTranslatedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: Locale
): string {
  const localizedField = `${field}${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof T;
  const value = item[localizedField];
  return typeof value === "string" ? value : "";
}
