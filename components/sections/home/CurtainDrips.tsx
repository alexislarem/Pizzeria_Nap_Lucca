"use client";

import { useEffect, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * Telón amarillo de la intro con goteo, dibujado como UNA sola forma SVG.
 *
 * Antes eran tres capas (fondo del telón + borde + gotas), cada una con su sombra,
 * y se notaba la unión. Ahora el cuerpo del telón, su borde ondulado, las gotas
 * que cuelgan y las gotas que caen son subtrazados de un único <path>: mismo
 * relleno, una sola sombra, sin costuras.
 *
 * Coordenadas en píxeles reales de la pantalla (viewBox = ancho × alto), así las
 * gotas son redondas en cualquier proporción de pantalla.
 */

type Drip = {
  /** Posición horizontal (fracción del ancho, 0–1). */
  x: number;
  /** Grosor del tallo (fracción del ancho). */
  w: number;
  /** Largo máximo antes de soltar la gota (fracción del alto). */
  len: number;
  /** Progreso de subida (0–1) en el que suelta la gota. */
  at: number;
};

const DRIPS: Drip[] = [
  { x: 0.03, w: 0.022, len: 0.1, at: 0.32 },
  { x: 0.09, w: 0.034, len: 0.22, at: 0.5 },
  { x: 0.16, w: 0.018, len: 0.08, at: 0.28 },
  { x: 0.22, w: 0.04, len: 0.3, at: 0.62 },
  { x: 0.3, w: 0.024, len: 0.14, at: 0.4 },
  { x: 0.37, w: 0.032, len: 0.19, at: 0.55 },
  { x: 0.44, w: 0.02, len: 0.09, at: 0.3 },
  { x: 0.51, w: 0.044, len: 0.34, at: 0.68 },
  { x: 0.59, w: 0.022, len: 0.12, at: 0.36 },
  { x: 0.66, w: 0.036, len: 0.25, at: 0.58 },
  { x: 0.73, w: 0.018, len: 0.1, at: 0.33 },
  { x: 0.8, w: 0.03, len: 0.17, at: 0.46 },
  { x: 0.87, w: 0.04, len: 0.28, at: 0.64 },
  { x: 0.95, w: 0.025, len: 0.13, at: 0.42 },
];

/** Constante para aproximar un cuarto de círculo con una curva Bézier. */
const K = 0.5523;
/** Radio de la curva que une cada gota con el telón (en medios tallos). */
const FILLET = 1.3;
const f = (n: number) => n.toFixed(1);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Gota colgante, como tramo del borde inferior (de derecha a izquierda):
 * curva suave que nace del telón → tallo → bulbo redondo abajo → vuelta.
 * `s` = medio tallo, `b` = radio del bulbo, `r` = radio de la unión con el telón.
 */
function hangingSegment(x: number, top: number, L: number, s0: number, b0: number): string {
  const r0 = s0 * FILLET;
  const min = r0 + 2 * b0;
  // Si aún es corta, todo se escala: empieza como un bultito que se alarga.
  const g = Math.min(1, L / min);
  const s = s0 * g;
  const b = b0 * g;
  const r = r0 * g;
  const cy = top + L - b; // centro del bulbo
  const neck = Math.max(top + r, cy - b * 0.9);
  return [
    `L${f(x + s + r)} ${f(top)}`,
    `C${f(x + s + r * 0.45)} ${f(top)} ${f(x + s)} ${f(top + r * 0.55)} ${f(x + s)} ${f(top + r)}`,
    `L${f(x + s)} ${f(neck)}`,
    `C${f(x + s)} ${f(cy - b * 0.45)} ${f(x + b)} ${f(cy - b * 0.6)} ${f(x + b)} ${f(cy)}`,
    `C${f(x + b)} ${f(cy + b * K)} ${f(x + b * K)} ${f(cy + b)} ${f(x)} ${f(cy + b)}`,
    `C${f(x - b * K)} ${f(cy + b)} ${f(x - b)} ${f(cy + b * K)} ${f(x - b)} ${f(cy)}`,
    `C${f(x - b)} ${f(cy - b * 0.6)} ${f(x - s)} ${f(cy - b * 0.45)} ${f(x - s)} ${f(neck)}`,
    `L${f(x - s)} ${f(top + r)}`,
    `C${f(x - s)} ${f(top + r * 0.55)} ${f(x - s - r * 0.45)} ${f(top)} ${f(x - s - r)} ${f(top)}`,
  ].join(" ");
}

/** Gota suelta (sentido horario, igual que el telón, para que el relleno sume). */
function dropPath(x: number, cy: number, rx: number, ry: number): string {
  if (rx < 0.5) return "";
  return [
    `M${f(x)} ${f(cy - ry)}`,
    `C${f(x + rx * K)} ${f(cy - ry)} ${f(x + rx)} ${f(cy - ry * K)} ${f(x + rx)} ${f(cy)}`,
    `C${f(x + rx)} ${f(cy + ry * K)} ${f(x + rx * K)} ${f(cy + ry)} ${f(x)} ${f(cy + ry)}`,
    `C${f(x - rx * K)} ${f(cy + ry)} ${f(x - rx)} ${f(cy + ry * K)} ${f(x - rx)} ${f(cy)}`,
    `C${f(x - rx)} ${f(cy - ry * K)} ${f(x - rx * K)} ${f(cy - ry)} ${f(x)} ${f(cy - ry)} Z`,
  ].join(" ");
}

/** La forma completa del telón para un progreso de subida p (0 abajo → 1 fuera). */
function curtainPath(p: number, W: number, H: number): string {
  const top = H * (1 - p); // borde inferior del telón
  const sag = Math.min(14, H * 0.016); // ondulación del borde ("derritiéndose")
  const parts = [`M-10 -10 L${f(W + 10)} -10 L${f(W + 10)} ${f(top)}`];
  const drops: string[] = [];
  let prevX = W + 10;

  for (const d of [...DRIPS].sort((a, b) => b.x - a.x)) {
    const x = d.x * W;
    const s = Math.max(4, d.w * W * 0.3); // medio tallo
    const b = s * 1.3; // bulbo algo más gordo que el tallo
    const reach = s * (1 + FILLET); // media anchura de la gota en su unión
    const maxL = d.len * H;

    // Largo actual de la gota que cuelga.
    let L: number;
    if (p < d.at) {
      // Se estira: rápido al principio y se frena (pintura espesa).
      L = maxL * (1 - (1 - p / d.at) ** 2.2);
    } else {
      // Suelta el bulbo y el resto se recoge hacia el telón.
      const t = (p - d.at) / (1 - d.at);
      L = maxL * 0.5 * (1 - clamp01(t * 2.4)) ** 1.5;
      // La gota cae con gravedad desde donde estaba el bulbo, y se alarga al caer.
      const startY = H * (1 - d.at) + maxL - b;
      const cy = startY + t * t * H * 1.6;
      const shrink = 1 - t * 0.5;
      drops.push(dropPath(x, cy, b * shrink, b * shrink * (1 + t * 0.45)));
    }

    // Tramo ondulado del borde hasta esta gota (nunca hacia atrás: evita picos).
    const edgeX = Math.min(x + reach, prevX - 1);
    parts.push(`Q${f((prevX + edgeX) / 2)} ${f(top + sag)} ${f(edgeX)} ${f(top)}`);
    if (L > 0.5) {
      parts.push(hangingSegment(x, top, L, s, b));
      prevX = x - reach;
    } else {
      prevX = edgeX;
    }
  }

  parts.push(`Q${f(prevX / 2)} ${f(top + sag)} -10 ${f(top)} Z`);
  return [parts.join(" "), ...drops].join(" ");
}

/** Tamaño de la ventana (las gotas se dibujan en píxeles reales). */
function useViewport() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

/**
 * Telón + goteo en una sola pieza. `progress` = subida (0 cubre todo → 1 fuera).
 * Se pinta detrás del logo de la intro (mismo z-index, va antes en el DOM).
 */
export function CurtainShape({ progress }: { progress: MotionValue<number> }) {
  const size = useViewport();
  if (!size) return null;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size.w} ${size.h}`}
      className="intro-splash drop-shadow-drip pointer-events-none fixed inset-0 z-[60] size-full overflow-visible"
    >
      {/* `key`: si cambia el tamaño, el trazo se rehace con las medidas nuevas. */}
      <CurtainPath key={`${size.w}x${size.h}`} progress={progress} W={size.w} H={size.h} />
    </svg>
  );
}

function CurtainPath({ progress, W, H }: { progress: MotionValue<number>; W: number; H: number }) {
  const d = useTransform(progress, (p) => curtainPath(p, W, H));
  return <motion.path d={d} className="fill-primary" />;
}
