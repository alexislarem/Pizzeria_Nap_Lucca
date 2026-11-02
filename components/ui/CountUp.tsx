"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  to: number;
  /** Duración en segundos. */
  duration?: number;
  className?: string;
};

/**
 * Número que cuenta de 0 a `to` la primera vez que entra en pantalla.
 * Se pinta ya con el valor final (servidor, sin JS, "menos movimiento") y solo
 * hace la cuenta cuando aparece, así nunca se queda en 0.
 * Es aria-hidden (un lector leería números a medias): pon el valor en un `sr-only` al lado.
 */
export function CountUp({ to, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to, duration]);

  return (
    <span ref={ref} aria-hidden className={className}>
      {value}
    </span>
  );
}
