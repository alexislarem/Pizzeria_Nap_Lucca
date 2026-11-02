/**
 * Página Galería: fotos reales agrupadas por tema.
 * Originales en /design/images/web (ver INDEX.md); copias publicadas en /public/images.
 */
import { gallery, type Photo } from "@/content/home";

export const galeriaIntro = {
  eyebrow: gallery.eyebrow,
  title: gallery.title,
  subtitle: gallery.subtitle,
} as const;

/** Temas para filtrar. El orden es el de los botones. */
export const galeriaTopics = [
  { id: "mesa", label: "La mesa" },
  { id: "horno", label: "El horno" },
  { id: "ingredientes", label: "Ingredientes" },
  { id: "local", label: "El local" },
  { id: "familia", label: "Familia" },
  { id: "obra", label: "La obra" },
] as const;

export type GaleriaTopic = (typeof galeriaTopics)[number]["id"];

/** Foto de la galería. Casi todas son verticales (3:4); `landscape` marca las horizontales (4:3). */
export type GaleriaPhoto = Photo & { topic: GaleriaTopic; landscape?: boolean };

export const galeriaPhotos: GaleriaPhoto[] = [
  // La mesa
  { topic: "mesa", src: "/images/menu/la-divina.webp", alt: "Pizza La Divina con mortadela, burrata en el centro y pistacho" },
  { topic: "mesa", src: "/images/gallery/pizza-cenital.webp", alt: "Pizza napolitana con el borde moteado por el horno, vista desde arriba", landscape: true },
  { topic: "mesa", src: "/images/gallery/pizza-en-mano.webp", alt: "Pizzaiola sonriendo con una pizza recién horneada en las manos" },
  { topic: "mesa", src: "/images/menu/margherita.webp", alt: "Pizza Margherita con tomate, mozzarella y albahaca sobre la mesa" },
  { topic: "mesa", src: "/images/menu/la-burrata.webp", alt: "Burrata sobre tomates y pesto de pistacho en un plato hondo" },
  { topic: "mesa", src: "/images/gallery/cervezas-italianas.webp", alt: "Botellas de cerveza Peroni, Messina y Peroni Rossa sobre la mesa" },
  { topic: "mesa", src: "/images/gallery/postre-pistacho.webp", alt: "Postre de pistacho servido por una persona del equipo de LUCA" },
  { topic: "mesa", src: "/images/gallery/cerveza-peroni.webp", alt: "Cerveza Peroni servida en copa junto a una tabla de embutido" },

  // El horno
  { topic: "horno", src: "/images/gallery/llama-horno.webp", alt: "Llama del horno sobre el borde de una pizza que se está cociendo" },
  { topic: "horno", src: "/images/gallery/pizzaiolo-horno.webp", alt: "Pizzaiolo de espaldas frente al horno amarillo" },
  { topic: "horno", src: "/images/gallery/horno-encendido.webp", alt: "Pizza dentro del horno encendido, iluminada por la llama" },
  { topic: "horno", src: "/images/proceso/pizzas-rejilla.webp", alt: "Pizzas recién horneadas sobre la rejilla de la cocina" },
  { topic: "horno", src: "/images/gallery/pala-de-horno.webp", alt: "Miembro del equipo posando con la pala de pizza junto al horno" },
  { topic: "horno", src: "/images/gallery/tomates-asados.webp", alt: "Bandeja de tomates asándose a la entrada del horno" },
  { topic: "horno", src: "/images/gallery/pizza-en-horno.webp", alt: "Pizza dentro del horno con la llama al fondo" },

  // Ingredientes
  { topic: "ingredientes", src: "/images/gallery/salsa-tomate.webp", alt: "Cazo extendiendo salsa de tomate sobre la masa" },
  { topic: "ingredientes", src: "/images/proceso/harina.webp", alt: "Montaña de harina en un bol de acero sobre la báscula" },
  { topic: "ingredientes", src: "/images/gallery/albahaca-masa.webp", alt: "Mano colocando una hoja de albahaca sobre la pizza" },
  { topic: "ingredientes", src: "/images/gallery/tomates-cherry.webp", alt: "Tomates cherry sobre una tabla de cortar verde" },
  { topic: "ingredientes", src: "/images/proceso/bolas-de-masa.webp", alt: "Pizzaiolo sosteniendo una caja llena de bolas de masa" },
  { topic: "ingredientes", src: "/images/gallery/harina-caputo.webp", alt: "Saco de harina italiana Caputo Nuvola" },
  { topic: "ingredientes", src: "/images/proceso/albahaca.webp", alt: "Manos sujetando un manojo de albahaca fresca" },
  { topic: "ingredientes", src: "/images/gallery/harina-pizzuti.webp", alt: "Saco de harina Molino Pizzuti sobre la báscula de la cocina" },
  { topic: "ingredientes", src: "/images/gallery/pesado-masa.webp", alt: "Pesando ingredientes en la báscula junto al horno" },
  { topic: "ingredientes", src: "/images/gallery/crema.webp", alt: "Crema blanca recién batida cayendo en un bol" },

  // El local
  { topic: "local", src: "/images/local/fachada.webp", alt: "Fachada acristalada de LUCA en una esquina de Valdepeñas" },
  { topic: "local", src: "/images/gallery/banderas.webp", alt: "Banderas de Italia, España y Argentina en el local" },
  { topic: "local", src: "/images/gallery/pasillo.webp", alt: "Selfie en el pasillo amarillo del local", landscape: true },
  { topic: "local", src: "/images/gallery/fachada-equipo.webp", alt: "Miembro del equipo de LUCA posando frente a la fachada" },
  { topic: "local", src: "/images/gallery/cartas.webp", alt: "Cartas impresas de LUCA sobre el mostrador" },
  { topic: "local", src: "/images/gallery/envase-caja.webp", alt: "Envase y caja de pizza con el logo de LUCA" },
  { topic: "local", src: "/images/gallery/caja-pizza.webp", alt: "Persona sonriendo con una caja de pizza de LUCA en la calle, de noche" },

  // Familia
  { topic: "familia", src: "/images/team/familia-horno.webp", alt: "La familia de LUCA sonriendo delante del horno y del logo amarillo" },
  { topic: "familia", src: "/images/gallery/selfie-pareja.webp", alt: "Selfie de la pareja de LUCA con camisetas de la marca" },
  { topic: "familia", src: "/images/team/pizzaiolo.webp", alt: "Pizzaiolo de LUCA con delantal y pañuelo en la cocina" },
  { topic: "familia", src: "/images/gallery/bienvenida-puerta.webp", alt: "Miembro de LUCA dando la bienvenida en la puerta del local" },
  { topic: "familia", src: "/images/gallery/familia-calle.webp", alt: "La familia de LUCA haciéndose un selfie en la calle" },
  { topic: "familia", src: "/images/team/familia-sofa.webp", alt: "La familia de LUCA descansando junta en un sofá" },
  { topic: "familia", src: "/images/nosotros/pareja-delantales.webp", alt: "Selfie de la pareja de LUCA con pañuelo y camiseta de la marca" },

  // La obra
  { topic: "obra", src: "/images/historia/alquilado.webp", alt: "Cartel de «Alquilado» en el escaparate del local" },
  { topic: "obra", src: "/images/historia/obra-escalera.webp", alt: "Dos miembros de la familia sentados en la escalera del local durante la obra" },
  { topic: "obra", src: "/images/gallery/obra-familia.webp", alt: "Tres miembros de la familia posando en el local durante la reforma" },
  { topic: "obra", src: "/images/historia/material.webp", alt: "Palés de sacos de harina en la puerta del local" },
  { topic: "obra", src: "/images/gallery/obra-cuadros.webp", alt: "Niña con los brazos abiertos junto a los cuadros de frases italianas de LUCA" },
  { topic: "obra", src: "/images/historia/llegada-pale.webp", alt: "Selfie de la pareja de LUCA junto a un palé recién llegado, frente al local" },
  { topic: "obra", src: "/images/gallery/obra-placa.webp", alt: "Miembro de la familia subida a una escalera junto a la placa de la calle" },
  { topic: "obra", src: "/images/historia/obra-perro.webp", alt: "Descanso con el perro en el local todavía en obras" },
  { topic: "obra", src: "/images/historia/inauguracion.webp", alt: "Arco de globos negros, naranjas y dorados en la inauguración de LUCA" },
];
