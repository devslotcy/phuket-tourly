# Inquiry Notification System
## C Plus Andaman Travel | Phuket

This document explains the comprehensive notification system for incoming customer inquiries.

---

## 🔔 Overview

When a customer submits an inquiry through the website, you receive **multiple notifications**:

1. **Sound Notification** - Bell sound plays in the browser
2. **Browser Notification** - Desktop notification with inquiry details
3. **Visual Badge** - "X New" badge appears in admin panel
4. **Console Log** - Detailed inquiry logged in terminal
5. **WhatsApp Link** - Click-to-send WhatsApp message (manual)
6. **Twilio WhatsApp** - Automatic WhatsApp message (optional, requires setup)

---

## 🎯 Features Implemented

### 1. Browser Notifications (Real-time)

**Location:** Admin Inquiries page ([/admin/inquiries](http://localhost:3001/admin/inquiries))

**How it works:**
- Polls for new inquiries every 30 seconds
- Plays bell sound when new inquiry arrives
- Shows desktop notification with customer details
- Shows toast notification in admin panel
- Works even when browser tab is in background

**Permissions:**
- First time: Browser will ask for notification permission
- Click "Notifications On" button to toggle on/off
- Grant permission to receive desktop notifications

**Technical Details:**
- Uses Web Audio API for sound (no external files needed)
- Uses Notification API for browser notifications
- Uses React Query polling (30-second interval)
- Custom hook: `useInquiryNotifications` in [client/src/hooks/use-inquiry-notifications.ts](client/src/hooks/use-inquiry-notifications.ts)

### 2. Visual Badge

**Location:** Admin Inquiries page header

**Display:**
```
Inquiries    [5 New]    [🔔 Notifications On]
```

- Shows count of inquiries with "NEW" status
- Blue badge with white text
- Updates in real-time as inquiries arrive

### 3. Server-Side Console Notifications

**Location:** Terminal where server is running

**When it triggers:**
- Every time a customer submits an inquiry via the website
- Logs inquiry details to console
- Generates WhatsApp notification link

**Example output:**
```
============================================================
🔔 NEW INQUIRY RECEIVED
============================================================
Name: John Doe
Email: john@example.com
Phone: +905335531208
Date: 2026-02-15
People: 4
Hotel: Hilton Phuket
Message: Interested in island hopping tour

WhatsApp notification link:
https://wa.me/905335531208?text=...
============================================================
```

### 4. WhatsApp Notifications

Two options available:

#### Option A: Manual (Free, No Setup)
- Console logs a WhatsApp link when inquiry arrives
- Click the link to open WhatsApp with pre-filled message
- Send the message to yourself manually
- **Current implementation** (works out of the box)

#### Option B: Automatic (Requires Twilio Setup)
- Automatically sends WhatsApp message when inquiry arrives
- Requires Twilio account and WhatsApp Business API
- See setup instructions below

---

## 🚀 How to Use

### For Admin Panel Notifications:

1. **Enable Notifications:**
   - Go to [/admin/inquiries](http://localhost:3001/admin/inquiries)
   - Click "Notifications On" button (if off)
   - Allow browser notifications when prompted

2. **Test Notifications:**
   - Open website in another browser/incognito mode
   - Submit an inquiry through contact form or tour page
   - Wait up to 30 seconds for notification to appear
   - You should hear a bell sound and see desktop notification

3. **Check New Inquiries:**
   - Look for blue "X New" badge next to "Inquiries" title
   - Click eye icon to view inquiry details
   - Change status to mark as contacted/confirmed

### For WhatsApp Notifications:

#### Using Manual Method (Current):
1. Watch the terminal where server is running (`npm run dev`)
2. When inquiry arrives, look for WhatsApp link in console
3. Click or copy the WhatsApp link
4. Send yourself the notification message

#### Using Automatic Method (Optional Setup):
1. Sign up for Twilio: https://www.twilio.com/try-twilio
2. Set up WhatsApp sandbox: https://www.twilio.com/console/sms/whatsapp/sandbox
3. Get credentials from Twilio Console
4. Update `.env` file:
   ```env
   TWILIO_ACCOUNT_SID="your_account_sid"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
   ADMIN_WHATSAPP_NUMBER="+905335531208"
   ```
5. Uncomment Twilio code in [server/whatsapp-notifier.ts](server/whatsapp-notifier.ts)
6. Install Twilio: `npm install twilio`
7. Restart server: `npm run dev`

---

## 📁 Files Modified/Created

### New Files:
```
client/src/hooks/use-inquiry-notifications.ts  # Notification hook
server/whatsapp-notifier.ts                    # WhatsApp notification service
NOTIFICATIONS.md                               # This file
```

### Modified Files:
```
client/src/pages/admin/Inquiries.tsx          # Added notification toggle + badge
server/routes.ts                              # Added notification triggers
.env                                          # Added WhatsApp config
```

---

## 🛠 Configuration

### Environment Variables

Add to `.env`:

```env
# Admin WhatsApp for inquiry notifications
ADMIN_WHATSAPP_NUMBER="+905335531208"

# Twilio WhatsApp API (optional - for automatic notifications)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

### Notification Settings

Default behavior:
- **Polling interval:** 30 seconds
- **Sound enabled:** Yes (toggle in UI)
- **Browser notifications:** Yes (requires permission)
- **WhatsApp method:** Manual (console link)

To customize:
- **Change polling interval:** Edit `refetchInterval` in [client/src/hooks/use-inquiry-notifications.ts:91](client/src/hooks/use-inquiry-notifications.ts)
- **Disable sound:** Click "Notifications Off" in admin panel
- **Change admin WhatsApp:** Update `ADMIN_WHATSAPP_NUMBER` in `.env`

---

## 🔍 Testing the Notification System

### Test Checklist:

1. **Browser Notifications:**
   - [ ] Open admin panel: http://localhost:3001/admin/inquiries
   - [ ] Ensure "Notifications On" button is active
   - [ ] Grant browser notification permission
   - [ ] Submit test inquiry from website
   - [ ] Verify bell sound plays (within 30 seconds)
   - [ ] Verify desktop notification appears
   - [ ] Verify toast notification shows in admin panel

2. **Visual Badge:**
   - [ ] Check "X New" badge appears after inquiry
   - [ ] Badge shows correct count of NEW inquiries
   - [ ] Badge updates when status changes

3. **Console Notifications:**
   - [ ] Watch terminal where server is running
   - [ ] Submit inquiry from website
   - [ ] Verify formatted inquiry details log
   - [ ] Verify WhatsApp link is generated

4. **WhatsApp Notifications:**
   - [ ] Find WhatsApp link in console
   - [ ] Click link or copy to browser
   - [ ] Verify WhatsApp opens with pre-filled message
   - [ ] Verify message contains inquiry details
   - [ ] Send message to yourself

---

## 📱 WhatsApp Message Format

Notification messages are formatted like this:

```
🔔 *NEW INQUIRY RECEIVED*

👤 *Name:* John Doe
📧 *Email:* john@example.com
📱 *Phone:* +905335531208
📅 *Date:* 2026-02-15
👥 *People:* 4
🏨 *Hotel:* Hilton Phuket

💬 *Message:*
Interested in island hopping tour. What time does it start?

---
🔗 View in admin panel:
http://localhost:3001/admin/inquiries
```

---

## 🚨 Troubleshooting

### Browser notifications not showing?

**Issue:** No desktop notification appears

**Solutions:**
1. Check browser notification permission:
   - Chrome: chrome://settings/content/notifications
   - Allow notifications for your site
2. Click "Notifications On" button in admin panel
3. Test with incognito mode (permission may be blocked)
4. Check browser console for errors

### Sound not playing?

**Issue:** No bell sound on new inquiry

**Solutions:**
1. Ensure "Notifications On" is enabled
2. Check browser audio permissions
3. Unmute browser tab
4. Try toggling notifications off/on

### WhatsApp link not working?

**Issue:** Link doesn't open WhatsApp

**Solutions:**
1. Verify WhatsApp is installed (desktop or mobile)
2. Check `ADMIN_WHATSAPP_NUMBER` format in `.env`
3. Copy link and paste in browser manually
4. Use WhatsApp Web: https://web.whatsapp.com

### Not receiving notifications at all?

**Issue:** No notifications appear after inquiry submission

**Solutions:**
1. Verify server is running: `npm run dev`
2. Check console for errors
3. Wait 30 seconds (polling interval)
4. Manually refresh admin panel
5. Check inquiry was actually created (database)

---

## 🎓 How It Works (Technical)

### Frontend Flow:

1. User opens [/admin/inquiries](http://localhost:3001/admin/inquiries)
2. `useInquiryNotifications` hook starts polling every 30s
3. Hook tracks inquiry IDs in a Set
4. On new inquiry detected:
   - Plays bell sound (Web Audio API)
   - Shows browser notification (Notification API)
   - Triggers toast notification
   - Calls `onNewInquiry` callback

### Backend Flow:

1. User submits inquiry form from website
2. POST `/api/inquiries` endpoint receives data
3. Inquiry saved to PostgreSQL database
4. `logInquiryNotification()` logs to console
5. `sendWhatsAppNotification()` generates WhatsApp link
6. Response sent back to user with success message

### Notification Polling:

```typescript
const { data: inquiries } = useQuery<Inquiry[]>({
  queryKey: ["/api/admin/inquiries"],
  refetchInterval: 30000, // Poll every 30 seconds
});
```

---

## 💡 Future Enhancements

Potential improvements:

1. **WebSocket Real-Time Notifications**
   - Replace polling with WebSocket connection
   - Instant notifications (no 30-second delay)
   - Lower server load

2. **Email Notifications**
   - Send email to admin when inquiry arrives
   - Include inquiry details in email body
   - Use nodemailer or SendGrid

3. **Telegram Bot Notifications**
   - Alternative to WhatsApp
   - Easier API integration
   - No phone number required

4. **Slack/Discord Webhooks**
   - Post inquiry to Slack channel
   - Team collaboration
   - Better for multiple admins

5. **SMS Notifications**
   - Text message alerts
   - Via Twilio SMS API
   - Guaranteed delivery

6. **Custom Notification Sound**
   - Upload custom audio file
   - Different sounds for priority inquiries
   - User preferences

---

## 📊 Best Practices

### For Admins:

1. **Keep admin panel open in pinned tab**
   - Notifications work in background tabs
   - Desktop notifications will still appear
   - Consider using separate browser profile for work

2. **Check inquiries regularly**
   - Even with notifications, check panel hourly
   - New inquiries badge shows count
   - Sort by newest first

3. **Respond quickly**
   - Use WhatsApp button to contact immediately
   - Change status to "CONTACTED" after reaching out
   - Add internal notes for follow-up

4. **Enable notification sound**
   - Keep "Notifications On" enabled during work hours
   - Bell sound alerts you even when focused elsewhere
   - Turn off outside business hours

### For Developers:

1. **Monitor console logs**
   - Watch for WhatsApp notification links
   - Check for any errors in notification system
   - Verify inquiry data is complete

2. **Adjust polling interval if needed**
   - 30 seconds balances real-time vs server load
   - Decrease for higher urgency (15s)
   - Increase for lower traffic (60s)

3. **Set up Twilio for production**
   - Manual WhatsApp links are OK for development
   - Production should use automatic notifications
   - Consider costs (Twilio charges per message)

---

## 📞 Support

**WhatsApp Number:** +90 533 553 12 08
**Thailand Phone:** +66 95 441 6562
**Email:** info@cplusandaman.com

---

**Last Updated:** January 2026
**Implementation By:** Claude Code
**Company:** C Plus Andaman Travel | Phuket
