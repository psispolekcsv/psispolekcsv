import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "d. M. yyyy", { locale: cs });
}

export function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "d. M. yyyy HH:mm", { locale: cs });
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://jirivrbatestweb.asia").replace(/\/$/, "");
}

export function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function asBool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export function mediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
  return `/api/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function yearFromIso(value?: string) {
  if (!value || value.length < 4) return "";
  return value.slice(0, 4);
}
