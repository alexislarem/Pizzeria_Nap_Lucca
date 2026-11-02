/** Fecha de hoy en Valdepeñas como "AAAA-MM-DD" (el formato de <input type="date">). */
export function todayInSpain(): string {
  // "en-CA" formatea como AAAA-MM-DD; la zona horaria evita fallos cerca de medianoche.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}

/** "2026-11-07" → "sábado, 7 de noviembre de 2026" */
export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}
