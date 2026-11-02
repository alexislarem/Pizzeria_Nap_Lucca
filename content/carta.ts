/**
 * Página Carta. Los platos y precios viven en content/menu.ts;
 * aquí solo los textos de la página y las fotos que acompañan a cada categoría.
 */
import type { DoodleName } from "@/content/doodles";
import { menuSection, type Photo } from "@/content/home";

export const cartaIntro = {
  eyebrow: menuSection.eyebrow,
  title: menuSection.title,
  subtitle: menuSection.subtitle,
  photo: {
    src: "/images/menu/margherita-estudio.webp",
    alt: "Pizza Margherita con mozzarella y hojas de albahaca sobre una mesa de mármol blanco",
  },
  // Dibujos que flotan alrededor del título y se sacuden al tocarlos.
  doodles: ["albahaca", "tomates", "pizzaAbierta"] satisfies DoodleName[],
} as const;

/**
 * Pizza destacada al principio de "Le nostre pizze" (es la única con foto propia).
 * TODO: confirmar con el cliente qué pizza destacar y el texto.
 */
export const cartaFeatured = {
  dish: "La Divina",
  eyebrow: "Mamma mia",
  label: "Destacada",
  photo: {
    src: "/images/menu/la-divina.webp",
    alt: "Pizza La Divina con mortadela, burrata en el centro y pistacho",
  },
  cta: { label: "Reservar mesa", href: "/reservar" },
} as const;

/** Dibujo que se "sella" en los tickets de cada categoría al tocarlos (y que acompaña a su título). */
export const cartaDoodles: Record<string, DoodleName> = {
  pizze: "pizzaAbierta",
  apertura: "tomates",
  dolci: "chasquido",
  bevande: "coctel",
};

/** Categorías cuyos platos muestran los ingredientes como etiquetas (en el resto, la descripción es prosa). */
export const cartaChipCategories = ["pizze"];

/**
 * Fotos por id de categoría (content/menu.ts). Una categoría sin foto se pinta a ancho completo.
 * Las pizzas no llevan foto lateral: su foto es la de la pizza destacada (cartaFeatured).
 */
export const cartaPhotos: Record<string, Photo> = {
  apertura: {
    src: "/images/menu/la-burrata.webp",
    alt: "Burrata sobre tomates y pesto de pistacho en un plato hondo",
  },
  dolci: {
    src: "/images/gallery/postre-pistacho.webp",
    alt: "Postre de pistacho servido por una persona del equipo de LUCA",
  },
};
