"use client";

import { useState } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { Doodle } from "@/components/ui/Doodle";
import type { DoodleName } from "@/content/doodles";
import type { MenuItem } from "@/content/menu";
import { priceLabel, splitIngredients } from "@/lib/utils/format";

/** Ticket: se eleva con un pequeño vaivén, como si lo cogieras de la mesa. */
const cardVariants: Variants = {
  rest: { y: 0, rotate: 0 },
  lift: {
    y: -10,
    rotate: [0, -1.5, 1, 0],
    transition: {
      y: { type: "spring", stiffness: 300, damping: 18 },
      rotate: { duration: 0.5, ease: "easeOut" },
    },
  },
};

/** Sello del precio: gira y bota al elevar el ticket. */
const priceVariants: Variants = {
  rest: { rotate: -8, scale: 1 },
  lift: { rotate: [-8, 10, 0], scale: [1, 1.15, 1.05], transition: { duration: 0.5 } },
};

/** Dibujo de la categoría: cae desde grande y "golpea" el ticket, como un tampón. */
const stampVariants: Variants = {
  rest: { opacity: 0.12, scale: 1, rotate: -12 },
  lift: {
    opacity: 1,
    scale: [1.9, 0.92, 1],
    rotate: [-30, -6, -8],
    transition: { duration: 0.45 },
  },
};

/** Las etiquetas de ingredientes hacen una ola (cada una con su retraso). */
const chipVariants: Variants = {
  rest: { y: 0 },
  lift: (i: number) => ({
    y: [0, -5, 0],
    transition: { duration: 0.35, delay: i * 0.035, ease: "easeOut" },
  }),
};

type DishTicketProps = {
  item: MenuItem;
  doodle?: DoodleName;
  /** `true` = ingredientes como etiquetas; `false` = descripción en una frase. */
  chips?: boolean;
};

/**
 * Plato de la carta como ticket de feria (mismo lenguaje que el Proceso del Inicio).
 * Ratón: al pasar se eleva, el precio da un giro, se sella el dibujo y los
 * ingredientes hacen una ola. Táctil: un toque lo activa; otro lo devuelve.
 */
export function DishTicket({ item, doodle, chips = false }: DishTicketProps) {
  const [active, setActive] = useState(false);
  const ingredients = chips && item.description ? splitIngredients(item.description) : [];

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        className="ticket-notch bg-surface text-on-surface shadow-card relative flex h-full flex-col px-6 pt-7 pb-12 [--notch:0.75rem]"
        initial={false}
        animate={active ? "lift" : "rest"}
        whileHover="lift"
        variants={cardVariants}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") setActive((v) => !v);
        }}
      >
        <div
          aria-hidden
          className="border-luca-brown/70 pointer-events-none absolute inset-2 rounded-sm border-4 border-double"
        />

        <header className="relative flex items-start justify-between gap-4">
          <h3 className="font-display text-luca-brown text-2xl leading-none font-black uppercase md:text-[1.7rem]">
            {item.name}
          </h3>
          <motion.span
            variants={priceVariants}
            className="rounded-pill bg-accent font-display text-on-accent grid size-16 shrink-0 place-items-center text-center text-sm leading-none font-black"
          >
            {priceLabel(item.price)}
          </motion.span>
        </header>

        {ingredients.length > 0 ? (
          <ul
            className="relative mt-4 flex flex-wrap gap-1.5"
            aria-label={`Ingredientes de ${item.name}`}
          >
            {ingredients.map((ingredient, i) => (
              <motion.li
                key={ingredient}
                custom={i}
                variants={chipVariants}
                className="rounded-pill border-luca-brown/30 bg-bg/70 border px-2.5 py-1 text-[0.8rem] leading-tight first-letter:uppercase"
              >
                {ingredient}
              </motion.li>
            ))}
          </ul>
        ) : (
          item.description && (
            <p className="text-fg-muted relative mt-3 leading-relaxed">
              {item.description}
            </p>
          )
        )}

        {doodle && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-5 bottom-3.5 w-10"
            variants={stampVariants}
          >
            <Doodle name={doodle} className="bg-accent" />
          </motion.div>
        )}
      </motion.article>
    </MotionConfig>
  );
}
