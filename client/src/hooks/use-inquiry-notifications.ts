import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Inquiry } from "@shared/schema";

// Notification sound (bell sound using Web Audio API)
function playNotificationSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Bell-like sound with two tones
  oscillator.frequency.value = 800;
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);

  // Second tone
  setTimeout(() => {
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.frequency.value = 1000;
    gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.3);
  }, 150);
}

// Request browser notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Show browser notification
function showBrowserNotification(inquiry: Inquiry) {
  if (Notification.permission === "granted") {
    const notification = new Notification("New Inquiry Received!", {
      body: `From: ${inquiry.name}\nEmail: ${inquiry.email}\n${inquiry.message ? inquiry.message.substring(0, 50) + "..." : ""}`,
      icon: "/logo.png", // Add your logo path here
      badge: "/logo.png",
      tag: inquiry.id,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }
}

interface UseInquiryNotificationsOptions {
  /** Enable sound notifications */
  enableSound?: boolean;
  /** Enable browser notifications */
  enableBrowserNotification?: boolean;
  /** Callback when new inquiry arrives */
  onNewInquiry?: (inquiry: Inquiry) => void;
}

/**
 * Hook to monitor new inquiries and trigger notifications
 *
 * Features:
 * - Sound notification when new inquiry arrives
 * - Browser notification with inquiry details
 * - Automatic permission request for browser notifications
 * - Polls for new inquiries every 30 seconds
 */
export function useInquiryNotifications(options: UseInquiryNotificationsOptions = {}) {
  const {
    enableSound = true,
    enableBrowserNotification = true,
    onNewInquiry,
  } = options;

  const previousInquiriesRef = useRef<Set<string>>(new Set());
  const hasRequestedPermissionRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  // Poll for inquiries every 30 seconds
  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
    refetchInterval: 30000, // 30 seconds
  });

  // Request notification permission on mount
  useEffect(() => {
    if (enableBrowserNotification && !hasRequestedPermissionRef.current) {
      hasRequestedPermissionRef.current = true;
      requestNotificationPermission();
    }
  }, [enableBrowserNotification]);

  // Check for new inquiries
  useEffect(() => {
    if (!inquiries || inquiries.length === 0) {
      return;
    }

    // On first load, just populate the set without triggering notifications
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      inquiries.forEach((inquiry) => {
        previousInquiriesRef.current.add(inquiry.id);
      });
      return;
    }

    // Check for new inquiries
    const newInquiries = inquiries.filter(
      (inquiry) => !previousInquiriesRef.current.has(inquiry.id)
    );

    if (newInquiries.length > 0) {
      // Update the set
      newInquiries.forEach((inquiry) => {
        previousInquiriesRef.current.add(inquiry.id);
      });

      // Trigger notifications for each new inquiry
      newInquiries.forEach((inquiry) => {
        // Sound notification
        if (enableSound) {
          playNotificationSound();
        }

        // Browser notification
        if (enableBrowserNotification) {
          showBrowserNotification(inquiry);
        }

        // Custom callback
        if (onNewInquiry) {
          onNewInquiry(inquiry);
        }
      });
    }
  }, [inquiries, enableSound, enableBrowserNotification, onNewInquiry]);

  return {
    hasPermission: Notification.permission === "granted",
    requestPermission: requestNotificationPermission,
  };
}
