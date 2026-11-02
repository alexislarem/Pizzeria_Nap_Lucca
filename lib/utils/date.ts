import { siteConfig } from "@/site.config";

/** Fecha de hoy en Valdepeñas como "AAAA-MM-DD" (el formato de <input type="date">). */
export function todayInSpain(): string {
  // "en-CA" formatea como AAAA-MM-DD; la zona horaria evita fallos cerca de medianoche.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(
    new Date()
  );
}

/** "2026-11-07" → "sábado, 7 de noviembre de 2026" */
export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

/** Horario de apertura de un día ("AAAA-MM-DD"), o `null` si ese día cierra. */
export function openingHoursFor(isoDate: string): { open: string; close: string } | null {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const entry = siteConfig.hours.schedule.find((h) => h.day === weekday);
  return entry?.open && entry.close ? { open: entry.open, close: entry.close } : null;
}
