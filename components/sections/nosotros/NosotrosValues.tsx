"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { nosotrosValues, type ValueCard } from "@/content/nosotros";

/**
 * Tarjeta que se da la vuelta: delante el cartel de marca, detrás el texto.
 * Ratón: gira al pasar por encima. Táctil/teclado: gira al pulsar (aria-pressed).
 * 3D con utilidades de Tailwind: perspective (padre), transform-3d y backface-hidden.
 */
function FlipCard({ card }: { card: ValueCard }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const flipped = pinned || hovered;

  return (
    <button
      type="button"
      aria-pressed={pinned}
      onClick={() => setPinned((value) => !value)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group block aspect-[5/7] w-[68vw] shrink-0 cursor-pointer snap-center text-left perspective-distant sm:w-auto"
    >
      <motion.span
        className="relative block size-full transform-3d"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        {/* Cara delantera: cartel + título */}
        <span className="shadow-soft absolute inset-0 overflow-hidden rounded-lg backface-hidden">
          <Image
            src={card.poster.src}
            alt={card.poster.alt}
            fill
            sizes="(min-width: 640px) 22vw, 68vw"
            className="object-cover"
          />
          <span className="rounded-pill bg-bg font-display absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 py-2 pr-2 pl-4 text-sm font-extrabold uppercase">
            {card.title}
            <RotateCw
              aria-hidden
              size={16}
              className="shrink-0 transition-transform group-hover:rotate-90"
            />
          </span>
        </span>

        {/* Cara trasera: ya girada 180°, se ve cuando la tarjeta da la vuelta. */}
        <span className="bg-fg text-bg shadow-soft absolute inset-0 flex rotate-y-180 flex-col justify-between rounded-lg p-6 backface-hidden">
          {/* aria-hidden: el título ya lo lee la cara delantera. */}
          <span
            aria-hidden
            className="font-display text-primary text-2xl leading-none font-black uppercase"
          >
            {card.title}
          </span>
          <span className="text-lg leading-snug">{card.text}</span>
        </span>
      </motion.span>
    </button>
  );
}

/**
 * Valores: el dato de las 72 h contando en grande sobre el bloque amarillo y tres
 * tarjetas con los carteles de la marca que se dan la vuelta para leer cada valor.
 */
export function NosotrosValues() {
  const { stat, cards } = nosotrosValues;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="values-title" className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              id="values-title"
              eyebrow={nosotrosValues.eyebrow}
              title={nosotrosValues.title}
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] lg:items-stretch">
            <Reveal className="bg-primary text-on-primary flex flex-col justify-between rounded-xl p-8 md:p-10">
              <p className="font-display leading-[0.85] font-black">
                <span className="sr-only">
                  {stat.value} {stat.unit}
                </span>
                <CountUp to={stat.value} className="text-[8rem] md:text-[10rem]" />
                <span aria-hidden className="ml-2 text-6xl md:text-7xl">
                  {stat.unit}
                </span>
              </p>
              <p className="mt-6 max-w-xs text-xl font-semibold">{stat.label}</p>
            </Reveal>

            {/* Móvil: fila deslizable con imán; desde sm: 3 columnas. */}
            {/* min-w-0: sin él, la fila deslizable estira la rejilla y la página se sale a lo ancho. */}
            <Reveal delay={0.1} className="min-w-0">
              <div className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
                {cards.map((card) => (
                  <FlipCard key={card.title} card={card} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
