import type { Inquiry } from "@shared/schema";

/**
 * WhatsApp Notification Service
 *
 * This service sends notifications to your WhatsApp when a new inquiry arrives.
 *
 * Options:
 * 1. Use WhatsApp Business API (requires Meta Business account)
 * 2. Use third-party services like Twilio, MessageBird, or Vonage
 * 3. Use wa.me links (manual, but free)
 *
 * Current implementation: Uses wa.me link generation (free, but manual)
 *
 * To enable automatic WhatsApp notifications:
 * - Set up Twilio WhatsApp API: https://www.twilio.com/whatsapp
 * - Or use Meta WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
 */

const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "+905335531208";

/**
 * Format inquiry details into a WhatsApp message
 */
export function formatInquiryForWhatsApp(inquiry: Inquiry): string {
  const parts = [
    "🔔 *NEW INQUIRY RECEIVED*",
    "",
    `👤 *Name:* ${inquiry.name}`,
    `📧 *Email:* ${inquiry.email}`,
  ];

  if (inquiry.phone) {
    parts.push(`📱 *Phone:* ${inquiry.phone}`);
  }

  if (inquiry.date) {
    parts.push(`📅 *Date:* ${inquiry.date}`);
  }

  if (inquiry.peopleCount) {
    parts.push(`👥 *People:* ${inquiry.peopleCount}`);
  }

  if (inquiry.hotel) {
    parts.push(`🏨 *Hotel:* ${inquiry.hotel}`);
  }

  if (inquiry.message) {
    parts.push("", `💬 *Message:*`, inquiry.message);
  }

  parts.push(
    "",
    "---",
    "🔗 View in admin panel:",
    `${process.env.SITE_URL || "http://localhost:3001"}/admin/inquiries`
  );

  return parts.join("\n");
}

/**
 * Generate a wa.me link with the inquiry notification
 * The admin can click this link to send themselves the notification
 */
export function generateWhatsAppNotificationLink(inquiry: Inquiry): string {
  const message = formatInquiryForWhatsApp(inquiry);
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Send WhatsApp notification using Twilio (optional)
 *
 * To enable:
 * 1. Install: npm install twilio
 * 2. Set environment variables:
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_WHATSAPP_NUMBER (e.g., "whatsapp:+14155238886")
 * 3. Uncomment the code below
 */
export async function sendWhatsAppNotification(inquiry: Inquiry): Promise<boolean> {
  // Skip if Twilio credentials are not configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log("WhatsApp notifications not configured. To enable:");
    console.log("1. Sign up for Twilio: https://www.twilio.com/try-twilio");
    console.log("2. Set up WhatsApp sandbox: https://www.twilio.com/console/sms/whatsapp/sandbox");
    console.log("3. Add environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER");
    console.log("\nGenerated WhatsApp link:");
    console.log(generateWhatsAppNotificationLink(inquiry));
    return false;
  }

  try {
    // Uncomment and install twilio package to enable:
    /*
    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // e.g., "whatsapp:+14155238886"
      to: `whatsapp:${ADMIN_WHATSAPP_NUMBER}`,
      body: formatInquiryForWhatsApp(inquiry),
    });

    console.log(`✅ WhatsApp notification sent to ${ADMIN_WHATSAPP_NUMBER}`);
    return true;
    */

    // For now, just log the notification link
    console.log("\n📱 New inquiry received! Send yourself this WhatsApp message:");
    console.log(generateWhatsAppNotificationLink(inquiry));
    console.log("");

    return false;
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
    return false;
  }
}

/**
 * Log inquiry notification to console
 */
export function logInquiryNotification(inquiry: Inquiry): void {
  console.log("\n" + "=".repeat(60));
  console.log("🔔 NEW INQUIRY RECEIVED");
  console.log("=".repeat(60));
  console.log(`Name: ${inquiry.name}`);
  console.log(`Email: ${inquiry.email}`);
  if (inquiry.phone) console.log(`Phone: ${inquiry.phone}`);
  if (inquiry.date) console.log(`Date: ${inquiry.date}`);
  if (inquiry.peopleCount) console.log(`People: ${inquiry.peopleCount}`);
  if (inquiry.hotel) console.log(`Hotel: ${inquiry.hotel}`);
  if (inquiry.message) console.log(`Message: ${inquiry.message}`);
  console.log("\nWhatsApp notification link:");
  console.log(generateWhatsAppNotificationLink(inquiry));
  console.log("=".repeat(60) + "\n");
}
