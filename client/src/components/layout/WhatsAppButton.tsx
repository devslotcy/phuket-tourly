import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  const phoneNumber = "6676123456";
  const message = encodeURIComponent("Hello! I'm interested in booking a tour.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      data-testid="button-whatsapp"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg animate-pulse"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </a>
  );
}
