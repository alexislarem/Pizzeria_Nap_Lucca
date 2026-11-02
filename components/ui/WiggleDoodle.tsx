"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Doodle } from "@/components/ui/Doodle";
import { doodles, type DoodleName } from "@/content/doodles";
import { cn } from "@/lib/utils/cn";

type WiggleDoodleProps = {
  name: DoodleName;
  /** Inclinación en reposo (grados). */
  rotate?: number;
  /** Cambia el ritmo de la flotación para que varios dibujos no vayan sincronizados. */
  index?: number;
  /** Color del trazo (clase de fondo). Por defecto, tinta. */
  tint?: string;
  /** Control externo (p. ej. el hero: solo uno activo a la vez). Si se omite, se gestiona solo. */
  active?: boolean;
  onToggle?: () => void;
  className?: string;
};

/**
 * Dibujo de la marca que flota despacio y, al pasar el ratón o tocarlo, se
 * sacude, crece y enseña su palabra italiana. Otro toque lo devuelve.
 * Usado en el hero del Inicio y en la cabecera de la Carta.
 */
export function WiggleDoodle({
  name,
  rotate = 0,
  index = 0,
  tint,
  active: activeProp,
  onToggle,
  className,
}: WiggleDoodleProps) {
  const reduceMotion = useReducedMotion();
  const [activeSelf, setActiveSelf] = useState(false);
  const active = activeProp ?? activeSelf;
  const { word, alt } = doodles[name];

  return (
    // Flotación lenta en bucle; cada dibujo con su ritmo.
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
      transition={{ duration: 3.6 + index * 0.55, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.button
        type="button"
        aria-pressed={active}
        aria-label={`${alt} (${word})`}
        onClick={onToggle ?? (() => setActiveSelf((v) => !v))}
        className="group relative block w-full cursor-pointer rounded-md p-1"
        initial={false}
        animate={active ? "poke" : "rest"}
        whileHover="poke"
        whileFocus="poke"
        whileTap={{ scale: 0.9 }}
        variants={{
          rest: { rotate, scale: 1 },
          // Meneo: va y vuelve como un dibujo que se sacude, y crece un poco.
          poke: {
            rotate: [rotate, rotate - 14, rotate + 10, rotate - 5, 0],
            scale: 1.18,
            transition: {
              rotate: { duration: 0.7, ease: "easeOut" },
              scale: { type: "spring", stiffness: 320, damping: 14 },
            },
          },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <Doodle name={name} className={tint} />
        {/* Palabra italiana que aparece al tocar / pasar el ratón. */}
        <motion.span
          aria-hidden
          className={cn(
            "rounded-pill bg-fg font-display text-primary absolute top-full left-1/2 mt-1 -translate-x-1/2 px-3 py-1",
            "text-[0.65rem] font-extrabold tracking-[0.15em] whitespace-nowrap uppercase sm:text-xs"
          )}
          variants={{
            rest: { opacity: 0, y: -6, scale: 0.8 },
            poke: { opacity: 1, y: 0, scale: 1 },
          }}
        >
          {word}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
