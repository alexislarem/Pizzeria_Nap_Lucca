import path from "node:path";
import type { NextConfig } from "next";

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
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
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
