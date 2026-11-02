"use client";

import { useId, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type PeekRatingProps = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  name: string;
  legend: string;
  /** Una palabra por puntuación (1 → 5); asoma por encima de las estrellas. */
  words: readonly [string, string, string, string, string];
  error?: string;
};

/**
 * Puntuación de 1 a 5 estrellas que "asoma": al pasar el ratón o elegir, las
 * estrellas se encienden con un bote escalonado y la palabra de esa nota sale
 * desde detrás de la fila (como quien se asoma por una ventana).
 * Por dentro es un grupo de radios reales: flechas del teclado y lectores de pantalla funcionan.
 */
export function PeekRating({
  value,
  onChange,
  onBlur,
  name,
  legend,
  words,
  error,
}: PeekRatingProps) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const errorId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <fieldset aria-describedby={error ? errorId : undefined}>
        <legend className="mb-1.5 block text-sm font-semibold">{legend}</legend>

        {/* Ventana por la que asoma la palabra (overflow-hidden = el "alféizar"). */}
        <div className="relative h-9 overflow-hidden" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown > 0 && (
              <motion.span
                key={shown}
                className="rounded-pill bg-fg font-display text-primary absolute bottom-0 left-0 px-3 py-1 text-sm font-extrabold tracking-[0.12em] uppercase"
                initial={{ y: "110%", rotate: -6 }}
                animate={{ y: "0%", rotate: 0 }}
                exit={{ y: "110%", rotate: 6 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                {words[shown - 1]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-1" onPointerLeave={() => setHover(0)}>
          {words.map((word, i) => {
            const n = i + 1;
            const lit = n <= shown;
            const inputId = `${name}-${n}`;
            return (
              <label
                key={n}
                htmlFor={inputId}
                className="cursor-pointer p-0.5"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(n)}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={name}
                  value={n}
                  checked={value === n}
                  onChange={() => onChange(n)}
                  onBlur={onBlur}
                  className="peer sr-only"
                />
                <span className="sr-only">
                  {n} {n === 1 ? "estrella" : "estrellas"}: {word}
                </span>
                <motion.span
                  aria-hidden
                  className="peer-focus-visible:outline-ring block rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                  animate={
                    lit ? { y: [0, -8, 0], scale: [1, 1.25, 1] } : { y: 0, scale: 1 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: lit ? i * 0.04 : 0,
                    ease: "easeOut",
                  }}
                >
                  <Star
                    size={36}
                    strokeWidth={1.8}
                    className={cn(
                      "transition-colors duration-200",
                      lit ? "fill-primary text-fg" : "text-fg-muted fill-transparent",
                      error && !value && "text-accent"
                    )}
                  />
                </motion.span>
              </label>
            );
          })}
        </div>

        {error && (
          <p id={errorId} className="text-accent mt-1.5 text-sm font-semibold">
            {error}
          </p>
        )}
      </fieldset>
    </MotionConfig>
  );
}
