"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils/cn";

type ScrollTextProps = {
  text: string;
  /** Palabras que se subrayan en amarillo (comparadas en minúsculas, sin tildes ni signos). */
  keywords?: readonly string[];
  className?: string;
};

/** Minúsculas, sin tildes ni signos: "Familia," → "familia". */
const normalize = (word: string) =>
  word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

type WordProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
};

/**
 * Una palabra: pasa de casi transparente a opaca en su tramo del scroll.
 * `motion-reduce:!…` gana al estilo en línea: con "menos movimiento" se ve completa
 * sin pintar otro HTML (así servidor y navegador coinciden al hidratar).
 */
function Word({ children, progress, range, highlight }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const underline = useTransform(progress, range, ["0%", "100%"]);

  return (
    <motion.span style={{ opacity }} className="relative motion-reduce:!opacity-100">
      {highlight && (
        <motion.span
          aria-hidden
          style={{ width: underline }}
          className="bg-primary absolute bottom-[0.08em] left-0 -z-10 h-[0.42em] rounded-sm motion-reduce:!w-full"
        />
      )}
      {children}
    </motion.span>
  );
}

/**
 * Párrafo que se "ilumina" palabra a palabra al recorrerlo con el scroll
 * (va ligado al scroll: avanza y retrocede con el usuario, no se dispara solo).
 * Las palabras clave quedan subrayadas en amarillo.
 */
export function ScrollText({ text, keywords = [], className }: ScrollTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  // 0 cuando el párrafo asoma por abajo (85 % de la pantalla); 1 cuando su final llega al 45 %.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  const marked = new Set(keywords.map(normalize));

  return (
    <p ref={ref} className={cn("relative isolate", className)}>
      {words.map((word, i) => (
        <span key={`${i}-${word}`}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            highlight={marked.has(normalize(word))}
          >
            {word}
          </Word>{" "}
        </span>
      ))}
    </p>
  );
}
