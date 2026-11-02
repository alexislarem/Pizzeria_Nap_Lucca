"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { nosotrosBuild } from "@/content/nosotros";
import { cn } from "@/lib/utils/cn";

type Step = (typeof nosotrosBuild.steps)[number];

/** Inclinación de cada polaroid (se repite el patrón): da el aire de fotos pegadas a mano. */
const TILTS = [-3, 2.5, -2, 3, -2.5, 2] as const;

type PolaroidProps = { step: Step; index: number };

/**
 * Polaroid de un paso de la obra. Al pasar el ratón (o al tocar) se endereza y se
 * eleva; si el paso tiene vídeo, además se reproduce la Live Photo. En táctil, el
 * toque deja el vídeo fijo hasta el siguiente toque (por eso es un botón con aria-pressed).
 */
function Polaroid({ step, index }: PolaroidProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const active = hovered || pinned;
  const video = "video" in step ? step.video : undefined;
  const tilt = TILTS[index % TILTS.length];

  const body = (
    <>
      <span className="bg-surface relative block aspect-[4/5] overflow-hidden rounded-sm">
        <Image
          src={step.src}
          alt={step.alt}
          fill
          sizes="(min-width: 640px) 20rem, 70vw"
          className="object-cover"
        />
        {video && active && <LoopVideo src={video} poster={step.src} />}
        {video && (
          <span
            aria-hidden
            className={cn(
              "rounded-pill bg-bg/90 text-fg absolute top-3 right-3 grid size-9 place-items-center transition-transform",
              active && "scale-0"
            )}
          >
            <Play size={16} className="translate-x-px fill-current" />
          </span>
        )}
      </span>
      <span className="mt-4 flex items-center gap-3">
        <span
          aria-hidden
          className="rounded-pill bg-fg font-display text-primary grid size-9 shrink-0 place-items-center font-black"
        >
          {index + 1}
        </span>
        <span className="font-display text-lg leading-tight font-black uppercase">
          {step.caption}
        </span>
        {video && <span className="sr-only">(reproducir vídeo)</span>}
      </span>
    </>
  );

  const motionProps = {
    className:
      "block w-[70vw] max-w-80 shrink-0 rounded-md bg-bg p-3 pb-4 text-left shadow-soft sm:w-80",
    initial: false,
    animate: active
      ? { rotate: 0, y: -14, scale: 1.04 }
      : { rotate: tilt, y: 0, scale: 1 },
    transition: { type: "spring", stiffness: 260, damping: 20 },
    onPointerEnter: (event: React.PointerEvent) =>
      event.pointerType === "mouse" && setHovered(true),
    onPointerLeave: () => setHovered(false),
  } as const;

  return (
    <li className="shrink-0">
      {video ? (
        <motion.button
          type="button"
          aria-pressed={pinned}
          onClick={() => setPinned((value) => !value)}
          {...motionProps}
          className={cn(motionProps.className, "cursor-pointer")}
        >
          {body}
        </motion.button>
      ) : (
        <motion.div {...motionProps} whileTap={{ rotate: 0, y: -14, scale: 1.04 }}>
          {body}
        </motion.div>
      )}
    </li>
  );
}

/**
 * Así nació LUCA: al bajar, la sección se queda fija y las polaroids avanzan en
 * horizontal (el scroll vertical se convierte en desplazamiento lateral), con una
 * línea amarilla que marca el progreso. La altura de la sección = recorrido lateral
 * + una pantalla, para que el scroll dure lo justo.
 */
export function NosotrosBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);

  // Recorrido lateral = ancho de la tira − ancho de la ventana (se recalcula al redimensionar).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (value) => -value * distance);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        aria-labelledby="nosotros-build-title"
        className="relative"
        style={{ height: distance ? `calc(100svh + ${distance}px)` : undefined }}
      >
        <div className="sticky top-0 flex min-h-svh flex-col justify-center overflow-hidden py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-4">
            <SectionHeading
              id="nosotros-build-title"
              eyebrow={nosotrosBuild.eyebrow}
              title={nosotrosBuild.title}
              subtitle={nosotrosBuild.subtitle}
            />
            {/* Progreso: la raya amarilla crece con el scroll. */}
            <div
              aria-hidden
              className="rounded-pill bg-border mb-2 h-1.5 w-40 overflow-hidden"
            >
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="bg-primary h-full origin-left"
              />
            </div>
          </div>

          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="mt-12 flex w-max items-start gap-6 px-4 md:gap-10 md:px-[max(1rem,calc((100vw-72rem)/2))]"
          >
            {nosotrosBuild.steps.map((step, i) => (
              <Polaroid key={step.src} step={step} index={i} />
            ))}
          </motion.ol>
        </div>
      </section>
    </MotionConfig>
  );
}
