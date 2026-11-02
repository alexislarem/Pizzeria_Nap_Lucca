import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WiggleDoodle } from "@/components/ui/WiggleDoodle";
import { cartaIntro } from "@/content/carta";

/** Colocación de los dibujos (va con el diseño): junto al título y en las esquinas de la foto. */
const DOODLE_LAYOUT = [
  {
    rotate: -10,
    className: "absolute -top-8 right-2 w-14 md:-top-16 md:right-8 md:w-20",
  },
  { rotate: 8, className: "absolute -bottom-8 -left-3 z-10 w-16 md:-left-8 md:w-24" },
  { rotate: -6, className: "absolute -top-10 right-0 z-10 w-20 md:w-28 xl:-right-8" },
] as const;

/**
 * Cabecera de la Carta: título grande y foto de la Margherita, con dibujos de
 * la marca que flotan y se sacuden al tocarlos (como en el Inicio).
 */
export function CartaIntro() {
  const [titleDoodle, ...photoDoodles] = cartaIntro.doodles;

  return (
    <section aria-labelledby="carta-title" className="px-4 pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[1fr_1fr] md:gap-16">
        <Reveal className="relative">
          <SectionHeading
            level={1}
            id="carta-title"
            eyebrow={cartaIntro.eyebrow}
            title={cartaIntro.title}
            subtitle={cartaIntro.subtitle}
            className="md:[&_h1]:text-8xl"
          />
          {titleDoodle && <WiggleDoodle name={titleDoodle} {...DOODLE_LAYOUT[0]} />}
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={cartaIntro.photo.src}
              alt={cartaIntro.photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {photoDoodles.map((name, i) => {
            const layout = DOODLE_LAYOUT[i + 1] ?? DOODLE_LAYOUT[1];
            return (
              <WiggleDoodle
                key={name}
                name={name}
                index={i + 1}
                rotate={layout.rotate}
                className={layout.className}
              />
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
