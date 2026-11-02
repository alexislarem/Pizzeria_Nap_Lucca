"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { Photo } from "@/content/home";
import { cn } from "@/lib/utils/cn";

/**
 * Adaptado de React Bits — ScrollExpand (variante TS + Tailwind):
 * https://reactbits.dev/animations/scroll-expand
 * Cambios: next/image, colores de marca, título como nodo (para usar un <h2>),
 * solo scroll de la ventana y versión fija con "reducir movimiento".
 */

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Curva suave 0→1 entre dos puntos (empieza y acaba despacio). */
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

type ScrollExpandProps = {
  photo: Photo;
  /** Título grande sobre la foto pequeña; se desvanece al abrirse. */
  title?: React.ReactNode;
  /** Pista pequeña abajo (texto o icono); desaparece al empezar. */
  scrollHint?: React.ReactNode;
  /** Tamaño inicial de la ventana, en % de la pantalla. */
  startWidth?: number;
  startHeight?: number;
  /** Radio de las esquinas al principio y al final (px). */
  startRadius?: number;
  endRadius?: number;
  /** Zoom inicial de la foto; baja a 1 al abrirse. */
  mediaZoom?: number;
  /** Pantallas de scroll que dura la apertura. */
  scrollDistance?: number;
  /** Pantallas de scroll que se queda abierta antes de seguir. */
  holdDistance?: number;
  /** Inercia (0 = sigue el scroll al instante). */
  smoothing?: number;
  /** Contenido que aparece encima de la foto ya abierta. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Foto en una "ventana" pequeña que se abre a pantalla completa con el scroll.
 * La pista (track) es más alta que la pantalla y el escenario se queda fijo
 * (sticky) mientras dura la apertura. Los estilos se escriben directamente en
 * el DOM en cada frame (sin re-renders de React) para que vaya fluido.
 */
export function ScrollExpand({
  photo,
  title,
  scrollHint,
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  children,
  className,
}: ScrollExpandProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Las props van en una ref para que el bucle de animación lea siempre las últimas.
  const config = useRef({ startWidth, startHeight, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance, smoothing });
  config.current = { startWidth, startHeight, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance, smoothing };

  /** Pinta el estado para un avance `p` entre 0 (cerrada) y 1 (abierta). */
  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = config.current;
    const e = smoothstep(0, 1, p);

    // Recorte de la ventana: de startWidth×startHeight al 100 %.
    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${e}`;

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }
    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }
    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
      // Mientras no se ve, que sus enlaces no reciban clics ni foco por accidente.
      overlayRef.current.style.pointerEvents = inn > 0.5 ? "auto" : "none";
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (reduceMotion || !track || !stage) return;

    let raf = 0;
    let current = 0; // avance pintado
    let target = 0; // avance según el scroll
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = config.current;
      stageH = window.innerHeight;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;
    };

    const readProgress = () => {
      const span = stageH * Math.max(0.01, config.current.scrollDistance);
      return clamp(-track.getBoundingClientRect().top / span, 0, 1);
    };

    // Acerca `current` a `target` poco a poco (inercia) hasta alcanzarlo.
    const tick = () => {
      const s = config.current.smoothing;
      const k = s <= 0 ? 1 : 1 - Math.exp(-1 / (60 * s));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      target = readProgress();
      if (config.current.smoothing <= 0) {
        current = target;
        applyProgress(current);
        return;
      }
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      current = target = readProgress();
      applyProgress(current);
    };

    // Si el teclado llega a un enlace del contenido (aún invisible), abre la foto del todo.
    const overlay = overlayRef.current;
    const onFocusIn = () => {
      const span = stageH * Math.max(0.01, config.current.scrollDistance);
      const end = track.getBoundingClientRect().top + window.scrollY + span;
      if (readProgress() < 1) window.scrollTo({ top: end, behavior: "instant" });
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    overlay?.addEventListener("focusin", onFocusIn);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      overlay?.removeEventListener("focusin", onFocusIn);
    };
  }, [applyProgress, reduceMotion]);

  // Estado inicial (cerrada) ya en el HTML del servidor, antes de que corra el JS.
  const initialInset = `inset(${(100 - startHeight) / 2}% ${(100 - startWidth) / 2}% round ${startRadius}px)`;

  // "Reducir movimiento": la foto ya abierta, con el título y el contenido visibles.
  if (reduceMotion) {
    return (
      <div className={cn("relative isolate flex min-h-[80svh] w-full items-center justify-center overflow-hidden px-4 py-16", className)}>
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-fg/80 via-fg/30 to-fg/50" />
        <div className="flex flex-col items-center gap-6 text-center text-bg">
          {title}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Altura provisional (1 + 1,2 + 0,35 pantallas); measure() la recalcula con las props. */}
      <div ref={trackRef} className="relative h-[255svh] w-full">
        {/* Fondo negro de marca: el título blanco se lee también fuera de la foto. */}
        <div ref={stageRef} className="sticky top-0 h-svh w-full overflow-hidden bg-fg">
          <div ref={frameRef} className="absolute inset-0 [will-change:clip-path]" style={{ clipPath: initialInset }}>
            <Image
              ref={mediaRef}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              draggable={false}
              className="origin-center select-none object-cover [will-change:transform]"
              style={{ transform: `scale(${mediaZoom})` }}
            />
            <div ref={scrimRef} className="pointer-events-none absolute inset-0 bg-linear-to-t from-fg/80 via-fg/45 to-fg/55 opacity-0" />
            {children && (
              <div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 p-[6%] text-center text-bg opacity-0 [will-change:opacity,transform]"
              >
                {children}
              </div>
            )}
          </div>
          {title && (
            <div
              ref={titleRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-[6%] text-center text-bg [text-shadow:0_2px_24px_color-mix(in_srgb,var(--color-fg)_55%,transparent)] [will-change:opacity,transform]"
            >
              {title}
            </div>
          )}
          {scrollHint && (
            <div
              ref={hintRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center text-bg/70 [will-change:opacity,transform]"
            >
              {scrollHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
