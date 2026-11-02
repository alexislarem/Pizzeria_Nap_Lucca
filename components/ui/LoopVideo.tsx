"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

type LoopVideoProps = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * Vídeo en bucle, sin sonido (Live Photos). Se arranca con play() porque React pone
 * `muted` después de crear el elemento y el navegador puede bloquear el autoPlay.
 * Decorativo: el texto alternativo ya lo da la imagen de debajo.
 * Móntalo solo cuando deba reproducirse: así no se descarga antes de tiempo.
 */
export function LoopVideo({ src, poster, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Si el navegador no deja reproducir, se queda el póster: no es un error.
    });
  }, [src]);

  return (
    <video
      ref={ref}
      aria-hidden
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      className={cn("absolute inset-0 size-full object-cover", className)}
    />
  );
}
