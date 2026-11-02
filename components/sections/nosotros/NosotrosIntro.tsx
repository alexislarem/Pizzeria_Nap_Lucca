"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { nosotrosIntro } from "@/content/nosotros";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cabecera de Nosotros:
 *   - el título sube línea a línea desde debajo de una máscara;
 *   - la foto de la pareja empieza como un ARCO y se abre a rectángulo con el scroll
 *     (clip-path ligado al scroll, mientras la foto se aleja un poco);
 *   - una polaroid con el selfie se endereza al pasar el ratón / al tocarla.
 * `data-reveal`: si no hay JavaScript, layout.tsx los muestra (no se quedan ocultos).
 */
export function NosotrosIntro() {
  const figureRef = useRef<HTMLDivElement>(null);
  // 0 cuando la foto asoma por abajo; 1 cuando su centro llega al centro de la pantalla.
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "center center"],
  });
  const side = useTransform(scrollYProgress, [0, 1], [18, 0]); // % recortado a cada lado
  const arch = useTransform(scrollYProgress, [0, 1], [30, 3]); // radio superior (vw)
  const clipPath = useMotionTemplate`inset(0% ${side}% 0% ${side}% round ${arch}vw ${arch}vw 3rem 3rem)`;
  const zoom = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="nosotros-title"
        className="px-4 pt-28 pb-16 md:pt-36 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.p
            data-reveal
            className="font-display text-fg-muted text-sm font-extrabold tracking-[0.2em] uppercase"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {nosotrosIntro.eyebrow}
          </motion.p>

          <h1
            id="nosotros-title"
            className="font-display mt-2 text-6xl leading-[0.9] font-black uppercase sm:text-8xl lg:text-[9.5rem]"
          >
            {nosotrosIntro.title.map((line, i) => (
              // overflow-hidden = máscara: la línea sube desde debajo de su caja.
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  data-reveal
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            data-reveal
            className="font-display mt-6 max-w-xl text-2xl leading-tight font-black uppercase md:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          >
            {nosotrosIntro.lead}
          </motion.p>
        </div>

        <div ref={figureRef} className="relative mx-auto mt-14 max-w-6xl md:mt-20">
          <motion.div
            style={{ clipPath }}
            className="relative aspect-[4/5] overflow-hidden rounded-xl motion-reduce:![clip-path:none] sm:aspect-[16/10]"
          >
            <motion.div style={{ scale: zoom }} className="absolute inset-0">
              <Image
                src={nosotrosIntro.photo.src}
                alt={nosotrosIntro.photo.alt}
                fill
                priority
                sizes="(min-width: 1152px) 72rem, 100vw"
                className="object-cover object-[50%_62%]"
              />
            </motion.div>
          </motion.div>

          {/* Polaroid: se endereza y se acerca al pasar el ratón o al tocarla. */}
          <motion.figure
            className="bg-bg shadow-soft absolute -bottom-10 left-2 w-32 cursor-pointer rounded-md p-2 pb-6 sm:w-44 md:-bottom-12 md:-left-6 md:w-56"
            initial={false}
            animate={{ rotate: -7, scale: 1, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.08, y: -8 }}
            whileTap={{ rotate: 0, scale: 1.08, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <Image
                src={nosotrosIntro.detail.src}
                alt={nosotrosIntro.detail.alt}
                fill
                sizes="(min-width: 768px) 14rem, 11rem"
                className="object-cover"
              />
            </div>
          </motion.figure>
        </div>
      </section>
    </MotionConfig>
  );
}
