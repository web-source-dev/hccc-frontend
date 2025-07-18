import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time-based disclaimer utilities
export interface TimeDisclaimer {
  show: boolean;
  message: string;
  type: 'warning' | 'info';
}

export function getTimeDisclaimer(location: string): TimeDisclaimer {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

  // Normalize location name for comparison
  const normalizedLocation = location.toLowerCase().replace(/[-\s]/g, '');

  if (normalizedLocation.includes('libertyhill') || normalizedLocation.includes('liberty')) {
    // Liberty Hill: After 11 PM (23:00) = 1380 minutes
    if (currentTime >= 1380) {
      return {
        show: true,
        message: "⚠️ Tokens purchased after 11:00 PM will not be added until the next business day.",
        type: 'warning'
      };
    }
  } else if (normalizedLocation.includes('cedarpark') || normalizedLocation.includes('cedar')) {
    // Cedar Park: After 3 AM (03:00) = 180 minutes
    if (currentTime >= 180) {
      return {
        show: true,
        message: "⚠️ Tokens purchased after 3:00 AM will not be added until the next business day.",
        type: 'warning'
      };
    }
  }

  return {
    show: false,
    message: '',
    type: 'info'
  };
}

export function formatLocationName(location: string): string {
  return location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
