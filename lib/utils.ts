import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

/** "il y a 3 heures", "il y a 2 jours" — falls back to "à l'instant" under a minute. */
export function formatRelativeTime(isoDate: string) {
  const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (seconds < 60) return "à l'instant";

  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return relativeTimeFormatter.format(-value, unit);
  }
  return "à l'instant";
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
