/**
 * Páginas Contacto y Reservar. Los datos (teléfono, email, dirección) viven en site.config.ts;
 * aquí solo los textos de cada página y sus fotos.
 */
import { contactSection } from "@/content/home";
import { pages } from "@/content/pages";

export const contactoPage = {
  eyebrow: contactSection.eyebrow,
  title: pages.contacto.title,
  subtitle: contactSection.subtitle,
  photo: { src: "/images/local/fachada.webp", alt: "Fachada acristalada de LUCA en una esquina de Valdepeñas" },
  detail: { src: "/images/gallery/banderas.webp", alt: "Banderas de Italia, España y Argentina en el local" },
  cta: { label: "Reservar mesa", href: "/reservar" },
} as const;

export const reservarPage = {
  eyebrow: pages.reservar.eyebrow,
  title: pages.reservar.title,
  intro: pages.reservar.intro,
  photo: { src: "/images/team/familia-horno.webp", alt: "La familia de LUCA sonriendo delante del horno y del logo amarillo" },
  /** Alternativas al formulario, junto a la foto. */
  options: {
    title: "¿Prefieres llamar?",
    phone: { title: "Llámanos" },
    email: { title: "Escríbenos" },
  },
} as const;

/** Textos del formulario de reserva (los campos se validan en lib/validations/reserva.ts). */
export const reservaForm = {
  title: "Tu reserva",
  labels: {
    name: "Nombre",
    phone: "Teléfono",
    email: "Email",
    date: "Día",
    time: "Hora",
    guests: "Personas",
    notes: "Comentarios",
  },
  // MAX_GUESTS (lib/validations/reserva.ts) fija el tope del desplegable.
  guestsHint: "Para grupos más grandes, llámanos.",
  notesPlaceholder: "Alergias, trona para bebé, celebraciones…",
  submit: "Solicitar reserva",
  sending: "Enviando…",
  success: {
    title: "¡Grazie mille!",
    text: "Hemos recibido tu solicitud. Te confirmaremos la mesa lo antes posible.",
    again: "Hacer otra reserva",
  },
} as const;

/** Textos del formulario de Contacto (lib/validations/contacto.ts). */
export const contactoForm = {
  eyebrow: "Ciao bella",
  title: "Escríbenos",
  subtitle: "Dudas, eventos, foodtrucks o lo que quieras contarnos.",
  labels: { name: "Nombre", email: "Email", phone: "Teléfono", message: "Mensaje" },
  submit: "Enviar mensaje",
  sending: "Enviando…",
  success: {
    title: "¡Grazie mille!",
    text: "Hemos recibido tu mensaje. Te responderemos lo antes posible.",
    again: "Enviar otro mensaje",
  },
} as const;

/** Mapa de Contacto (la dirección viene de site.config.ts). */
export const contactoMap = {
  title: "Dónde estamos",
  eyebrow: "Ti aspettiamo",
  iframeTitle: "Mapa de Google Maps con la ubicación de LUCA en Valdepeñas",
  cta: "Cómo llegar",
} as const;
