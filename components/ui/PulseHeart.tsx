"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Clave del navegador donde se recuerdan los "me gusta" de este visitante. */
const STORAGE_KEY = "luca:likes";

function readLikes(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function writeLike(id: string, liked: boolean) {
  try {
    const next = new Set(readLikes());
    if (liked) next.add(id);
    else next.delete(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Modo privado o almacenamiento bloqueado: el corazón funciona igual, solo no se recuerda.
  }
}

/** 6 chispas repartidas en círculo alrededor del corazón. */
const SPARKS = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

type PulseHeartProps = {
  /** Identificador estable de lo que se marca (p. ej. el id de la reseña). */
  id: string;
  /** "Me gusta" de partida (los que ya tenga la reseña). */
  count?: number;
  label: string;
};

/**
 * Corazón "me gusta" con latido: al marcarlo se rellena en rojo, late, suelta
 * un anillo y unas chispas, y el contador sube con un pequeño salto.
 * El "me gusta" se recuerda solo en este navegador (localStorage).
 */
export function PulseHeart({ id, count = 0, label }: PulseHeartProps) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);

  // Al montar, recupera si este visitante ya le dio "me gusta".
  useEffect(() => {
    setLiked(readLikes().includes(id));
  }, [id]);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    writeLike(id, next);
    if (next) setBurst((n) => n + 1);
  };

  const total = count + (liked ? 1 : 0);

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        aria-pressed={liked}
        aria-label={`${label} (${total})`}
        onClick={toggle}
        className="group rounded-pill hover:bg-accent/10 inline-flex items-center gap-1.5 px-2 py-1 transition-colors"
      >
        <span className="relative grid size-6 place-items-center">
          {/* Anillo y chispas: se vuelven a lanzar con cada "me gusta" (key = burst). */}
          <AnimatePresence>
            {liked && burst > 0 && (
              <motion.span
                key={burst}
                aria-hidden
                className="pointer-events-none absolute inset-0"
              >
                <motion.span
                  className="border-accent absolute inset-0 rounded-full border-2"
                  initial={{ scale: 0.4, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                {SPARKS.map((angle) => (
                  <motion.span
                    key={angle}
                    className={cn(
                      "absolute top-1/2 left-1/2 -mt-0.75 -ml-0.75 size-1.5 rounded-full",
                      angle > Math.PI ? "bg-primary" : "bg-accent"
                    )}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * 20,
                      y: Math.sin(angle) * 20,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.span
            key={liked ? `on-${burst}` : "off"}
            className="relative"
            initial={liked ? { scale: 0.6 } : false}
            animate={{ scale: liked ? [0.6, 1.35, 0.95, 1.1, 1] : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Heart
              aria-hidden
              size={22}
              className={cn(
                "transition-colors",
                liked
                  ? "fill-accent text-accent"
                  : "text-fg-muted group-hover:text-accent"
              )}
            />
          </motion.span>
        </span>
        <span className="relative h-5 min-w-4 overflow-hidden text-sm font-semibold tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={total}
              className="block"
              initial={{ y: liked ? 14 : -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: liked ? -14 : 14, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {total}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </MotionConfig>
  );
}
