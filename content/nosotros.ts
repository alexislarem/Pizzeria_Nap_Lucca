/**
 * Página Nosotros. Textos de /design/content.md ("El alma de LUCA");
 * fotos reales en /public/images y Live Photos en /public/videos (sin audio).
 * No repite fotos del Inicio (DepthGallery) ni de otras secciones de esta página.
 */
import { about, type Media, type Photo } from "@/content/home";

export const nosotrosIntro = {
  eyebrow: about.eyebrow,
  /** Una línea por frase: cada una sube por separado. */
  title: ["El alma", "de LUCA"],
  lead: about.closing[0],
  photo: {
    src: "/images/nosotros/pareja-fachada.webp",
    alt: "La pareja de LUCA abrazada delante de la fachada del restaurante",
  },
  detail: {
    src: "/images/nosotros/pareja-delantales.webp",
    alt: "Selfie de la pareja de LUCA con pañuelo y camiseta de la marca",
  },
} as const;

/**
 * Historia: cada párrafo se ilumina palabra a palabra al hacer scroll y cambia la foto fija.
 * `keywords` = palabras que quedan subrayadas en amarillo (sin tildes ni signos no importa:
 * se comparan en minúsculas y sin puntuación).
 */
export const nosotrosStory = {
  title: "Nuestra historia",
  keywords: ["promesa", "fe", "72", "horas", "artesano", "familia", "gracias"],
  chapters: [
    {
      label: "La promesa",
      text: about.paragraphs[0],
      photo: {
        src: "/images/historia/pareja-obra.webp",
        alt: "La pareja de LUCA sonriendo en el local todavía en obras",
      },
    },
    {
      label: "El oficio",
      text: about.paragraphs[1],
      photo: {
        src: "/images/team/pizzaiolo.webp",
        alt: "Pizzaiolo de LUCA con delantal y pañuelo en la cocina",
      },
    },
    {
      label: "La gratitud",
      text: about.paragraphs[2],
      photo: {
        src: "/images/team/familia-sofa.webp",
        alt: "La familia de LUCA descansando junta en un sofá",
      },
    },
  ] satisfies { label: string; text: string; photo: Photo }[],
} as const;

export type ValueCard = { title: string; text: string; poster: Photo };

/** Valores: contador de las 72 h + tarjetas que se dan la vuelta (cartel de marca ⇄ texto). */
export const nosotrosValues = {
  eyebrow: "Che pizza",
  title: "Lo que nos define",
  stat: { value: 72, unit: "h", label: about.stat.label },
  // TODO: confirmar con el cliente el texto del reverso de cada tarjeta (sale de content.md).
  cards: [
    {
      title: about.highlights[0],
      text: "Masa con 72 horas de fermentación natural, respetando los tiempos de cada masa.",
      poster: {
        src: "/images/marca/mano-pizza.webp",
        alt: "Ilustración de una mano sosteniendo una porción de pizza sobre fondo rojo",
      },
    },
    {
      title: about.highlights[1],
      text: "Harinas italianas, producto DOP/IGP y albahaca fresca en cada pizza.",
      poster: {
        src: "/images/marca/albahaca.webp",
        alt: "Ilustración de un ramo de albahaca sobre fondo verde",
      },
    },
    {
      title: about.highlights[2],
      text: "Os recibimos en nuestra casa, con el amor y la gratitud que ponemos en cada detalle.",
      poster: {
        src: "/images/marca/logo-rojo.webp",
        alt: "Cartel rojo con el gesto de la mano y el logotipo LUCA",
      },
    },
  ] satisfies ValueCard[],
} as const;

/**
 * Así nació LUCA: cronología de la obra en scroll horizontal. Los pasos con `video`
 * son Live Photos que se reproducen al pasar el ratón o al tocar; `src` es su póster.
 */
export const nosotrosBuild = {
  eyebrow: "Tutto passa",
  title: "Así nació LUCA",
  subtitle: "De un local vacío a vuestra mesa.",
  // TODO: confirmar pies de foto (y fechas, si las hay) con el cliente.
  steps: [
    {
      caption: "Encontramos el local",
      src: "/images/historia/alquilado-poster.webp",
      video: "/videos/historia/alquilado.mp4",
      alt: "Miembro de la familia posando bajo el cartel de «Alquilado» del local",
    },
    {
      caption: "Empieza la obra",
      src: "/images/historia/obra-perro.webp",
      alt: "Descanso con el perro en el local todavía en obras",
    },
    {
      caption: "Llega el material",
      src: "/images/historia/material-poster.webp",
      video: "/videos/historia/material.mp4",
      alt: "Miembro de la familia junto a los palés de sacos de harina recién llegados",
    },
    {
      caption: "Montamos la cocina",
      src: "/images/historia/estanterias.webp",
      video: "/videos/nosotros/estanterias.mp4",
      alt: "Montaje de las estanterías metálicas del almacén",
    },
    {
      caption: "Los carteles de la casa",
      src: "/images/historia/carteles.webp",
      alt: "Miembro de la familia con los brazos abiertos junto a los carteles de LUCA apoyados en la pared",
    },
    {
      caption: "¡Abrimos!",
      src: "/images/historia/inauguracion-poster.webp",
      video: "/videos/historia/inauguracion.mp4",
      alt: "Arco de globos negros, naranjas y dorados en la inauguración del local",
    },
  ] satisfies (Media & { caption: string })[],
} as const;

export const nosotrosClosing = {
  lead: about.closing[0],
  blessing: about.closing[1],
  primaryCta: { label: "Ver nuestra carta", href: "/carta" },
  secondaryCta: { label: "Reservar mesa", href: "/reservar" },
  photo: {
    src: "/images/team/bienvenida.webp",
    alt: "Miembro del equipo de LUCA con los brazos abiertos dando la bienvenida en el local",
  },
} as const;
