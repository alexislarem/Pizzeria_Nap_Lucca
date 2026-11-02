import { siteConfig } from "@/site.config";
import { siteUrl } from "@/lib/utils/site-url";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Ficha de restaurante en formato schema.org (JSON-LD) para Google: dirección,
 * horario, teléfono, carta y redes. Ayuda a que salga bien en búsquedas y Maps.
 * Sin valoraciones: Google no admite marcar reseñas propias en la web del negocio.
 */
export function restaurantJsonLd() {
  const base = siteUrl();
  const { contact, hours, social } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    description: siteConfig.description,
    url: base,
    image: `${base}/opengraph-image`,
    telephone: contact.phone.replace(/\s/g, ""),
    email: contact.email,
    servesCuisine: ["Pizza napolitana", "Italiana"],
    // Rango que indican los clientes en Google Maps.
    priceRange: "€10–20",
    acceptsReservations: true,
    menu: `${base}/carta`,
    hasMap: contact.mapUrl,
    sameAs: [social.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenida Primero de Julio 68, Local 1 esquina",
      postalCode: "13300",
      addressLocality: "Valdepeñas",
      addressRegion: "Ciudad Real",
      addressCountry: "ES",
    },
    openingHoursSpecification: hours.schedule
      .filter((h) => h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_NAMES[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
  };
}
