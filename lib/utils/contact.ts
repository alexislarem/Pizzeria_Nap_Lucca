import { siteConfig } from "@/site.config";

const { contact, social } = siteConfig;

/** Un valor de site.config está "puesto" si no está vacío ni marcado como TODO. */
export const isSet = (value: string) => value !== "" && !value.startsWith("TODO");

/** "+34 637 672 493" → "tel:+34637672493" (los espacios rompen algunos marcadores). */
export const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;

export const mailHref = `mailto:${contact.email}`;

/**
 * Enlace "Cómo llegar". Usa el de site.config cuando exista;
 * mientras tanto, una búsqueda de Google Maps con la dirección.
 */
export const mapsHref = isSet(contact.mapUrl)
  ? contact.mapUrl
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

/** "https://instagram.com/lucapizzanap" → "@lucapizzanap" */
export const instagramHandle = `@${social.instagram.split("/").filter(Boolean).pop()}`;

/**
 * Mapa incrustado (iframe) de Google Maps con la dirección. No necesita clave de API.
 * Se busca por nombre + dirección: así el mapa marca la ficha del local.
 */
export const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(`LUCA Pizza Napoletana, ${contact.address}`)}&z=17&output=embed`;
