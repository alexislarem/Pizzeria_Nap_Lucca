"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react";
import { MapPin, Pause, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resenasWall, reviewSources, reviews } from "@/content/resenas";
import { InstagramCard, ReviewCard } from "./ReviewCard";

/** Velocidad base de cada columna (px/s): distintas para que no suban a la par. */
const SPEEDS = [26, 34, 22] as const;
/** Mínimo de comandas por columna para que el bucle no deje huecos. */
const MIN_PER_COLUMN = 4;

/** Una comanda de la barra: una reseña (con su número) o la tarjeta de Instagram. */
type Slot = { key: string; node: ReactNode };

const slots: Slot[] = [
  ...reviews.map((review, i) => ({
    key: review.id,
    node: <ReviewCard review={review} number={i + 1} />,
  })),
  { key: "instagram", node: <InstagramCard /> },
];

/** 1 columna en móvil, 2 en tablet, 3 en escritorio (en el servidor, 1). */
function useColumnCount() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return count;
}

/** Reparte las comandas en columnas (1ª, 2ª, 3ª, 1ª…) y repite si una se queda corta. */
function distribute(count: number): Slot[][] {
  const columns = Array.from({ length: count }, (_, c) =>
    slots.filter((_, i) => i % count === c)
  );
  return columns.map((column) => {
    const filled = [...column];
    while (filled.length < MIN_PER_COLUMN && column.length > 0) filled.push(...column);
    return filled;
  });
}

type RailColumnProps = {
  items: Slot[];
  speed: number;
  paused: boolean;
};

/**
 * Columna que sube en bucle sin fin. La lista va duplicada: al subir media
 * altura se recoloca arriba sin que se note. Al hacer scroll, la velocidad del
 * scroll se suma (las comandas "corren" con la página) y luego vuelven a su ritmo.
 */
function RailColumn({ items, speed, paused }: RailColumnProps) {
  const inner = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });

  useAnimationFrame((_, delta) => {
    const half = (inner.current?.scrollHeight ?? 0) / 2;
    if (paused || !half) return;
    // Hasta 5 veces más rápido con un scroll enérgico.
    const boost = Math.min(Math.abs(scrollVelocity.get()) / 400, 5);
    let next = y.get() - (speed * (1 + boost) * delta) / 1000;
    if (next <= -half) next += half;
    y.set(next);
  });

  return (
    <div className="min-w-0 flex-1">
      <motion.div ref={inner} style={{ y }}>
        {[0, 1].map((copy) => (
          // La copia es solo para el bucle: invisible para lectores de pantalla y sin foco.
          <div key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1}>
            {items.map((slot, i) => (
              <div key={`${slot.key}-${i}`} className="pb-6">
                {slot.node}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Barra de comandas: las reseñas suben solas en columnas, como los pedidos
 * colgados en la barra del horno, y aparecen/desaparecen por arriba y por abajo
 * (máscara de degradado). El scroll las acelera. Se paran al pasar el ratón, al
 * enfocar una con el teclado o con el botón de pausa. Con "menos movimiento",
 * se muestran quietas en rejilla.
 */
export function ResenasWall() {
  const reduceMotion = useReducedMotion();
  const columnCount = useColumnCount();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const google = reviewSources.google;

  return (
    <section aria-labelledby="resenas-wall-title" className="px-4 py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="resenas-wall-title"
            eyebrow={resenasWall.eyebrow}
            title={resenasWall.title}
          />
          <div className="flex flex-wrap items-center gap-3">
            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="rounded-pill border-border hover:border-fg inline-flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                {paused ? (
                  <Play aria-hidden size={16} />
                ) : (
                  <Pause aria-hidden size={16} />
                )}
                {paused ? resenasWall.play : resenasWall.pause}
              </button>
            )}
            <ButtonLink href={google.href} variant="dark" size="sm">
              <MapPin aria-hidden size={16} />
              {resenasWall.more}
            </ButtonLink>
          </div>
        </div>

        {reduceMotion ? (
          <ul className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3">
            {slots.map((slot) => (
              <li key={slot.key} className="mb-6 break-inside-avoid">
                {slot.node}
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="mt-10 flex h-[44rem] gap-6 overflow-hidden px-1 md:h-[48rem]"
            style={{
              maskImage:
                "linear-gradient(transparent, black 14%, black 86%, transparent)",
              WebkitMaskImage:
                "linear-gradient(transparent, black 14%, black 86%, transparent)",
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            {distribute(columnCount).map((items, c) => (
              <RailColumn
                key={`${columnCount}-${c}`}
                items={items}
                speed={SPEEDS[c] ?? SPEEDS[0]}
                paused={paused || hovered}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
