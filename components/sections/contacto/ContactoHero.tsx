import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ContactoDetails } from "@/components/sections/contacto/ContactoDetails";
import { contactoPage } from "@/content/contacto";

/** Contacto: título + datos a la izquierda; fachada con una foto pequeña superpuesta a la derecha. */
export function ContactoHero() {
  return (
    <section aria-labelledby="contacto-title" className="px-4 pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Reveal>
            <SectionHeading
              level={1}
              id="contacto-title"
              eyebrow={contactoPage.eyebrow}
              title={contactoPage.title}
              subtitle={contactoPage.subtitle}
              className="md:[&_h1]:text-8xl"
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-10">
            <ContactoDetails />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ButtonLink href={contactoPage.cta.href}>{contactoPage.cta.label}</ButtonLink>
          </Reveal>
        </div>

        {/* El margen inferior deja sitio a la foto pequeña, que sobresale por abajo. */}
        <Reveal delay={0.1} className="relative mb-16 md:sticky md:top-28">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image
              src={contactoPage.photo.src}
              alt={contactoPage.photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-16 -left-4 aspect-square w-2/5 overflow-hidden rounded-lg border-8 border-bg md:-left-10">
            <Image
              src={contactoPage.detail.src}
              alt={contactoPage.detail.alt}
              fill
              sizes="(min-width: 768px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
