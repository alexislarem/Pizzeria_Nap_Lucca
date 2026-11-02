"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type WarmTooltipProps = {
  /** Texto del globo. */
  content: ReactNode;
  /** Lo que se ve (icono, chip…). Va dentro de un <button> para que tenga foco. */
  children: ReactNode;
  /** Nombre accesible del botón si `children` es solo un icono. */
  label?: string;
  side?: "top" | "bottom";
  className?: string;
};

/**
 * Tooltip "cálido": globo amarillo de marca que aparece con un muelle y un
 * pequeño giro, como una nota pegada. Se abre con ratón, foco (teclado) o
 * toque; se cierra al salir, con Escape o tocando fuera.
 */
export function WarmTooltip({
  content,
  children,
  label,
  side = "top",
  className,
}: WarmTooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapper = useRef<HTMLSpanElement>(null);

  // Tocar fuera cierra el globo (en táctil no hay "salir con el ratón").
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const fromY = side === "top" ? 8 : -8;

  return (
    <MotionConfig reducedMotion="user">
      <span
        ref={wrapper}
        className={cn("relative inline-flex", className)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      >
        <button
          type="button"
          aria-label={label}
          aria-describedby={open ? id : undefined}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="rounded-pill inline-flex cursor-help items-center"
        >
          {children}
        </button>

        <AnimatePresence>
          {open && (
            <motion.span
              id={id}
              role="tooltip"
              className={cn(
                "bg-primary text-on-primary shadow-soft pointer-events-none absolute left-1/2 z-30 w-max max-w-60 rounded-md px-3.5 py-2 text-center text-sm leading-snug font-semibold",
                side === "top" ? "bottom-full mb-3" : "top-full mt-3"
              )}
              style={{ x: "-50%" }}
              initial={{ opacity: 0, y: fromY, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
              exit={{ opacity: 0, y: fromY / 2, scale: 0.9, rotate: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              {content}
              {/* Pico del globo. */}
              <span
                aria-hidden
                className={cn(
                  "bg-primary absolute left-1/2 size-3 -translate-x-1/2 rotate-45",
                  side === "top" ? "-bottom-1.5" : "-top-1.5"
                )}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </MotionConfig>
  );
}
