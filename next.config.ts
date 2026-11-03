import path from "node:path";
import type { NextConfig } from "next";

/**
 * Content-Security-Policy: lista de orígenes desde los que la web puede cargar cosas.
 * Si alguien lograra colar un <script> ajeno, el navegador no lo ejecutaría.
 * Externos permitidos: Cloudflare Turnstile (casilla anti-robots) y el mapa de Google.
 * 'unsafe-inline' en scripts lo necesita Next (sus scripts de arranque) y el de la intro;
 * 'unsafe-eval' solo en desarrollo (recarga en caliente).
 */
const isDev = process.env.NODE_ENV === "development";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto: en C:\Users\Usuario hay otro lockfile que confunde a Next
  outputFileTracingRoot: path.join(__dirname),
  // NEXT_DIST_DIR permite compilar en otra carpeta (p. ej. ".next-check") sin pisar
  // la .next que está usando `pnpm dev` a la vez. Por defecto, la de siempre.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // Foodtrucks se convirtió en Reseñas: los enlaces antiguos llegan a la página nueva.
  // Temporal (307) por si Foodtrucks vuelve más adelante.
  async redirects() {
    return [{ source: "/foodtrucks", destination: "/resenas", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // Obliga a usar https durante 2 años (también en subdominios).
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          // "0" = desactivar el filtro antiguo de los navegadores (obsoleto y con fallos propios); la CSP lo sustituye.
          { key: "X-XSS-Protection", value: "0" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
