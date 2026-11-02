"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollText } from "@/components/ui/ScrollText";
import { nosotrosClosing } from "@/content/nosotros";

/**
 * Cierre: bloque negro con la bienvenida y la bendición final en gigante, que se
 * ilumina palabra a palabra con el scroll. La foto de bienvenida entra con un muelle
 * y "saluda" (se inclina y se acerca) al pasar el ratón o al tocarla.
 */
export function NosotrosClosing() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="closing-title"
        className="px-4 pt-12 pb-20 md:pt-20 md:pb-28"
      >
        <div className="bg-fg text-bg mx-auto grid max-w-6xl items-center gap-12 overflow-hidden rounded-xl px-6 py-14 md:grid-cols-[1.5fr_1fr] md:px-14 md:py-20">
          <div>
            <h2
              id="closing-title"
              className="font-display text-bg/80 text-xl leading-tight font-black uppercase md:text-2xl"
            >
              {nosotrosClosing.lead}
            </h2>
            <ScrollText
              text={nosotrosClosing.blessing}
              className="font-display text-primary mt-6 text-5xl leading-[0.95] font-black uppercase md:text-7xl"
            />
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink
                href={nosotrosClosing.primaryCta.href}
                className="transition-all hover:-translate-y-0.5 active:scale-95"
              >
                {nosotrosClosing.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={nosotrosClosing.secondaryCta.href}
                variant="outline"
                className="transition-all hover:-translate-y-0.5 active:scale-95"
              >
                {nosotrosClosing.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <motion.div
            data-reveal
            className="rounded-pill border-primary relative mx-auto aspect-square w-full max-w-80 cursor-pointer overflow-hidden border-8"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            whileHover={{ scale: 1.06, rotate: -4 }}
            whileTap={{ scale: 1.06, rotate: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <Image
              src={nosotrosClosing.photo.src}
              alt={nosotrosClosing.photo.alt}
              fill
              sizes="20rem"
              className="object-cover object-top"
            />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
