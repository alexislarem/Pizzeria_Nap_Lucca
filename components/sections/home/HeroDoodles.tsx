"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { WiggleDoodle } from "@/components/ui/WiggleDoodle";
import type { DoodleName } from "@/content/doodles";
import { cn } from "@/lib/utils/cn";

/**
 * Colocación de cada dibujo (va con el diseño, no con el contenido):
 *   - móvil/tablet: los 4 primeros en las esquinas del bloque amarillo
 *   - escritorio:   6 dibujos repartidos por los laterales
 * `depth` = cuánto se desplaza con el ratón (parallax).
 */
const LAYOUT = [
  {
    rotate: -10,
    depth: 1.2,
    className: "left-[4%] top-[3%] w-20 sm:w-24 lg:left-[6%] lg:top-[9%] lg:w-28",
  },
  {
    rotate: 10,
    depth: 0.8,
    className: "right-[5%] top-[4%] w-14 sm:w-16 lg:right-[10%] lg:top-[8%] lg:w-20",
  },
  {
    rotate: 6,
    depth: 1.5,
    className:
      "right-[3%] bottom-[3%] w-24 sm:w-28 lg:right-auto lg:bottom-auto lg:left-[2%] lg:top-[40%] lg:w-40",
  },
  {
    rotate: -8,
    depth: 1,
    className:
      "left-[4%] bottom-[3%] w-20 sm:w-24 lg:left-auto lg:bottom-auto lg:right-[5%] lg:top-[34%] lg:w-28",
  },
  {
    rotate: -4,
    depth: 0.7,
    className: "hidden lg:block lg:left-[12%] lg:bottom-[7%] lg:w-36",
  },
  {
    rotate: 5,
    depth: 1.3,
    className: "hidden lg:block lg:right-[20%] lg:bottom-[7%] lg:w-24",
  },
] as const;

/**
 * Entrada "dibujada a mano": el trazo se descubre de arriba abajo (clip-path)
 * mientras el dibujo cae un poco y se asienta. Escalonado por el padre.
 */
const entryVariants: Variants = {
  // Los márgenes negativos dejan sitio a la etiqueta y al crecer en hover (si no, se recortarían).
  hidden: { clipPath: "inset(-60% -60% 100% -60%)", opacity: 0, y: -16 },
  show: {
    clipPath: "inset(-60% -60% -60% -60%)",
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
  },
};

type HeroDoodleProps = {
  name: DoodleName;
  index: number;
  rotate: number;
  depth: number;
  className: string;
  active: boolean;
  onToggle: () => void;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

function HeroDoodle({
  name,
  index,
  rotate,
  depth,
  className,
  active,
  onToggle,
  pointerX,
  pointerY,
}: HeroDoodleProps) {
  // Parallax: el ratón (de -0,5 a 0,5) se traduce en píxeles según la profundidad.
  const x = useTransform(pointerX, (v) => v * depth * 40);
  const y = useTransform(pointerY, (v) => v * depth * 30);

  return (
    <motion.div
      variants={entryVariants}
      className={cn("pointer-events-auto absolute", active && "z-20", className)}
    >
      <motion.div style={{ x, y }}>
        <WiggleDoodle
          name={name}
          rotate={rotate}
          index={index}
          active={active}
          onToggle={onToggle}
        />
      </motion.div>
    </motion.div>
  );
}

type HeroDoodlesProps = {
  names: readonly DoodleName[];
  /** Cuando pasa a `true` (intro terminada), los dibujos hacen su entrada. */
  show: boolean;
};

/**
 * Dibujos de la marca alrededor del hero (solo el trazo, sin cartel).
 * Ratón: parallax + meneo al pasar. Táctil: un toque los sacude y muestra su
 * palabra italiana; otro toque los devuelve a su sitio.
 */
export function HeroDoodles({ names, show }: HeroDoodlesProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Posición del ratón normalizada (-0,5 … 0,5), suavizada con un muelle.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 60, damping: 18 });
  const pointerY = useSpring(rawY, { stiffness: 60, damping: 18 });

  // Parallax solo con ratón (no táctil) y sin "menos movimiento".
  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, rawX, rawY]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial="hidden"
      animate={show ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
    >
      {names.map((name, i) => {
        const layout = LAYOUT[i % LAYOUT.length];
        return (
          <HeroDoodle
            key={name}
            name={name}
            index={i}
            rotate={layout.rotate}
            depth={layout.depth}
            className={layout.className}
            active={activeIndex === i}
            onToggle={() => setActiveIndex((current) => (current === i ? null : i))}
            pointerX={pointerX}
            pointerY={pointerY}
          />
        );
      })}
    </motion.div>
  );
}
