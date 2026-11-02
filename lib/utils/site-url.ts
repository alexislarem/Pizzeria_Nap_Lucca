import { siteConfig } from "@/site.config";

/**
 * URL pública de la web, sin barra final. Orden: NEXT_PUBLIC_URL (si se define
 * en Vercel) → dominio de site.config.ts en producción → localhost en desarrollo.
 */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_URL ??
    (process.env.NODE_ENV === "production" ? siteConfig.url : "http://localhost:3000");
  return url.replace(/\/$/, "");
}
