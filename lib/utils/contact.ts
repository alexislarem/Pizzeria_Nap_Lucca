import { siteConfig } from "@/site.config";

const { contact, social } = siteConfig;

/** Un valor de site.config está "puesto" si no está vacío ni marcado como TODO. */
export const isSet = (value: string) => value !== "" && !value.startsWith("TODO");

/** "+34 637 672 493" → "tel:+34637672493" (los espacios rompen algunos marcadores). */
export const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;

export const mailHref = `mailto:${contact.email}`;

/** "+34 926 300 368" → "tel:+34926300368" (fijo del local). */
export const landlineHref = `tel:${contact.landline.replace(/\s/g, "")}`;

/** Botón genérico "Escríbenos por WhatsApp" (enlace corto oficial de WhatsApp Business). */
export const whatsappHref = contact.whatsapp.link;

/** Abre un chat con LUCA con `text` ya escrito: la persona solo tiene que pulsar enviar. */
export const whatsappMessageHref = (text: string) =>
  `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(text)}`;

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
