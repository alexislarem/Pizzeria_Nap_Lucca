/**
 * Fuente de verdad de marca, contacto y textos globales.
 * Actualizar desde /design/brand.md y /design/contact.md
 */
export const siteConfig = {
  /* ── Marca ──────────────────────────────────────────────── */
  name:        "LUCA — Pizza Napoletana",
  tagline:     "De nuestra familia a la vuestra",
  description: "Restaurante de pizza napolitana artesana en Valdepeñas. Masa de 72 h de fermentación, ingredientes italianos DOP y ambiente familiar.",
  url:         "TODO: https://lucapizzanap.com",
  locale:      "es-ES",

  /* ── Navegación (una ruta = una página en /app) ────────── */
  nav: [
    { label: "Inicio",     href: "/" },
    { label: "Nosotros",   href: "/nosotros" },
    { label: "Carta",      href: "/carta" },
    { label: "Reseñas",    href: "/resenas" },
    { label: "Galería",    href: "/galeria" },
    { label: "Contacto",   href: "/contacto" },
  ],
  reserveHref: "/reservar",

  /* ── Contacto ────────────────────────────────────────────── */
  contact: {
    email:    "lucafenap@gmail.com",
    phone:    "+34 637 672 493",
    address:  "Avenida Primero de Julio 68, Local 1 esquina, Valdepeñas",
    // Ficha del local en Google Maps (cid sacado del enlace de reseñas que compartió el cliente).
    mapUrl:   "https://www.google.com/maps?cid=9373703998933898423",
  },

  /* ── Horarios ────────────────────────────────────────────── */
  hours: {
    weekdays: "TODO: confirmar horarios con el cliente",
    weekend:  "TODO: confirmar horarios con el cliente",
  },

  /* ── Redes sociales ─────────────────────────────────────── */
  social: {
    instagram: "https://instagram.com/lucapizzanap",
    facebook:  "TODO: confirmar página de Facebook",
    tiktok:    "",
  },

  /* ── SEO ──────────────────────────────────────────────────── */
  ogImage: "/images/og-default.jpg", // TODO: crear imagen OG (1200×630)
} as const;

export type SiteConfig = typeof siteConfig;
