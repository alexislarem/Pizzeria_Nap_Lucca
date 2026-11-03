"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { LOGO_LETTERS, LOGO_PATHS } from "@/components/ui/LucaLogo";
import { homeIntro } from "@/content/home";
import { DripCurtain } from "./CurtainDrips";
import { rememberIntroSeen, setIntroState, useIntroSkipped } from "./intro-state";

/**
 * Intro de entrada del Inicio (estilo pizza-amici): telón amarillo a pantalla completa.
 *   1. La mano del logo se dibuja trazo a trazo y se rellena.
 *   2. L·U·C·A suben una a una desde debajo de una máscara.
 *   3. Aparece "Pizza Napoletana".
 *   4. El telón sube y el propio amarillo gotea por su borde, como pintura
 *      espesa, mientras descubre el hero. Telón y gotas se pintan en UN solo
 *      canvas (CurtainDrips.tsx); este div solo lleva el logo, sin fondo propio.
 * Sale en cada carga del Inicio (también al recargar); no se repite al volver por el menú.
 * Con "menos movimiento" no aparece. Un clic la salta.
 * Es decorativa (aria-hidden): el título real está en el hero.
 */

/** Tiempo (ms) que el logo queda completo antes de que suba el telón. */
const HOLD_MS = 2300;
/** Curva tipo "telón": arranca suave, acelera y frena al final. */
const CURTAIN: Transition = { duration: 0.95, ease: [0.76, 0, 0.24, 1] };
/** Subida con goteo: algo más lenta al principio para que se vea cómo chorrea. */
const DRIP_LIFT: Transition = { duration: 1.9, ease: [0.5, 0, 0.25, 1] };
/** Progreso de subida (0–1) a partir del cual entra el hero. */
const HERO_AT = 0.8;
const RISE: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

type Phase = "logo" | "exit" | "gone";

export function IntroSplash() {
  const reduceMotion = useReducedMotion();
  const skipped = useIntroSkipped();
  const [phase, setPhase] = useState<Phase>("logo");
  // Progreso de la subida (0 abajo → 1 fuera): mueve el telón y estira las gotas.
  const lift = useMotionValue(0);
  const curtainY = useTransform(lift, (p) => `${-p * 100}%`);
  // `reduceMotion` no decide el render (rompería la hidratación): en carga completa
  // ya lo resolvió el script de <head>; al llegar navegando, lo marca el efecto.
  const hidden = skipped || phase === "gone";

  useEffect(() => {
    if (!skipped && reduceMotion) setIntroState("skip");
  }, [skipped, reduceMotion]);

  // Mientras se ve el logo: página arriba y sin scroll; después, sube el telón.
  useEffect(() => {
    if (hidden || reduceMotion || phase !== "logo") return;
    const root = document.documentElement;
    window.scrollTo(0, 0);
    root.style.overflow = "hidden";
    const timer = window.setTimeout(() => setPhase("exit"), HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      root.style.overflow = "";
    };
  }, [hidden, reduceMotion, phase]);

  // El hero entra cuando el telón casi ha salido: antes, sus textos quedarían
  // cortados por gotas amarillas invisibles sobre el amarillo del hero.
  useEffect(() => {
    if (phase === "gone") {
      setIntroState("done");
      rememberIntroSeen();
      return;
    }
    if (phase !== "exit") return;
    const stop = lift.on("change", (p) => {
      if (p < HERO_AT) return;
      setIntroState("done");
      stop(); // solo una vez
    });
    return stop;
  }, [phase, lift]);

  // Subida del telón con el goteo; al terminar, la intro desaparece.
  useEffect(() => {
    if (phase !== "exit") return;
    const controls = animate(lift, 1, DRIP_LIFT);
    controls.then(() => setPhase("gone"));
    return () => controls.stop();
  }, [phase, lift]);

  if (hidden) return null;

  const exiting = phase === "exit";

  return (
    <>
      {/* Telón + goteo (un solo canvas). Va antes para quedar detrás del logo. */}
      <DripCurtain progress={lift} />
      <motion.div
        aria-hidden
        className="intro-splash text-on-primary fixed inset-0 z-[60] grid cursor-pointer place-items-center"
        style={{ y: curtainY }}
        onClick={() => setPhase("exit")}
      >
        <motion.div
          className="flex w-[min(62vw,19rem)] flex-col items-center"
          initial={false}
          animate={exiting ? { y: "-12vh", opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ ...CURTAIN, duration: 0.7 }}
        >
          <svg
            viewBox="280 405 1150 1550"
            className="h-auto w-full overflow-visible"
            focusable="false"
          >
            {/* 1. La mano: se dibuja el contorno y luego se rellena. */}
            {[LOGO_PATHS.stroke, LOGO_PATHS.hand].map((d, i) => (
              <motion.path
                key={d.slice(0, 12)}
                d={d}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={6}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  pathLength: { duration: 1.1, ease: "easeInOut", delay: 0.15 + i * 0.1 },
                  fillOpacity: { duration: 0.4, delay: 1.05 },
                }}
              />
            ))}

            {/* 2. Las letras suben desde debajo de la máscara, una tras otra. */}
            <defs>
              <clipPath id="intro-letters-clip">
                <rect x="280" y="1500" width="1150" height="460" />
              </clipPath>
            </defs>
            <g clipPath="url(#intro-letters-clip)">
              {LOGO_LETTERS.map((letter, i) => (
                <motion.path
                  key={letter.id}
                  d={letter.d}
                  fill="currentColor"
                  fillRule="evenodd"
                  initial={{ y: 470 }}
                  animate={{ y: 0 }}
                  transition={{ ...RISE, delay: 1.0 + i * 0.09 }}
                />
              ))}
            </g>
          </svg>

          {/* 3. Subtítulo: se abre el espaciado de letras mientras aparece. */}
          <motion.p
            className="font-display mt-4 text-sm font-extrabold whitespace-nowrap uppercase sm:text-base"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.38em" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
          >
            {homeIntro.subtitle}
          </motion.p>
        </motion.div>

        <motion.p
          className="font-display absolute bottom-8 text-xs font-extrabold tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.5, delay: exiting ? 0 : 1.7 }}
        >
          {homeIntro.footnote}
        </motion.p>
      </motion.div>
    </>
  );
}
