import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { galeriaIntro } from "@/content/galeria";

/** Cabecera de la Galería: solo el título grande; las fotos hablan debajo. */
export function GaleriaIntro() {
  return (
    <section aria-labelledby="galeria-title" className="px-4 pt-28 pb-6 md:pt-36 md:pb-8">
      <Reveal className="mx-auto max-w-6xl">
        <SectionHeading
          level={1}
          id="galeria-title"
          eyebrow={galeriaIntro.eyebrow}
          title={galeriaIntro.title}
          subtitle={galeriaIntro.subtitle}
          className="md:[&_h1]:text-8xl"
        />
      </Reveal>
    </section>
  );
}
