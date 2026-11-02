/**
 * Fuente de verdad de marca, contacto y textos globales.
 * Actualizar desde /design/brand.md y /design/contact.md
 */
export const siteConfig = {
  /* ── Marca ──────────────────────────────────────────────── */
  name: "LUCA — Pizza Napoletana",
  tagline: "De nuestra familia a la vuestra",
  description:
    "Restaurante de pizza napolitana artesana en Valdepeñas. Masa de 72 h de fermentación, ingredientes italianos DOP y ambiente familiar.",
  url: "https://lucapizzerianapoletana.es",
  locale: "es-ES",

  /* ── Navegación (una ruta = una página en /app) ────────── */
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Carta", href: "/carta" },
    { label: "Reseñas", href: "/resenas" },
    { label: "Galería", href: "/galeria" },
    { label: "Contacto", href: "/contacto" },
  ],
  reserveHref: "/reservar",

  /* ── Contacto ────────────────────────────────────────────── */
  contact: {
    email: "lucafenap@gmail.com",
    phone: "+34 637 672 493",
    address: "Avenida Primero de Julio 68, Local 1 esquina, Valdepeñas",
    // Ficha del local en Google Maps (cid sacado del enlace de reseñas que compartió el cliente).
    mapUrl: "https://www.google.com/maps?cid=9373703998933898423",
  },

  /* ── Titular de la web (aviso legal y privacidad) ───────── */
  // Titular indicado por el cliente (2026-11-02); lo pide la LSSI (art. 10).
  // TODO: confirmar si debe ser el dueño del negocio en lugar del desarrollador.
  legal: {
    owner: "Alexis Nascon",
    taxId: "Z3873470E",
    // Solo si es sociedad: datos del Registro Mercantil.
    registry: "",
  },

  /* ── Horarios ────────────────────────────────────────────── */
  // Confirmados por el cliente el 2026-11-02. `day` = Date.getDay() (0 domingo … 6 sábado).
  // Sirven para mostrarlos (summary) y para validar la hora de las reservas (schedule).
  hours: {
    schedule: [
      { day: 1, label: "Lunes", open: null, close: null },
      { day: 2, label: "Martes", open: "19:00", close: "23:00" },
      { day: 3, label: "Miércoles", open: "19:00", close: "23:30" },
      { day: 4, label: "Jueves", open: "19:00", close: "23:30" },
      { day: 5, label: "Viernes", open: "19:00", close: "23:30" },
      { day: 6, label: "Sábado", open: "19:00", close: "23:30" },
      { day: 0, label: "Domingo", open: null, close: null },
    ],
    summary: [
      "Martes: 19:00 – 23:00",
      "Miércoles a sábado: 19:00 – 23:30",
      "Domingo y lunes: cerrado",
    ],
  },

  /* ── Redes sociales ─────────────────────────────────────── */
  social: {
    instagram: "https://instagram.com/lucapizzanap",
    facebook: "TODO: confirmar página de Facebook",
    tiktok: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
