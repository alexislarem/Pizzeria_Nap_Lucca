import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DepthGallery } from "@/components/ui/DepthGallery";
import { GhostType } from "@/components/ui/GhostType";
import { homeAbout } from "@/content/home";

/**
 * Familia (resumen): galería en profundidad con fotos y vídeos de la familia
 * + título que se escribe solo + un texto breve propio del Inicio.
 * En escritorio el texto se queda fijo mientras las fotos pasan con el scroll;
 * en móvil va primero el texto y después la galería.
 */
export function HomeAbout() {
  return (
    <section
      aria-labelledby="home-about-title"
      // overflow-x-clip: recorta las fotos que la galería 3D desplaza fuera de pantalla
      // en móvil, sin romper el `sticky` (overflow-hidden sí lo rompería).
      className="overflow-x-clip px-4 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <DepthGallery photos={homeAbout.media} className="order-2 md:order-1" />

        <div className="order-1 self-start md:sticky md:top-0 md:order-2 md:flex md:h-svh md:flex-col md:justify-center md:pt-16">
          <Reveal>
            <SectionHeading
              id="home-about-title"
              eyebrow={homeAbout.eyebrow}
              title={
                <GhostType
                  text={homeAbout.title}
                  completions={homeAbout.completions}
                  breakLine
                  // Datos en una línea pequeña: el hueco reservado es de una sola línea.
                  completionClassName="mt-3 text-[0.4em] leading-tight"
                />
              }
            />
            <p className="text-fg-muted mt-6 text-lg leading-relaxed">
              {homeAbout.excerpt}
            </p>
            <ButtonLink href={homeAbout.cta.href} className="mt-8">
              {homeAbout.cta.label}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
