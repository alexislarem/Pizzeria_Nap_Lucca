"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * Goteo del telón de la intro (referencia: carteles "drip" de design/, el
 * amarillo de marca chorreando por el borde inferior). Al subir el telón, las
 * gotas que cuelgan de su borde se alargan como pintura espesa; cada una suelta
 * una gota redonda que cae mientras el resto se recoge hacia el telón.
 *
 * Coordenadas: lienzo de 100 × 100 a pantalla completa (preserveAspectRatio="none");
 * la y del borde del telón = 100 · (1 − progreso).
 */

type Drip = {
  /** Posición horizontal (0–100). */
  x: number;
  /** Ancho de la gota. */
  w: number;
  /** Largo máximo (en % de pantalla) antes de soltar la gota. */
  len: number;
  /** Progreso de subida (0–1) en el que suelta la gota. */
  at: number;
};

const DRIPS: Drip[] = [
  { x: 3, w: 3, len: 10, at: 0.32 },
  { x: 9, w: 5, len: 22, at: 0.5 },
  { x: 16, w: 2.4, len: 8, at: 0.28 },
  { x: 22, w: 6, len: 30, at: 0.62 },
  { x: 30, w: 3.2, len: 14, at: 0.4 },
  { x: 37, w: 4.5, len: 19, at: 0.55 },
  { x: 44, w: 2.6, len: 9, at: 0.3 },
  { x: 51, w: 6.5, len: 34, at: 0.68 },
  { x: 59, w: 3, len: 12, at: 0.36 },
  { x: 66, w: 5, len: 25, at: 0.58 },
  { x: 73, w: 2.4, len: 10, at: 0.33 },
  { x: 80, w: 4, len: 17, at: 0.46 },
  { x: 87, w: 5.5, len: 28, at: 0.64 },
  { x: 95, w: 3.4, len: 13, at: 0.42 },
];

const f = (n: number) => n.toFixed(2);

/** Gota colgante con la punta redondeada (más gorda abajo, como pintura). */
function hanging(x: number, top: number, w: number, len: number): string {
  if (len < 0.2) return "";
  const h = w / 2;
  const neck = w * 0.32;
  const bulb = Math.min(w * 0.45, len * 0.5);
  const end = top + len;
  return [
    `M${f(x - h)} ${f(top)}`,
    `C${f(x - h)} ${f(top + len * 0.3)} ${f(x - neck)} ${f(top + len * 0.45)} ${f(x - neck)} ${f(end - bulb)}`,
    `C${f(x - neck)} ${f(end - bulb * 0.2)} ${f(x - h * 0.55)} ${f(end)} ${f(x)} ${f(end)}`,
    `C${f(x + h * 0.55)} ${f(end)} ${f(x + neck)} ${f(end - bulb * 0.2)} ${f(x + neck)} ${f(end - bulb)}`,
    `C${f(x + neck)} ${f(top + len * 0.45)} ${f(x + h)} ${f(top + len * 0.3)} ${f(x + h)} ${f(top)}`,
    "Z",
  ].join(" ");
}

/** Gota suelta: elipse (en pantalla se ve redonda o algo alargada). */
function drop(x: number, y: number, r: number): string {
  if (r < 0.05) return "";
  return `M${f(x - r)} ${f(y)} a${f(r)} ${f(r * 1.3)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r * 1.3)} 0 1 0 ${f(-2 * r)} 0 Z`;
}

/** Forma de una gota según el progreso de subida del telón (0 → 1). */
function dripPath({ x, w, len, at }: Drip, p: number): string {
  const top = 100 * (1 - p);
  if (p <= 0) return "M0 0Z";
  if (p < at) {
    // Se estira: crece rápido al principio y se ralentiza (pintura espesa).
    const grow = 1 - (1 - p / at) ** 2;
    return hanging(x, top, w, len * grow) || "M0 0Z";
  }
  // Suelta la gota: lo que cuelga se recoge y la gota cae.
  const t = (p - at) / (1 - at); // 0 → 1 tras soltarla
  const rest = hanging(x, top, w, len * 0.55 * Math.max(0, 1 - t * 2.2));
  const fallStart = 100 * (1 - at) + len; // donde estaba la punta al soltarse
  const ball = drop(x, fallStart + t * t * 140, w * 0.32 * Math.max(0, 1 - t * 0.6));
  return [rest, ball].filter(Boolean).join(" ") || "M0 0Z";
}

function DripPath({ drip, progress }: { drip: Drip; progress: MotionValue<number> }) {
  const d = useTransform(progress, (p) => dripPath(drip, p));
  return <motion.path d={d} className="fill-primary" />;
}

/** Borde del telón: una ondulación suave para que las gotas nazcan "derritiéndose". */
const EDGE_PATH = (() => {
  const parts = ["M0 0 L100 0 L100 2.5"];
  let prev = 100;
  for (const { x, w } of [...DRIPS].reverse()) {
    parts.push(`Q${f((prev + x + w / 2) / 2)} 3.6 ${f(x + w / 2)} 2.6`);
    parts.push(`C${f(x + w / 2)} 6 ${f(x - w / 2)} 6 ${f(x - w / 2)} 2.6`);
    prev = x - w / 2;
  }
  parts.push(`Q${f(prev / 2)} 3.6 0 2.5 Z`);
  return parts.join(" ");
})();

/** Borde ondulado: se pinta dentro del telón (top-full) y sube con él. */
export function DripEdge() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className="drop-shadow-drip absolute inset-x-0 top-full -mt-px h-[6vh] w-full"
    >
      <path d={EDGE_PATH} className="fill-primary" />
    </svg>
  );
}

/** Gotas que cuelgan del telón mientras sube. `progress` = subida del telón (0 → 1). */
export function CurtainDrips({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="drop-shadow-drip pointer-events-none fixed inset-0 z-[60] size-full"
    >
      {DRIPS.map((drip) => (
        <DripPath key={drip.x} drip={drip} progress={progress} />
      ))}
    </svg>
  );
}
