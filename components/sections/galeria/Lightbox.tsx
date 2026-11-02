"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/content/home";

type LightboxProps = {
  photos: Photo[];
  /** Posición de la foto abierta; null = cerrado. */
  index: number | null;
  onChange: (index: number | null) => void;
};

const navButton =
  "grid size-12 place-items-center rounded-pill bg-bg/10 text-bg transition-colors hover:bg-primary hover:text-on-primary";

/**
 * Visor a pantalla completa. Usa el <dialog> nativo del navegador:
 * atrapa el foco, se cierra con Esc y devuelve el foco a la foto que lo abrió.
 * Flechas ← → para pasar de foto.
 */
export function Lightbox({ photos, index, onChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = index !== null;

  // Sincroniza el estado de React con el <dialog> y bloquea el scroll de la página mientras está abierto.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const step = (delta: number) => {
    if (index === null) return;
    onChange((index + delta + photos.length) % photos.length);
  };

  const photo = index === null ? undefined : photos[index];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Visor de fotos"
      onClose={() => onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      // Clic fuera de la foto (en el fondo oscuro) = cerrar.
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-fg/95 p-0 text-bg backdrop:bg-transparent"
    >
      {index !== null && photo && (
        <div className="flex h-full flex-col gap-4 p-4 md:p-8" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
          <div className="flex items-center justify-between">
            <p aria-live="polite" className="text-sm font-semibold tabular-nums">
              {index + 1} / {photos.length}
            </p>
            <button type="button" onClick={() => onChange(null)} className={navButton} aria-label="Cerrar visor" autoFocus>
              <X aria-hidden className="size-6" />
            </button>
          </div>

          <figure className="relative min-h-0 flex-1">
            <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
          </figure>

          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => step(-1)} className={navButton} aria-label="Foto anterior">
              <ChevronLeft aria-hidden className="size-6" />
            </button>
            <p className="line-clamp-2 max-w-xl text-center text-sm text-bg/80">{photo.alt}</p>
            <button type="button" onClick={() => step(1)} className={navButton} aria-label="Foto siguiente">
              <ChevronRight aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
