"use client";

import { useState } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { Doodle } from "@/components/ui/Doodle";
import type { ProcessStep } from "@/content/home";

/** Ticket: se eleva y se sacude un poco, como si lo cogieras de la mesa. */
const cardVariants: Variants = {
  rest: { y: 0, scale: 1, rotate: 0 },
  lift: {
    y: -14,
    scale: 1.05,
    rotate: [0, -2.5, 1.5, 0],
    transition: {
      y: { type: "spring", stiffness: 300, damping: 16 },
      scale: { type: "spring", stiffness: 300, damping: 16 },
      rotate: { duration: 0.5, ease: "easeOut" },
    },
  },
};

/** Sello: el dibujo cae desde grande y "golpea" el ticket, como un tampón de tinta. */
const stampVariants: Variants = {
  rest: { opacity: 0.14, scale: 1, rotate: -12 },
  lift: {
    opacity: 1,
    scale: [1.9, 0.92, 1],
    rotate: [-30, -6, -8],
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

type ProcessTicketProps = { step: ProcessStep; index: number };

/**
 * Ticket de feria de un paso del proceso. Ratón: al pasar se eleva y se sella
 * con su dibujo. Táctil: un toque lo eleva; otro lo devuelve.
 */
export function ProcessTicket({ step, index }: ProcessTicketProps) {
  const [active, setActive] = useState(false);

  // reducedMotion="user": con "menos movimiento" solo cambia la opacidad del sello.
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="ticket-notch bg-surface text-on-surface shadow-soft relative h-full cursor-default px-6 pt-8 pb-14 text-center"
        initial={false}
        animate={active ? "lift" : "rest"}
        whileHover="lift"
        variants={cardVariants}
        // Solo el dedo alterna el estado; con ratón ya se encarga el hover.
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") setActive((value) => !value);
        }}
      >
        {/* Doble filete interior, como en los tickets impresos. */}
        <div
          aria-hidden
          className="border-luca-brown pointer-events-none absolute inset-2.5 rounded-sm border-4 border-double"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-5 bottom-4 w-11"
          variants={stampVariants}
        >
          <Doodle name={step.doodle} className="bg-accent" />
        </motion.div>
        <p className="font-display text-luca-brown relative text-sm font-extrabold tracking-[0.2em] uppercase">
          Paso {index + 1}
        </p>
        <h3 className="font-display text-luca-brown relative mt-2 text-2xl leading-none font-black uppercase">
          {step.title}
        </h3>
        <p className="relative mt-3 text-sm leading-relaxed">{step.text}</p>
      </motion.div>
    </MotionConfig>
  );
}
