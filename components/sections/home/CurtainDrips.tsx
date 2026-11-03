"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * Telón amarillo de la intro que sube goteando (efecto "pintura / queso").
 *
 * Por qué un <canvas> y no capas HTML/SVG:
 *   antes había un div amarillo + un SVG con sombra; al empezar la subida el div
 *   se apagaba y la sombra pintaba una línea oscura sobre el hero (también
 *   amarillo), así que se notaba "una capa por encima". Aquí TODO (telón, borde
 *   ondulado, gotas colgantes y gotas que caen) se rellena con UNA sola llamada
 *   a `fill()`: sin uniones ni sombras. Un contorno negro fino (como los dibujos
 *   de marca) marca el borde y las gotas para separarlo del hero, también amarillo.
 *
 * Colores: se leen de las clases `bg-primary` y `text-fg` del canvas (tokens).
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
].sort((a, b) => b.x - a.x); // el borde se recorre de derecha a izquierda

/** Constante para aproximar un cuarto de círculo con una curva Bézier. */
const K = 0.5523;
/** Radio de la curva que une cada gota con el telón (en medios tallos). */
const FILLET = 1.3;
/** Grosor (px) del contorno del borde inferior y las gotas. */
const LINE = 3;
/** Margen fuera de pantalla para los lados del telón (mayor que el contorno). */
const OUT = 8;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Gota colgante como tramo del borde (de derecha a izquierda):
 * curva que nace del telón → tallo → bulbo redondo → vuelta. Devuelve el
 * extremo izquierdo, donde sigue el borde.
 */
function hangingDrip(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  L: number,
  s0: number,
  b0: number
): number {
  const r0 = s0 * FILLET;
  // Si aún es corta, todo se escala: empieza como un bultito que se alarga.
  const g = Math.min(1, L / (r0 + 2 * b0));
  const s = s0 * g;
  const b = b0 * g;
  const r = r0 * g;
  const cy = top + L - b; // centro del bulbo
  const neck = Math.max(top + r, cy - b * 0.9);

  ctx.lineTo(x + s + r, top);
  ctx.bezierCurveTo(x + s + r * 0.45, top, x + s, top + r * 0.55, x + s, top + r);
  ctx.lineTo(x + s, neck);
  ctx.bezierCurveTo(x + s, cy - b * 0.45, x + b, cy - b * 0.6, x + b, cy);
  ctx.bezierCurveTo(x + b, cy + b * K, x + b * K, cy + b, x, cy + b);
  ctx.bezierCurveTo(x - b * K, cy + b, x - b, cy + b * K, x - b, cy);
  ctx.bezierCurveTo(x - b, cy - b * 0.6, x - s, cy - b * 0.45, x - s, neck);
  ctx.lineTo(x - s, top + r);
  ctx.bezierCurveTo(x - s, top + r * 0.55, x - s - r * 0.45, top, x - s - r, top);

  return x - s - r;
}

/** Dibuja el telón completo para un progreso p (0 cubre todo → 1 fuera) y un tiempo t (s). */
function drawCurtain(
  ctx: CanvasRenderingContext2D,
  p: number,
  t: number,
  W: number,
  H: number,
  fill: string,
  line: string
) {
  ctx.clearRect(0, 0, W, H);

  // Ondulación del borde ("derritiéndose"); se mueve despacio con el tiempo.
  const sag = Math.min(14, H * 0.016);
  // Recorrido algo mayor que la pantalla: en p=0 el borde queda por debajo
  // (no asoma nada) y en p=1 por encima (no queda ninguna franja).
  const top = -3 * sag + (H + 6 * sag) * (1 - p);

  const drops: { x: number; y: number; rx: number; ry: number }[] = [];

  ctx.beginPath();
  // Los lados y el techo quedan fuera de pantalla: así el contorno solo se ve abajo.
  ctx.moveTo(-OUT, -OUT);
  ctx.lineTo(W + OUT, -OUT);
  ctx.lineTo(W + OUT, top);
  let prevX = W + OUT;

  DRIPS.forEach((d, i) => {
    const x = d.x * W;
    const s = Math.min(26, Math.max(4, d.w * W * 0.3)); // medio tallo
    const b = s * 1.3; // bulbo algo más gordo que el tallo
    const maxL = d.len * H;

    let L: number;
    if (p < d.at) {
      // Se estira: rápido al principio y se frena (pintura espesa) + leve bamboleo.
      L = maxL * (1 - (1 - p / d.at) ** 2.2) * (1 + 0.03 * Math.sin(t * 5 + i));
    } else {
      // Suelta el bulbo y el resto se recoge hacia el telón.
      const k = (p - d.at) / (1 - d.at);
      L = maxL * 0.5 * (1 - clamp01(k * 2.4)) ** 1.5;
      // La gota cae con gravedad desde donde estaba el bulbo y se alarga al caer.
      const shrink = 1 - k * 0.5;
      drops.push({
        x,
        y: H * (1 - d.at) + maxL - b + k * k * H * 1.6,
        rx: b * shrink,
        ry: b * shrink * (1 + k * 0.45),
      });
    }

    // Tramo ondulado del borde hasta esta gota (nunca hacia atrás: evita picos).
    const edgeX = Math.min(x + s * (1 + FILLET), prevX - 1);
    const mid = (prevX + edgeX) / 2;
    const wave = 0.8 + 0.4 * Math.sin(mid * 0.013 + t * 2.2);
    ctx.quadraticCurveTo(mid, top + sag * wave, edgeX, top);

    if (L > 3) { // más corta no se dibuja: evita un puntito en el contorno
      prevX = hangingDrip(ctx, x, top, L, s, b);
    } else {
      prevX = edgeX;
    }
  });

  ctx.quadraticCurveTo(prevX / 2, top + sag, -OUT, top);
  ctx.closePath();

  // Gotas sueltas: subtrazados del MISMO path → se rellenan a la vez, sin costuras.
  for (const drop of drops) {
    if (drop.rx < 0.5 || drop.y - drop.ry > H) continue;
    ctx.moveTo(drop.x + drop.rx, drop.y);
    ctx.ellipse(drop.x, drop.y, drop.rx, drop.ry, 0, 0, Math.PI * 2);
  }

  ctx.fillStyle = fill;
  ctx.fill();

  // Contorno del borde y de las gotas (como los dibujos de marca): separa el
  // telón del hero, que es del mismo amarillo, sin sombras ni capas extra.
  ctx.strokeStyle = line;
  ctx.lineWidth = LINE;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

/**
 * Telón + goteo. `progress` = subida (0 cubre todo → 1 fuera).
 * Hasta que pinta el primer fotograma, el propio canvas tiene fondo amarillo
 * (viene así del servidor), así nunca hay un parpadeo del hero.
 */
export function DripCurtain({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Colores de los tokens, leídos de las clases del canvas antes de quitar el fondo:
    // `bg-primary` = relleno amarillo, `text-fg` = contorno negro de marca.
    const styles = getComputedStyle(canvas);
    const fill = styles.backgroundColor;
    const line = styles.color;

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let first = true;
    const frame = (now: number) => {
      drawCurtain(ctx, progress.get(), (now - start) / 1000, W, H, fill, line);
      if (first) {
        // El canvas ya se pinta solo: fuera el fondo de reserva (mismo fotograma).
        canvas.style.backgroundColor = "transparent";
        first = false;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="intro-splash bg-primary text-fg pointer-events-none fixed inset-0 z-[60] size-full"
    />
  );
}
