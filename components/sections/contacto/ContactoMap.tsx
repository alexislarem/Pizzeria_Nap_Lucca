import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Doodle } from "@/components/ui/Doodle";
import { Reveal } from "@/components/ui/Reveal";
import { contactoMap } from "@/content/contacto";
import { mapsEmbedSrc, mapsHref } from "@/lib/utils/contact";
import { siteConfig } from "@/site.config";

/**
 * Mapa de Google Maps con la ubicación del local, en un bloque redondeado y
 * con una tarjeta amarilla encima (dirección + "Cómo llegar").
 * `loading="lazy"`: el mapa solo se descarga al acercarse a él con el scroll.
 */
export function ContactoMap() {
  return (
    <section aria-labelledby="contacto-map-title" className="px-4 pb-20 md:pb-28">
      <Reveal className="relative mx-auto max-w-6xl">
        <h2 id="contacto-map-title" className="sr-only">
          {contactoMap.title}
        </h2>
        <div className="border-surface relative aspect-[4/5] overflow-hidden rounded-xl border-8 sm:aspect-[16/10] md:aspect-[16/7]">
          <iframe
            src={mapsEmbedSrc}
            title={contactoMap.iframeTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full"
          />
        </div>

        <div className="bg-primary text-on-primary shadow-soft relative mx-4 -mt-20 max-w-sm rounded-lg p-6 md:absolute md:bottom-8 md:left-8 md:mx-0 md:mt-0">
          <div className="animate-sway absolute -top-10 right-4 w-14" aria-hidden>
            <Doodle name="pizzaAbierta" />
          </div>
          <p className="font-display text-sm font-extrabold tracking-[0.2em] uppercase">
            {contactoMap.eyebrow}
          </p>
          <p className="mt-2 flex items-start gap-2 text-lg font-semibold">
            <MapPin aria-hidden size={22} className="mt-0.5 shrink-0" />
            {siteConfig.contact.address}
          </p>
          <ButtonLink href={mapsHref} variant="dark" size="sm" className="mt-5">
            {contactoMap.cta}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
