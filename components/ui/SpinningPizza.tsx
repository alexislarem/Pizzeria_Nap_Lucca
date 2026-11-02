"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Photo } from "@/content/home";
import { cn } from "@/lib/utils/cn";

type SpinningPizzaProps = {
  /** Pizza recortada con fondo transparente (WebP con alfa). */
  photo: Photo;
  /** Texto que da la vuelta alrededor; termina en separador para que empalme. */
  ringText: string;
  className?: string;
};

/**
 * Pizza que gira con el scroll, como un sello: la pizza rota en un sentido y el
 * aro (cuadros amarillos + texto de marca) en el contrario. El giro va ligado a
 * la posición de la página, así que se para cuando paras de hacer scroll.
 * Con "reducir movimiento" se queda quieta.
 */
export function SpinningPizza({ photo, ringText, className }: SpinningPizzaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // 0 cuando el bloque asoma por abajo, 1 cuando sale por arriba.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const counter = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <div ref={ref} className={cn("relative aspect-square", className)}>
      {/* Aro: cuadros tipo sello y texto curvo. viewBox 100×100 → escala con el contenedor. */}
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 size-full"
        style={reduceMotion ? undefined : { rotate: counter }}
      >
        <defs>
          <path id="pizza-ring-path" d="M 50,50 m -46.5,0 a 46.5,46.5 0 1,1 93,0 a 46.5,46.5 0 1,1 -93,0" />
        </defs>
        <circle cx="50" cy="50" r="42.5" className="fill-fg" />
        <circle cx="50" cy="50" r="42.5" fill="none" strokeWidth="2.6" strokeDasharray="2.2 2.2" className="stroke-primary" />
        <text className="fill-surface font-display text-[3.4px] font-black tracking-[0.18em] uppercase">
          <textPath href="#pizza-ring-path" textLength="290" lengthAdjust="spacing">
            {ringText.repeat(2)}
          </textPath>
        </text>
      </motion.svg>

      <motion.div className="absolute inset-[10%]" style={reduceMotion ? undefined : { rotate: spin }}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 40rem, 90vw" className="object-contain" />
      </motion.div>
    </div>
  );
}
