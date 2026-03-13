// WhatsApp Business Number - Configure in .env file (VITE_WHATSAPP_NUMBER)
// Format: "+90XXXXXXXXXX" (with country code, no spaces)
// Default: C Plus Andaman Travel Turkey WhatsApp line
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "+905335531208";

interface WhatsAppMessageParams {
  tourName?: string;
  date?: string;
  people?: number;
  hotel?: string;
  locale?: "en" | "tr";
}

const messages = {
  en: {
    intro: "Hi, I'm interested in your tours.",
    introWithTour: (tour: string) => `Hi, I'm interested in ${tour}.`,
    date: "Date",
    people: "People",
    hotel: "Hotel",
    question: "Can you share availability and details?",
  },
  tr: {
    intro: "Merhaba, turlarınızla ilgileniyorum.",
    introWithTour: (tour: string) => `Merhaba, ${tour} ile ilgileniyorum.`,
    date: "Tarih",
    people: "Kişi Sayısı",
    hotel: "Otel",
    question: "Müsaitlik ve detayları paylaşabilir misiniz?",
  },
};

export function generateWhatsAppMessage(params: WhatsAppMessageParams = {}): string {
  const locale = params.locale || "en";
  const t = messages[locale];

  let message = t.intro;

  if (params.tourName) {
    message = t.introWithTour(params.tourName);
  }

  const details: string[] = [];
  if (params.date) details.push(`${t.date}: ${params.date}`);
  if (params.people) details.push(`${t.people}: ${params.people}`);
  if (params.hotel) details.push(`${t.hotel}: ${params.hotel}`);

  if (details.length > 0) {
    message += ` ${details.join(", ")}.`;
  }

  message += ` ${t.question}`;

  return message;
}

export function getWhatsAppLink(params: WhatsAppMessageParams = {}): string {
  const message = generateWhatsAppMessage(params);
  const encodedMessage = encodeURIComponent(message);
  // Remove all non-numeric characters from phone number
  const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  // Use wa.me (official WhatsApp link format)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function openWhatsApp(params: WhatsAppMessageParams = {}) {
  const link = getWhatsAppLink(params);
  window.open(link, "_blank");
}
