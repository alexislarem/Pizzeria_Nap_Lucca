"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Lightbox } from "@/components/sections/galeria/Lightbox";
import { galeriaPhotos, galeriaTopics, type GaleriaTopic } from "@/content/galeria";
import { cn } from "@/lib/utils/cn";

const chip =
  "shrink-0 rounded-pill border px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors";

/**
 * Filtros por tema + mosaico tipo "masonry" (columnas CSS: cada foto mantiene su proporción)
 * + visor a pantalla completa al pulsar una foto.
 */
export function GaleriaGrid() {
  const reduceMotion = useReducedMotion();
  const [topic, setTopic] = useState<GaleriaTopic | "todas">("todas");
  const [open, setOpen] = useState<number | null>(null);

  const photos = topic === "todas" ? galeriaPhotos : galeriaPhotos.filter((p) => p.topic === topic);
  const filters = [{ id: "todas", label: "Todas" } as const, ...galeriaTopics];

  return (
    <section aria-label="Fotos" className="px-4 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <div role="group" aria-label="Filtrar fotos por tema" className="sticky top-16 z-40 -mx-4 bg-bg/95 px-4 py-3 backdrop-blur-sm">
          <div className="scrollbar-none flex gap-2 overflow-x-auto">
            {filters.map((f) => {
              const active = f.id === topic;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTopic(f.id)}
                  className={cn(
                    chip,
                    active
                      ? "border-primary bg-primary text-on-primary"
                      : "border-border text-fg hover:border-primary hover:bg-primary hover:text-on-primary"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {photos.length} fotos
        </p>

        {/* key={topic}: al cambiar de filtro, la lista se monta de nuevo y vuelve a aparecer con suavidad. */}
        <ul key={topic} className="mt-6 columns-2 gap-3 md:columns-3 md:gap-4">
          {photos.map((photo, i) => (
            <motion.li
              key={photo.src}
              className="mb-3 break-inside-avoid md:mb-4"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(i, 8) * 0.04 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Ampliar foto: ${photo.alt}`}
                className="group block w-full overflow-hidden rounded-lg"
              >
                <Image
                  src={photo.src}
                  alt=""
                  width={photo.landscape ? 1600 : 1200}
                  height={photo.landscape ? 1200 : 1600}
                  sizes="(min-width: 1152px) 368px, (min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <Lightbox photos={photos} index={open} onChange={setOpen} />
    </section>
  );
}
