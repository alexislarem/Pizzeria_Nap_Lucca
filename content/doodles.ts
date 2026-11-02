/**
 * Dibujos de línea de la identidad LUCA, extraídos de los carteles de
 * design/images/*.svg (solo el trazo, sin la tarjeta de color).
 * Son siluetas blancas con transparencia: el componente <Doodle> las usa como
 * máscara y las pinta con cualquier color de marca (bg-fg, bg-primary…).
 * `ratio` = ancho / alto del archivo, para reservar su hueco sin saltos.
 */

export type DoodleName =
  | "albahaca"
  | "chasquido"
  | "coctel"
  | "espaguetis"
  | "molino"
  | "pizzaAbierta"
  | "pizzaMano"
  | "raviolis"
  | "tomates";

/** `word` = palabra italiana que aparece al tocar el dibujo; `alt` = qué representa. */
export type DoodleInfo = { src: string; ratio: number; alt: string; word: string };

export const doodles: Record<DoodleName, DoodleInfo> = {
  albahaca: {
    src: "/images/dibujos/albahaca.webp",
    ratio: 516 / 640,
    alt: "Dibujo de un ramo de albahaca",
    word: "Basilico",
  },
  chasquido: {
    src: "/images/dibujos/chasquido.webp",
    ratio: 368 / 640,
    alt: "Dibujo de una mano chasqueando los dedos",
    word: "Perfetto!",
  },
  coctel: {
    src: "/images/dibujos/coctel.webp",
    ratio: 426 / 640,
    alt: "Dibujo de una mano sosteniendo una copa",
    word: "Salute!",
  },
  espaguetis: {
    src: "/images/dibujos/espaguetis.webp",
    ratio: 563 / 640,
    alt: "Dibujo de un plato de espaguetis con tenedor",
    word: "Buon appetito",
  },
  molino: {
    src: "/images/dibujos/molino.webp",
    ratio: 484 / 640,
    alt: "Dibujo de un molino con aspas de porciones de pizza",
    word: "Farina",
  },
  pizzaAbierta: {
    src: "/images/dibujos/pizza-abierta.webp",
    ratio: 632 / 640,
    alt: "Dibujo de una pizza con las porciones separadas",
    word: "Che pizza!",
  },
  pizzaMano: {
    src: "/images/dibujos/pizza-mano.webp",
    ratio: 513 / 640,
    alt: "Dibujo de una mano sosteniendo una porción de pizza",
    word: "Mamma mia",
  },
  raviolis: {
    src: "/images/dibujos/raviolis.webp",
    ratio: 278 / 640,
    alt: "Dibujo de tres raviolis",
    word: "Ravioli",
  },
  tomates: {
    src: "/images/dibujos/tomates.webp",
    ratio: 479 / 640,
    alt: "Dibujo de una rama de tomates",
    word: "Pomodori",
  },
};
