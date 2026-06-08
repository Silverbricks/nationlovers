import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { CATEGORIES, SEVERITY_CONFIG } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM yyyy");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getCategoryConfig(category: string) {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
}

export function getCategoryIcon(category: string): string {
  return getCategoryConfig(category).icon;
}

export function getCategoryLabel(category: string): string {
  return getCategoryConfig(category).label;
}

export function getSeverityConfig(severity: string) {
  return SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.LOW;
}

export function formatUpvotes(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function getStateLabel(state: string): string {
  const stateMap: Record<string, string> = {
    NSW: "New South Wales",
    VIC: "Victoria",
    QLD: "Queensland",
    WA: "Western Australia",
    SA: "South Australia",
    TAS: "Tasmania",
    ACT: "ACT",
    NT: "Northern Territory",
  };
  return stateMap[state] ?? state;
}
