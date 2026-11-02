"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type GhostTypeProps = {
  /** Texto que se escribe una sola vez al principio. */
  text: string;
  /** Sugerencias "fantasma" que se proponen detrás del texto, por turnos. */
  completions: readonly string[];
  /** Pone cada sugerencia en una línea nueva (útil en títulos cortos). */
  breakLine?: boolean;
  /** Clases de la línea de sugerencias (p. ej. un tamaño menor para que no ocupe tanto). */
  completionClassName?: string;
  /** Repetir las sugerencias en bucle; si no, se queda en la última. */
  loop?: boolean;
  /** Milisegundos por letra al escribir el texto. */
  typeSpeed?: number;
  /** Milisegundos por palabra al aparecer la sugerencia. */
  streamSpeed?: number;
  /** Pausa "pensando" antes de proponer. */
  thinkDelay?: number;
  /** Tiempo que la sugerencia queda en gris antes de aceptarse. */
  acceptDelay?: number;
  /** Tiempo que la sugerencia aceptada se queda visible. */
  holdDelay?: number;
  className?: string;
};

type Phase = "typing" | "thinking" | "ghost" | "accepted" | "selecting";

/** Ejecuta `fn` tras `ms` y devuelve la limpieza (para usar dentro de useEffect). */
function after(fn: () => void, ms: number) {
  const id = window.setTimeout(fn, ms);
  return () => window.clearTimeout(id);
}

/**
 * Titular que se escribe solo, como un autocompletado: escribe `text`, propone
 * una sugerencia en gris (con la tecla "Tab" de pista), la acepta subrayándola
 * en amarillo, la selecciona y pasa a la siguiente.
 * - Los lectores de pantalla leen solo `text` (lo animado va con aria-hidden).
 * - Una capa invisible reserva el alto final, así el título no hace "saltar" la página.
 * - Solo anima mientras está en pantalla; con "reducir movimiento" se muestra fijo.
 */
export function GhostType({
  text,
  completions,
  breakLine = false,
  completionClassName,
  loop = true,
  typeSpeed = 60,
  streamSpeed = 90,
  thinkDelay = 600,
  acceptDelay = 1200,
  holdDelay = 2200,
  className,
}: GhostTypeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0); // letras de `text` ya escritas
  const [index, setIndex] = useState(0); // sugerencia actual
  const [shown, setShown] = useState(0); // palabras visibles de la sugerencia

  const completion = completions[index] ?? "";
  // Trocea en palabras conservando los espacios delante de cada una.
  const words = useMemo(() => completion.match(/\s*\S+/g) ?? [], [completion]);
  const longest = useMemo(
    () => completions.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [completions],
  );

  // Máquina de estados: cada fase programa la siguiente con un temporizador.
  useEffect(() => {
    if (reduceMotion || !inView || completions.length === 0) return;
    switch (phase) {
      case "typing":
        return typed < text.length ? after(() => setTyped((t) => t + 1), typeSpeed) : after(() => setPhase("thinking"), 0);
      case "thinking":
        return after(() => {
          setShown(0);
          setPhase("ghost");
        }, thinkDelay);
      case "ghost":
        return shown < words.length
          ? after(() => setShown((s) => s + 1), streamSpeed)
          : after(() => setPhase("accepted"), acceptDelay);
      case "accepted":
        if (!loop && index === completions.length - 1) return;
        return after(() => setPhase("selecting"), holdDelay);
      case "selecting":
        return after(() => {
          setIndex((i) => (i + 1) % completions.length);
          setPhase("thinking");
        }, 500);
    }
  }, [phase, typed, shown, index, inView, reduceMotion, text, words.length, completions.length, loop, typeSpeed, streamSpeed, thinkDelay, acceptDelay, holdDelay]);

  const isStatic = reduceMotion === true;
  const visibleCompletion = isStatic
    ? (completions[0] ?? "")
    : phase === "ghost"
      ? words.slice(0, shown).join("")
      : phase === "accepted" || phase === "selecting"
        ? completion
        : "";
  const marked = isStatic || phase === "accepted";

  return (
    <span ref={ref} className={cn("grid", className)}>
      <span className="sr-only">{text}</span>

      {/* Capa invisible con el contenido más largo: fija el alto del bloque. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {text}
        <span className={cn(breakLine && "block", completionClassName)}>
          {longest}
          <Hint />
        </span>
      </span>

      <span aria-hidden className="col-start-1 row-start-1">
        {isStatic ? text : text.slice(0, typed)}
        {!isStatic && phase === "typing" && <Caret />}
        {(isStatic || phase !== "typing") && (
          <span className={cn(breakLine && "block", completionClassName)}>
            {(phase === "thinking" || phase === "ghost") && !isStatic && <Caret />}
            <motion.span
              className={cn(
                "box-decoration-clone bg-[linear-gradient(var(--color-primary),var(--color-primary))] bg-[position:0_88%] bg-no-repeat transition-opacity",
                phase === "ghost" && !isStatic && "opacity-35",
                phase === "selecting" && !isStatic && "bg-fg text-bg",
              )}
              initial={false}
              animate={{ backgroundSize: marked ? "100% 0.3em" : "0% 0.3em" }}
              transition={{ duration: isStatic ? 0 : 0.5, ease: "easeOut" }}
            >
              {visibleCompletion}
            </motion.span>
            {!isStatic && phase === "ghost" && shown === words.length && <Hint />}
          </span>
        )}
      </span>
    </span>
  );
}

/** Cursor parpadeante. */
function Caret() {
  return (
    <motion.span
      className="ml-0.5 inline-block h-[0.85em] w-[0.08em] translate-y-[0.05em] bg-fg align-baseline"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
    />
  );
}

/** Pista tipo autocompletado: "pulsa Tab para aceptar". */
function Hint() {
  return (
    <kbd className="ml-3 inline-block -translate-y-[0.3em] rounded-sm border border-border px-2 py-0.5 align-middle font-body text-xs font-semibold tracking-normal text-fg-muted normal-case">
      Tab
    </kbd>
  );
}
