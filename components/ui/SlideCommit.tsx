"use client";

import { useEffect, useRef, useState } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Fracción del recorrido a partir de la cual soltar = enviar. */
const COMMIT_AT = 0.85;

type SlideCommitProps = {
  /** Se llama al llegar al final. Mientras dura la promesa, se muestra "enviando". */
  onCommit: () => Promise<void>;
  label: string;
  busyLabel: string;
  disabled?: boolean;
  className?: string;
};

/**
 * "Desliza para enviar": arrastra la bola hasta el final para confirmar.
 * Evita envíos por error y da un remate satisfactorio al formulario.
 * Si no llega al final, vuelve con un muelle. Accesible: con teclado o lector
 * de pantalla, Enter/Espacio sobre la bola envía directamente.
 */
export function SlideCommit({
  onCommit,
  label,
  busyLabel,
  disabled,
  className,
}: SlideCommitProps) {
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const mounted = useRef(true);
  const [busy, setBusy] = useState(false);
  const [maxX, setMaxX] = useState(0);
  const x = useMotionValue(0);

  // El texto se desvanece y el relleno crece a medida que avanza la bola.
  const progress = useTransform(x, (v) =>
    maxX ? Math.min(1, Math.max(0, v / maxX)) : 0
  );
  const labelOpacity = useTransform(progress, [0, 0.6], [1, 0]);
  // 56 px = ancho de la bola (size-14).
  const fillWidth = useTransform(x, (v) => v + 56);

  // Recorrido disponible = ancho de la pista - ancho de la bola - márgenes.
  useEffect(() => {
    mounted.current = true;
    const measure = () => {
      if (track.current && thumb.current) {
        setMaxX(track.current.clientWidth - thumb.current.offsetWidth - 12);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    return () => {
      mounted.current = false;
      observer.disconnect();
    };
  }, []);

  const commit = async () => {
    if (busy || disabled) return;
    setBusy(true);
    animate(x, maxX, { type: "spring", stiffness: 400, damping: 32 });
    try {
      await onCommit();
    } finally {
      // Si el formulario sigue en pantalla (error de validación o de red), la bola vuelve.
      if (mounted.current) {
        setBusy(false);
        animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
      }
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (x.get() >= maxX * COMMIT_AT || info.velocity.x > 900) void commit();
    else animate(x, 0, { type: "spring", stiffness: 400, damping: 28 });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={track}
        className={cn(
          "rounded-pill bg-fg relative h-[4.25rem] w-full max-w-md overflow-hidden p-1.5 select-none",
          disabled && "opacity-60",
          className
        )}
      >
        {/* Relleno amarillo que sigue a la bola. */}
        <motion.div
          aria-hidden
          className="rounded-pill bg-primary/25 absolute inset-y-1.5 left-1.5"
          style={{ width: fillWidth }}
        />
        <motion.span
          aria-hidden
          className="font-display text-primary pointer-events-none absolute inset-0 grid place-items-center pl-14 text-sm font-extrabold tracking-[0.18em] uppercase"
          style={{ opacity: busy ? 1 : labelOpacity }}
        >
          {busy ? busyLabel : label}
        </motion.span>

        <motion.button
          ref={thumb}
          type="button"
          aria-label={label}
          aria-busy={busy}
          disabled={disabled || busy}
          drag={busy || disabled ? false : "x"}
          dragConstraints={{ left: 0, right: maxX }}
          dragElastic={0.04}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          // Clic de teclado / lector de pantalla (detail = 0) → envía; un clic de ratón no basta.
          onClick={(e) => e.detail === 0 && void commit()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ x }}
          className="rounded-pill bg-primary text-on-primary relative z-10 grid size-14 cursor-grab place-items-center active:cursor-grabbing"
        >
          {busy ? (
            <LoaderCircle aria-hidden className="animate-spin" />
          ) : (
            <motion.span
              aria-hidden
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {maxX > 0 ? <ArrowRight /> : <Check />}
            </motion.span>
          )}
        </motion.button>
      </div>
    </MotionConfig>
  );
}
