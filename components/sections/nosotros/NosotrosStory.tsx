"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion, useInView } from "motion/react";
import { ScrollText } from "@/components/ui/ScrollText";
import { nosotrosStory } from "@/content/nosotros";
import { cn } from "@/lib/utils/cn";

type Chapter = (typeof nosotrosStory.chapters)[number];

type ChapterBlockProps = {
  chapter: Chapter;
  index: number;
  onActive: (index: number) => void;
};

/** Un capítulo: número + etiqueta + párrafo que se ilumina. Avisa cuando ocupa el centro. */
function ChapterBlock({ chapter, index, onActive }: ChapterBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  // "Activo" = cruza la franja central de la pantalla.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-10 md:min-h-[75vh] md:py-0">
      {/* En móvil cada capítulo lleva su foto; en escritorio va en la columna fija. */}
      <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-xl md:hidden">
        <Image
          src={chapter.photo.src}
          alt={chapter.photo.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <p className="font-display flex items-baseline gap-4 font-black uppercase">
        <span aria-hidden className="text-primary text-6xl leading-none md:text-7xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-lg tracking-[0.15em]">{chapter.label}</span>
      </p>
      <ScrollText
        text={chapter.text}
        keywords={nosotrosStory.keywords}
        className="mt-6 text-2xl leading-snug font-medium md:text-[1.75rem]"
      />
    </div>
  );
}

/**
 * Historia en 3 capítulos (scrollytelling): en escritorio la foto se queda fija a la
 * izquierda y cambia con un fundido según el capítulo que está en el centro; a la
 * derecha, cada párrafo se ilumina palabra a palabra con el scroll.
 */
export function NosotrosStory() {
  const [active, setActive] = useState(0);
  const { chapters } = nosotrosStory;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="story-title" className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="story-title" className="sr-only">
            {nosotrosStory.title}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 md:gap-16">
            {/* Columna fija (solo escritorio): las 3 fotos apiladas, se ve la activa. */}
            <div className="hidden md:block">
              <div className="shadow-soft sticky top-28 aspect-[4/5] overflow-hidden rounded-xl">
                {chapters.map((chapter, i) => (
                  <motion.div
                    key={chapter.photo.src}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: active === i ? 1 : 0,
                      scale: active === i ? 1 : 1.08,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <Image
                      src={chapter.photo.src}
                      alt={chapter.photo.alt}
                      fill
                      sizes="(min-width: 1152px) 34rem, 45vw"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
                {/* Indicador de capítulo: 3 rayas, la activa en amarillo y más larga. */}
                <div aria-hidden className="absolute bottom-5 left-5 flex gap-2">
                  {chapters.map((chapter, i) => (
                    <span
                      key={chapter.label}
                      className={cn(
                        "rounded-pill h-1.5 transition-all duration-500",
                        active === i ? "bg-primary w-10" : "bg-bg/70 w-4"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              {chapters.map((chapter, i) => (
                <ChapterBlock
                  key={chapter.label}
                  chapter={chapter}
                  index={i}
                  onActive={setActive}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
