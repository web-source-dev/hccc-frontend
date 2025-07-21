import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLocationName(location: string): string {
  return location.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
