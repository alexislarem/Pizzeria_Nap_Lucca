"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { LOGO_LETTERS, VIEWBOX } from "@/components/ui/LucaLogo";
import { cn } from "@/lib/utils/cn";

type LucaWordmarkProps = {
  /** Cuando pasa a `true`, las letras suben desde abajo, una tras otra. */
  show: boolean;
  className?: string;
};

/* En unidades del SVG (el wordmark mide 450 de alto). */
/** Capa externa: entrada desde abajo. Es también la zona de hover, que no salta. */
const entryVariants: Variants = {
  hidden: { y: 470 },
  show: (i: number) => ({
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.15 + i * 0.07 },
  }),
};

/** Capa interna: solo el trazo salta, así el puntero no pierde la zona y no tiembla. */
const jumpVariants: Variants = {
  hidden: { y: 0 },
  show: { y: 0 },
  jump: { y: -90 },
};

/**
 * Wordmark LUCA interactivo: cada letra salta al pasar el ratón o al tocarla.
 * Solo se desplaza en vertical (regla de marca: no deformar ni rotar el logo).
 * Es decorativo (aria-hidden): el texto accesible lo pone el <h1> que lo envuelve.
 */
export function LucaWordmark({ show, className }: LucaWordmarkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox={VIEWBOX.wordmark}
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={cn("h-auto w-full overflow-visible", className)}
    >
      <defs>
        {/* Máscara para la entrada: tapa lo que queda por debajo de la base, no por encima (el salto). */}
        <clipPath id="wordmark-clip">
          <rect x="280" y="900" width="1150" height="1060" />
        </clipPath>
      </defs>
      <g clipPath="url(#wordmark-clip)">
        {LOGO_LETTERS.map((letter, i) => (
          <motion.g
            key={letter.id}
            custom={i}
            variants={entryVariants}
            // `initial` fijo para que servidor y navegador pinten igual (hidratación);
            // con "menos movimiento", <MotionConfig reducedMotion="user"> hace el salto instantáneo.
            initial="hidden"
            animate={show || reduceMotion ? "show" : "hidden"}
            whileHover={reduceMotion ? undefined : "jump"}
            whileTap={reduceMotion ? undefined : "jump"}
          >
            {/* Zona de hover = caja completa de la letra (no solo el trazo). */}
            <rect
              x={letter.x}
              y={1505}
              width={letter.width}
              height={450}
              fill="transparent"
            />
            <motion.path
              d={letter.d}
              fillRule="evenodd"
              variants={jumpVariants}
              transition={{ type: "spring", stiffness: 420, damping: 14 }}
            />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
