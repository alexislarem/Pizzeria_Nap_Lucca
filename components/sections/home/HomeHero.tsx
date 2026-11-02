"use client";

import Link from "next/link";
import { MotionConfig, motion, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { LucaLogo } from "@/components/ui/LucaLogo";
import { LucaWordmark } from "@/components/ui/LucaWordmark";
import { homeHero } from "@/content/home";
import { HeroDoodles } from "./HeroDoodles";
import { useIntroReady } from "./intro-state";

/**
 * Hero del Inicio: bloque amarillo de marca con LUCA en grande y los dibujos de
 * la marca alrededor. Espera a que suba el telón de IntroSplash para hacer su
 * entrada (por eso es de cliente). Todo reacciona al ratón y al toque:
 * letras que saltan, dibujos que se sacuden y un sello que lleva a reservar.
 * `reducedMotion="user"`: con "menos movimiento" se quitan los desplazamientos.
 */

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** Sello circular: texto girando con <textPath> y la mano de LUCA en el centro. */
function ReserveSeal({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute right-[4%] bottom-[6%] z-10 hidden lg:block"
      initial={{ opacity: 0, scale: 0 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: show ? 0.9 : 0 }}
    >
      <Link
        href={homeHero.seal.href}
        aria-label={homeHero.seal.label}
        className="group rounded-pill bg-fg text-primary shadow-soft relative grid size-32 place-items-center transition-transform duration-300 hover:scale-110 active:scale-95 lg:size-36"
      >
        <svg
          viewBox="0 0 200 200"
          aria-hidden
          className="motion-safe:animate-spin-slow absolute inset-0 size-full"
        >
          <defs>
            <path
              id="hero-seal-circle"
              d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
            />
          </defs>
          {/* textLength ≈ circunferencia (2π·76 ≈ 477): el texto cierra el círculo. */}
          <text
            className="font-display fill-current text-[17px] font-extrabold uppercase"
            textLength={474}
            lengthAdjust="spacing"
          >
            <textPath href="#hero-seal-circle">{homeHero.seal.text}</textPath>
          </text>
        </svg>
        {/* La mano sube al pasar el ratón (solo se desplaza: la marca no se rota). */}
        <LucaLogo
          variant="mark"
          title=""
          className="w-[30%] transition-transform duration-300 group-hover:-translate-y-1.5"
        />
      </Link>
    </motion.div>
  );
}

export function HomeHero() {
  const ready = useIntroReady();

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="inicio"
        aria-labelledby="hero-title"
        className="px-3 pt-20 pb-4 md:px-4 md:pt-24"
      >
        <div className="bg-primary text-on-primary relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col items-center justify-center overflow-hidden rounded-xl px-5 py-14 text-center md:py-20">
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          >
            <motion.p
              variants={item}
              className="rounded-pill border-fg font-display border-2 px-4 py-1 text-xs font-extrabold tracking-[0.25em] uppercase md:text-sm"
            >
              {homeHero.eyebrow}
            </motion.p>

            <h1 id="hero-title" className="mt-6 w-[min(78vw,36rem)]">
              <span className="sr-only">LUCA — {homeHero.subtitle}</span>
              <LucaWordmark show={ready} />
            </h1>
            <motion.p
              variants={item}
              aria-hidden
              className="font-display mt-4 text-sm font-extrabold tracking-[0.4em] uppercase sm:text-lg md:text-2xl"
            >
              {homeHero.subtitle}
            </motion.p>

            <motion.p
              variants={item}
              className="font-display mt-8 max-w-md text-2xl leading-none font-black text-balance uppercase md:text-4xl"
            >
              {homeHero.tagline}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <ButtonLink
                href={homeHero.primaryCta.href}
                variant="dark"
                className="transition-all hover:-translate-y-0.5 active:scale-95"
              >
                {homeHero.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={homeHero.secondaryCta.href}
                variant="outline"
                className="transition-all hover:-translate-y-0.5 active:scale-95"
              >
                {homeHero.secondaryCta.label}
              </ButtonLink>
            </motion.div>
          </motion.div>

          <HeroDoodles names={homeHero.doodles} show={ready} />
          <ReserveSeal show={ready} />
        </div>
      </section>
    </MotionConfig>
  );
}
