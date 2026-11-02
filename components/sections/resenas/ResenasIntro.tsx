import { Instagram, MapPin, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Doodle } from "@/components/ui/Doodle";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resenasPage, reviewSources } from "@/content/resenas";

/** Posición de las 5 estrellas que flotan alrededor del dibujo (con retraso propio cada una). */
const STARS = [
  "left-[8%] top-[12%] size-9",
  "right-[10%] top-[8%] size-12",
  "right-[6%] top-[46%] size-8",
  "left-[34%] bottom-[5%] size-11",
  "right-[22%] bottom-[8%] size-7",
] as const;

/**
 * Cabecera de Reseñas: título y accesos (escribir, Google Maps, Instagram) a la
 * izquierda; a la derecha, un bloque amarillo con la mano que sujeta la porción
 * y estrellas que se balancean (todo CSS: no necesita JavaScript).
 */
export function ResenasIntro() {
  const [main, ...extra] = resenasPage.doodles;

  return (
    <section
      aria-labelledby="resenas-title"
      className="px-4 pt-28 pb-10 md:pt-36 md:pb-16"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <Reveal>
          <SectionHeading
            level={1}
            id="resenas-title"
            eyebrow={resenasPage.eyebrow}
            title={resenasPage.title}
            subtitle={resenasPage.intro}
            className="md:[&_h1]:text-8xl"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={resenasPage.writeCta.href}>
              {resenasPage.writeCta.label}
            </ButtonLink>
            <ButtonLink href={reviewSources.google.href} variant="outline">
              <MapPin aria-hidden size={18} />
              {reviewSources.google.cta}
            </ButtonLink>
            <ButtonLink href={reviewSources.instagram.href} variant="outline">
              <Instagram aria-hidden size={18} />
              {reviewSources.instagram.cta}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-primary relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl">
            <div className="animate-sway absolute inset-x-[22%] top-[14%] [animation-duration:5s]">
              {main && <Doodle name={main} />}
            </div>
            {extra.map((name, i) => (
              <div
                key={name}
                className={
                  i === 0
                    ? "animate-sway absolute bottom-[6%] left-[8%] w-[16%] [animation-delay:-1.2s]"
                    : "animate-sway absolute top-[30%] left-[6%] w-[9%] [animation-delay:-2s]"
                }
              >
                <Doodle name={name} />
              </div>
            ))}
            {STARS.map((position, i) => (
              <Star
                key={position}
                aria-hidden
                strokeWidth={1.6}
                style={{ animationDelay: `${-i * 0.7}s` }}
                className={`animate-sway text-fg fill-surface absolute ${position}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
