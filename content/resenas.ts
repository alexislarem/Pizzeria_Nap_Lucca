/**
 * Página Reseñas (sustituye a Foodtrucks). Textos, fuentes y reseñas del panel.
 * Fuente de las reseñas: /design/resenas.md (copiadas de Google Maps por el cliente).
 * Para añadir una: copiarla allí y aquí, con el mismo formato.
 */
import type { DoodleName } from "@/content/doodles";
import type { Photo } from "@/content/home";
import { pages } from "@/content/pages";
import { instagramHandle, mapsHref } from "@/lib/utils/contact";
import { siteConfig } from "@/site.config";

/** google/instagram = copiadas a mano aquí; web = enviadas con el formulario y aprobadas por email. */
export type ReviewSource = "google" | "instagram" | "web";

export type Review = {
  id: string;
  author: string;
  source: ReviewSource;
  /** 1–5. Instagram no tiene estrellas: se omite. */
  rating?: number;
  /** Mes de la reseña (Google da fechas relativas, "hace un mes": se fijan al copiarlas). */
  date: string;
  text: string;
  /** Respuesta del restaurante en Google, si la hay. */
  reply?: string;
  /** "Me gusta" de partida en la web. */
  likes: number;
  /** Fotos del autor (solo reseñas de la web, alojadas en Vercel Blob). */
  photos?: Photo[];
};

export const reviewSources: Record<
  ReviewSource,
  { label: string; tooltip: string; href: string; cta: string }
> = {
  google: {
    label: "Google Maps",
    tooltip: "Reseña publicada en Google Maps",
    // Ficha del local en Google Maps (site.config.ts → contact.mapUrl).
    href: mapsHref,
    cta: "Ver en Google Maps",
  },
  instagram: {
    label: "Instagram",
    tooltip: `Comentario en ${instagramHandle}`,
    href: siteConfig.social.instagram,
    cta: `Seguir a ${instagramHandle}`,
  },
  web: {
    label: "Web de LUCA",
    tooltip: "Reseña enviada desde esta web",
    href: "#escribir",
    cta: "Escribir una reseña",
  },
};

export const resenasPage = {
  eyebrow: "Grazie mille",
  title: pages.resenas.title,
  // TODO: confirmar copy con el cliente.
  intro:
    "Lo que nos decís en Google Maps, en Instagram y aquí mismo. Cada palabra nos ayuda a seguir amasando con cariño.",
  writeCta: { label: "Escribir una reseña", href: "#escribir" },
  doodles: ["pizzaMano", "coctel", "raviolis"] satisfies DoodleName[],
} as const;

export const resenasWall = {
  eyebrow: "Mamma mia",
  title: "La mesa opina",
  // Cada reseña se pinta como una comanda (ticket de pedido) numerada.
  ticketLabel: "Comanda",
  replyLabel: "Risposta di LUCA",
  likeLabel: "Me gusta",
  pause: "Pausar reseñas",
  play: "Mover reseñas",
  more: "Leer todas en Google Maps",
  instagram: {
    title: "¿Nos has etiquetado?",
    text: `Sube tu foto con ${instagramHandle} y puede acabar aquí.`,
  },
} as const;

/**
 * Reseñas reales de Google Maps (design/resenas.md). Fechas copiadas el
 * 2026-11-02 y pasadas a mes ("hace un mes" → octubre 2026).
 * TODO: B.I.N no indica estrellas en lo copiado; confirmar y añadir `rating`.
 */
export const reviews: Review[] = [
  {
    id: "sonia-del-fresno",
    author: "Sonia Del Fresno",
    source: "google",
    rating: 5,
    date: "Octubre 2026",
    // TODO: el texto de Google estaba recortado ("… Más"); copiar el final si lo hay.
    text: "Local super bonito, se puede ver cómo preparan las pizzas ya que el mega horno lo tienen visible desde el salón. Todo limpio, muy espacioso, buena atención y las pizzas espectaculares. Las sirven rápido y la masa está super rica. Sin duda volveremos y, poco a poco, iremos probando todas las pizzas que ofrecen en la carta. 🤌🏻",
    reply:
      "¡Hola, Sonia! Muchísimas gracias por tu reseña y por tus 5 estrellas. Nos alegra un montón saber que disfrutaste tanto de la masa de nuestras pizzas, de la rapidez del servicio y de poder ver el proceso en nuestro horno. Será un verdadero placer recibirte de nuevo para que sigas descubriendo el resto de la carta. ¡Aquí te esperamos con los brazos abiertos!",
    likes: 0,
  },
  {
    id: "paula-orellana",
    author: "Paula Orellana",
    source: "google",
    rating: 5,
    date: "Octubre 2026",
    text: "El sitio es muy bonito y acogedor. Hemos pedido la pizza de Luca y la de Tonno y las dos estaban buenísimas. De postre tiramisú y nos ha encantado. Además la camarera ha sido muy simpática y amable. Repetiremos ❤️",
    likes: 0,
  },
  {
    id: "bin",
    author: "B.I.N",
    source: "google",
    date: "Septiembre 2026",
    text: "Hemos probado dos pizzas y puedo decir que están a la altura de las mejores pizzerías. Los ingredientes son de primera calidad y 100% Italianos. Pero con la masa... se han pasado el juego. El borde es una nube, literalmente.",
    likes: 0,
  },
  {
    id: "salesianos-puertollano",
    author: "Dirección Secundaria-Bachillerato Salesianos Puertollano",
    source: "google",
    rating: 5,
    date: "Octubre 2026",
    text: "¡Una experiencia genial en Pizzería Luca! 🍕 Todo estaba buenísimo: las pizzas, con una masa y unos ingredientes espectaculares, y el postre, que fue el broche perfecto. Además, el local está muy limpio y cuidado y el ambiente es muy agradable. Sin duda, un sitio que merece la pena visitar. ¡Repetiremos! 👌🍕",
    likes: 0,
  },
  {
    id: "loli-lopez",
    author: "Loli Lopez",
    source: "google",
    rating: 5,
    date: "Septiembre 2026",
    text: "Nuestra experiencia fue de 10, trato magnífico, se preocupan mucho y te preguntan qué tal va todo. La comida increíble, unos sabores alucinantes 😋. Lo recomiendo totalmente y nosotros volveremos muy pronto.",
    likes: 0,
  },
  {
    id: "luis-vazquez",
    author: "Luis Vazquez",
    source: "google",
    rating: 5,
    date: "Octubre 2026",
    text: "Una experiencia excelente de principio a fin. Las pizzas están buenísimas, con ingredientes de calidad, una masa espectacular y un sabor auténticamente italiano. 🍕🇮🇹 El trato del personal es cercano, amable y profesional, y el ambiente hace que te sientas muy a gusto. Se nota que cuidan cada detalle y que trabajan con ganas. Sin duda, un sitio totalmente recomendable para disfrutar de una buena pizza en Valdepeñas. Repetiremos seguro. ¡Enhorabuena al equipo! 👏",
    likes: 0,
  },
  {
    id: "violeta-rc",
    author: "Violeta R.C",
    source: "google",
    rating: 5,
    date: "Septiembre 2026",
    text: "Estuvimos cenando y salimos encantados, la comida estupenda y el trato excepcional. Una muy buena opción gastronómica en Valdepeñas, seguro que les va fenomenal! Sin duda repetiremos!",
    reply:
      "Muchas gracias por todo, Violeta, ha sido un placer tu visita y servirte y esperamos que vuelvas pronto. Dios te bendiga.",
    likes: 0,
  },
];

/** Formulario "Cuéntanos tu visita" (lib/validations/resena.ts). */
export const resenaForm = {
  eyebrow: "Per favore",
  title: "Cuéntanos tu visita",
  subtitle:
    "Tu reseña y tus fotos nos llegan por email y las publicamos aquí después de leerlas.",
  reviewTooltip: "Leemos cada reseña antes de publicarla. Tu email no se publica.",
  labels: {
    rating: "¿Qué tal estuvo?",
    name: "Nombre",
    email: "Email",
    message: "Tu reseña",
    photos: "Fotos",
  },
  ratingWords: ["Flojo", "Normal", "Buena", "Muy buena", "Perfetto!"],
  emailHint: "Solo para avisarte cuando se publique.",
  messagePlaceholder: "¿Qué pizza pediste? ¿Cómo fue el trato?",
  photos: {
    add: "Añadir fotos",
    hint: "Hasta 3 fotos. Las reducimos antes de enviarlas.",
    tooltip: "Tus fotos de la pizza o del local. Solo se publican si las aprobamos.",
    remove: "Quitar foto",
    error: "No hemos podido leer esa foto. Prueba con otra.",
  },
  consent:
    "Acepto que LUCA revise y publique en esta web mi reseña, mi nombre y mis fotos.",
  slide: "Desliza para enviar",
  sending: "Enviando…",
  success: {
    title: "¡Grazie mille!",
    text: "Hemos recibido tu reseña. La leeremos con calma y, cuando esté publicada, te avisaremos por email.",
    again: "Escribir otra reseña",
  },
} as const;

/**
 * Página privada /resenas/moderar: se abre desde los botones del email "Reseña por revisar".
 * Solo funciona con el enlace firmado del correo (no sale en el menú ni en Google).
 */
export const resenaModeracion = {
  metaTitle: "Revisar reseña",
  eyebrow: "Solo para LUCA",
  title: "Revisar reseña",
  intro: "Esto es lo que se publicará en la web: puntuación, nombre, texto y fotos. El email nunca se muestra.",
  question: "¿La publicamos?",
  publish: "Publicar reseña",
  reject: "Rechazar y borrar",
  working: "Un momento…",
  alreadyPublished: "Esta reseña ya está publicada en la web.",
  rejectHint: "Si la rechazas, se borra con sus fotos y no se avisa al autor.",
  photosLabel: "Fotos",
  emailLabel: "Email (privado)",
  done: {
    published: {
      title: "¡Publicada!",
      text: "Ya aparece en la barra de comandas de Reseñas y hemos enviado un email de agradecimiento a su autor.",
      cta: "Ver en la web",
    },
    rejected: {
      title: "Reseña rechazada",
      text: "Se ha borrado junto con sus fotos. No se ha avisado al autor.",
      cta: "Ir a Reseñas",
    },
  },
  errors: {
    badLink: "Este enlace no es válido o ha caducado (duran 30 días). Si la reseña era reciente, busca el email más nuevo.",
    gone: "Esta reseña ya no existe: se rechazó antes o caducó a los 30 días.",
    busy: "Esta reseña se está procesando ahora mismo. Espera unos segundos y recarga la página.",
    unavailable: "La revisión de reseñas no está disponible ahora mismo (faltan claves del servidor). Avisa a quien mantiene la web.",
    generic: "Algo ha fallado. Inténtalo otra vez en un minuto.",
  },
} as const;
