/**
 * Textos de la home. Fuente: /design/content.md.
 * TODO: copy final del Hero pendiente de confirmar con el cliente (content.md).
 */

import type { DoodleName } from "./doodles";

export const hero = {
  eyebrow: "Ciao bella",
  subtitle: "Pizza Napoletana",
  tagline: "De nuestra familia a la vuestra",
  primaryCta: { label: "Ver nuestra carta", href: "/carta" },
  secondaryCta: { label: "Reservar mesa", href: "/reservar" },
} as const;

export const about = {
  title: "El alma de LUCA",
  eyebrow: "Nosotros",
  paragraphs: [
    "LUCA no nació solo de un horno y un puñado de harina; nació de una promesa y del camino que Dios ha trazado para nuestra familia. Para nosotros, este proyecto es el testimonio vivo de que, con fe, los sueños se amasan con paciencia y se hornean con propósito.",
    "Creemos que la cocina es una forma de bendecir a los demás. Por eso, cada pizza que sale de nuestro horno no es solo alimento; es el resultado de un proceso artesano de 72 horas de fermentación, respetando los tiempos naturales, tal como aprendimos a respetar los tiempos de Cristo en nuestras vidas.",
    "Este restaurante es nuestra forma de dar gracias. Gracias por la unidad de nuestra familia, por la fuerza para emprender y por la oportunidad de recibiros en nuestra casa. Queremos que, al sentaros a nuestra mesa, no solo disfrutéis de una pizza excepcional, sino que sintáis el amor y la gratitud que ponemos en cada detalle.",
  ],
  closing: [
    "De nuestra familia a la vuestra, bienvenidos a LUCA.",
    "Que Dios bendiga vuestra mesa.",
  ],
  stat: { value: "72 h", label: "de fermentación natural en cada masa" },
  highlights: [
    "Proceso artesano",
    "Ingredientes italianos DOP/IGP",
    "De nuestra familia a la vuestra",
  ],
} as const;

export const menuSection = {
  title: "La nostra carta",
  eyebrow: "Buon appetito",
  subtitle: "Cada pizza, una historia",
} as const;

/** Textos de la galería (las fotos de la página están en content/galeria.ts). */
export const gallery = {
  title: "Galleria",
  eyebrow: "Mamma mia",
  subtitle: "Momentos que saben a Italia",
} as const;

export const contactSection = {
  title: "Reserva tu mesa",
  eyebrow: "Per favore",
  subtitle: "Ti aspettiamo",
} as const;

/* ─── Página de Inicio ──────────────────────────────────────────────────────
   El Inicio tiene identidad propia: no repite textos ni fotos de Nosotros,
   Carta o Galería (esas pestañas cuentan su parte completa).
   Orden: Hero → Franja → Familia → Proceso (pizza que gira) → Carta (ScrollExpand)
   → Marca (carrusel circular) → Reserva.
   Fotos de inspiración (moodboard de Cosmos, aportadas por el usuario) en
   /public/images/inspiracion; fotos reales de LUCA en el resto de carpetas.
   ─────────────────────────────────────────────────────────────────────────── */

/** Foto con su texto alternativo (obligatorio para accesibilidad). */
export type Photo = { src: string; alt: string };

/** Foto que puede llevar un vídeo corto (Live Photo, sin audio); `src` hace de póster. */
export type Media = Photo & { video?: string };

/** Intro de entrada (telón amarillo con el logo animado). */
export const homeIntro = {
  subtitle: hero.subtitle,
  footnote: "Valdepeñas · Ciudad Real",
} as const;

/**
 * Hero: bloque amarillo con LUCA en grande y, alrededor, SOLO los dibujos de
 * línea de los carteles (content/doodles.ts), en tinta negra. Su colocación
 * está en components/sections/home/HeroDoodles.tsx.
 */
export const homeHero = {
  eyebrow: hero.eyebrow,
  subtitle: hero.subtitle,
  tagline: hero.tagline,
  primaryCta: hero.primaryCta,
  secondaryCta: hero.secondaryCta,
  // Orden = orden de entrada. Los 4 primeros se ven también en móvil.
  doodles: [
    "albahaca",
    "chasquido",
    "pizzaAbierta",
    "tomates",
    "espaguetis",
    "molino",
  ] satisfies DoodleName[],
  // Texto que gira en el sello circular (enlace a reservar).
  seal: {
    text: "Reserva tu mesa · Reserva tu mesa · ",
    label: "Reservar mesa",
    href: hero.secondaryCta.href,
  },
} as const;

/** Franja animada con las expresiones de marca (content.md). */
export const homeStrip = [
  "Ciao bella",
  "Che pizza",
  "Buon appetito",
  "Mamma mia",
  "Tutto passa",
  "Grazie mille",
] as const;

/** Dibujos que separan las frases de la franja (en el mismo orden). */
export const homeStripDoodles = [
  "tomates",
  "pizzaAbierta",
  "espaguetis",
  "chasquido",
  "coctel",
  "albahaca",
] as const satisfies readonly DoodleName[];

/**
 * Familia (resumen breve). La historia completa vive en /nosotros, así que aquí
 * van un texto propio y fotos/vídeos que NO aparecen en esa página.
 */
export const homeAbout = {
  eyebrow: "Grazie mille",
  // TODO: confirmar copy con el cliente ("hecha en familia" viene del borrador Home v2 de Figma).
  title: "Hecha en familia",
  // El título se escribe solo y va proponiendo estos datos (documentados en content.md / proceso).
  completions: ["Masa de 72 horas", "Harina italiana", "En Valdepeñas"],
  // TODO: confirmar copy con el cliente.
  excerpt:
    "Una familia, un horno y una promesa: así empezó LUCA. De una obra en Valdepeñas a vuestra mesa, cada pizza se hace sin prisa.",
  cta: { label: "Conoce nuestra historia", href: "/nosotros" },
  // Galería en profundidad. Los vídeos son las Live Photos de design/images/web (2–3 s, sin audio).
  // TODO: revisar los `alt` de personas con el cliente (pendiente #9).
  media: [
    {
      src: "/images/gallery/fachada-equipo.webp",
      alt: "Miembro del equipo de LUCA posando frente a la fachada",
    },
    {
      src: "/images/nosotros/escalera-obra.webp",
      alt: "Dos mujeres de la familia LUCA sentadas en los escalones del local en obras",
    },
    {
      src: "/images/nosotros/cajas-poster.webp",
      alt: "Miembro de la familia en la cocina con un carro lleno de cajas de masa",
      video: "/videos/nosotros/cajas.mp4",
    },
    {
      src: "/images/nosotros/selfie-delantal.webp",
      alt: "Selfie de la pareja de LUCA con el delantal de la marca",
    },
    {
      src: "/images/nosotros/obra-familia-poster.webp",
      alt: "Tres miembros de la familia posando en el local durante la reforma",
      video: "/videos/nosotros/obra-familia.mp4",
    },
    {
      src: "/images/gallery/pizzaiolo-horno.webp",
      alt: "Pizzaiolo de espaldas frente al horno amarillo",
    },
    {
      src: "/images/nosotros/pasillo-poster.webp",
      alt: "Selfie en el pasillo amarillo del local",
      video: "/videos/nosotros/pasillo.mp4",
    },
    {
      src: "/images/nosotros/placa-calle-poster.webp",
      alt: "Miembro de la familia subida a una escalera junto a la placa de la calle, durante la obra",
      video: "/videos/nosotros/placa-calle.mp4",
    },
    {
      src: "/images/gallery/pala-de-horno.webp",
      alt: "Miembro del equipo posando con la pala de pizza junto al horno",
    },
    {
      src: "/images/gallery/bienvenida-puerta.webp",
      alt: "Miembro de LUCA dando la bienvenida en la puerta del local",
    },
  ] satisfies Media[],
} as const;

/** Paso del proceso; `doodle` = dibujo que se "sella" en el ticket al tocarlo. */
export type ProcessStep = { title: string; text: string; doodle: DoodleName };

/** Proceso: 4 pasos en tickets alrededor de una pizza que gira con el scroll. */
export const homeProcess = {
  eyebrow: "Che pizza",
  title: "Del saco al horno",
  // TODO: confirmar textos de cada paso con el cliente (solo se usan datos ya documentados).
  steps: [
    {
      title: "Harina italiana",
      text: "Seleccionamos harinas italianas para una masa ligera.",
      doodle: "molino",
    },
    {
      title: "72 h de fermentación",
      text: "Respetamos los tiempos naturales de la masa.",
      doodle: "chasquido",
    },
    {
      title: "Ingredientes DOP/IGP",
      text: "Producto italiano y albahaca fresca en cada pizza.",
      doodle: "albahaca",
    },
    {
      title: "Al horno",
      text: "Cada pizza sale al momento, con su cornicione inflado.",
      doodle: "pizzaAbierta",
    },
  ] satisfies ProcessStep[],
  // Recorte con fondo transparente (design/images/cosmos/PIZZA DISEÑO.svg).
  pizza: {
    src: "/images/home/pizza-giratoria.webp",
    alt: "Pizza Margherita con mozzarella y hojas de albahaca, vista desde arriba",
  },
  // Texto que gira alrededor de la pizza (expresiones y datos de marca).
  ring: "Pizza napoletana · Masa de 72 horas · Hecha en familia · Buon appetito · ",
} as const;

/** Carta en Inicio: solo una portada; los platos y sus textos viven en /carta. */
export const homeMenu = {
  eyebrow: "Buon appetito",
  title: "Pizza napoletana",
  // TODO: confirmar copy con el cliente.
  subtitle: "De nuestro horno a vuestra mesa",
  cta: { label: "Ver la carta", href: "/carta" },
  // Foto de cabecera que se abre a pantalla completa con el scroll (ScrollExpand).
  cover: {
    src: "/images/menu/pizza-embutido-burrata.webp",
    alt: "Pizza napolitana vista desde arriba con embutido, burrata y albahaca sobre una superficie de metal oxidado",
  },
} as const;

export type BrandItem = Photo & { title: string; subtitle: string };

/**
 * Marca: carrusel circular con los carteles de la identidad visual
 * (design/images/*.svg → /images/marca) alternados con fotos de inspiración.
 * TODO: sustituir o combinar con el vídeo de marca (Figma + Framer) cuando esté listo.
 */
export const homeBrand = {
  eyebrow: "Mamma mia",
  // TODO: confirmar copy con el cliente.
  title: "Así se ve LUCA",
  subtitle: "Nuestros carteles y la Italia que nos inspira.",
  items: [
    {
      src: "/images/marca/logo-amarillo.webp",
      alt: "Cartel amarillo con el logotipo LUCA Pizza Napoletana",
      title: "LUCA",
      subtitle: "Logotipo",
    },
    {
      src: "/images/inspiracion/porcion-queso.webp",
      alt: "Mano levantando una porción de pizza con el queso fundido estirándose",
      title: "Che pizza",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/albahaca.webp",
      alt: "Ilustración de un ramo de albahaca sobre fondo verde",
      title: "Basilico",
      subtitle: "Ramo de albahaca",
    },
    {
      src: "/images/inspiracion/pizza-cherry.webp",
      alt: "Pizza napolitana con tomates cherry asados y mozzarella",
      title: "Buon appetito",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/tomates.webp",
      alt: "Ilustración de una mata de tomates sobre fondo rojo",
      title: "Pomodori",
      subtitle: "Mata de tomates",
    },
    {
      src: "/images/inspiracion/ingredientes.webp",
      alt: "Mozzarella, albahaca y salami cayendo sobre una pizza",
      title: "Mamma mia",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/ravioli.webp",
      alt: "Ilustración de tres raviolis amarillos sobre fondo crema",
      title: "Ravioli",
      subtitle: "Raviolis",
    },
    {
      src: "/images/inspiracion/pizza-aperitivo.webp",
      alt: "Pizza con jamón compartida en una mesa con un aperitivo",
      title: "Ciao bella",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/mano-perfetto.webp",
      alt: "Ilustración de la mano del gesto italiano sobre fondo amarillo",
      title: "Perfetto",
      subtitle: "Mano perfetto",
    },
    {
      src: "/images/inspiracion/pizza-bresaola.webp",
      alt: "Pizza con rúcula y bresaola sobre una mesa de madera",
      title: "Grazie mille",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/pizza-abierta.webp",
      alt: "Ilustración de una pizza con porciones separadas sobre fondo verde",
      title: "Pizza",
      subtitle: "Pizza abierta",
    },
    {
      src: "/images/inspiracion/porcion.webp",
      alt: "Mano cogiendo una porción de pizza con salami",
      title: "Tutto passa",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/mano-pizza.webp",
      alt: "Ilustración de una mano sosteniendo una porción de pizza sobre fondo rojo",
      title: "Una porzione",
      subtitle: "Mano con pizza",
    },
    {
      src: "/images/inspiracion/pizza-vino.webp",
      alt: "Pizza blanca sobre tabla de madera junto a una botella y una copa de vino",
      title: "Buonasera",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/molino.webp",
      alt: "Ilustración de un molino con aspas de porciones de pizza",
      title: "Mulino",
      subtitle: "Molino de pizza",
    },
    {
      src: "/images/inspiracion/margherita-terrazo.webp",
      alt: "Pizza Margherita con albahaca sobre una mesa de terrazo",
      title: "Margherita",
      subtitle: "Inspiración",
    },
    {
      src: "/images/marca/coctel.webp",
      alt: "Ilustración de una mano con una copa de cóctel sobre fondo verde",
      title: "Aperitivo",
      subtitle: "Mano con copa",
    },
    {
      src: "/images/marca/buon-appetito.webp",
      alt: "Ilustración de un plato de espaguetis con el texto Buon appetito",
      title: "Spaghetti",
      subtitle: "Buon appetito",
    },
  ] satisfies BrandItem[],
} as const;

/** Cierre de reserva (se reutiliza en Inicio, Carta y Galería). */
export const homeReserve = {
  eyebrow: "Per favore",
  // TODO: confirmar copy con el cliente.
  title: "Te guardamos la mesa",
  subtitle: "Llámanos, escríbenos o resérvala en un minuto.",
  cta: { label: "Reservar mesa", href: "/reservar" },
  photo: {
    src: "/images/home/mesa-margherita.webp",
    alt: "Pizza Margherita servida en una mesa de restaurante junto a un vaso de agua",
  },
} as const;
