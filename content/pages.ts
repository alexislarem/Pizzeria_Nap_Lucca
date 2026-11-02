/**
 * Metadatos y textos propios de cada página (lo que no es una sección de la home).
 * Fuente: /design/content.md. Lo que aún no existe allí va marcado con TODO.
 */

export const pages = {
  nosotros: {
    title: "Nosotros",
    description: "La familia detrás de LUCA y nuestra forma de hacer pizza napolitana en Valdepeñas.",
  },
  carta: {
    title: "Carta",
    description: "Pizzas napolitanas, entrantes, postres y bebidas de LUCA en Valdepeñas.",
  },
  galeria: {
    title: "Galería",
    description: "Fotos de nuestras pizzas, el horno y la familia LUCA.",
  },
  contacto: {
    title: "Contacto",
    description: "Dirección, teléfono y email de LUCA — Pizza Napoletana en Valdepeñas.",
  },
  reservar: {
    title: "Reservar mesa",
    description: "Reserva tu mesa en LUCA — Pizza Napoletana, Valdepeñas.",
    eyebrow: "Ti aspettiamo",
    // TODO: confirmar el texto con el cliente.
    intro: "Déjanos tus datos y te confirmamos la mesa por teléfono o email.",
  },
  resenas: {
    title: "Reseñas",
    description: "Opiniones de quienes han probado la pizza napolitana de LUCA en Valdepeñas.",
  },
} as const;
