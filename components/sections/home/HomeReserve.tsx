import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { homeReserve } from "@/content/home";
import { siteConfig } from "@/site.config";
import { mailHref, telHref, whatsappHref } from "@/lib/utils/contact";

const { contact } = siteConfig;

/** Reserva: cierre de la home en amarillo con datos de contacto y la fachada. */
export function HomeReserve() {
  return (
    <section
      aria-labelledby="home-reserve-title"
      className="px-4 pt-16 pb-20 md:pt-24 md:pb-28"
    >
      <Reveal className="bg-primary text-on-primary mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-xl md:grid-cols-2">
        <div className="px-6 py-12 md:px-12 md:py-16">
          <p className="font-display text-sm font-extrabold tracking-[0.25em] uppercase">
            {homeReserve.eyebrow}
          </p>
          <h2
            id="home-reserve-title"
            className="font-display mt-2 text-4xl leading-none font-black uppercase md:text-6xl"
          >
            {homeReserve.title}
          </h2>
          <p className="mt-3 text-lg font-semibold">{homeReserve.subtitle}</p>

          <ul className="mt-8 space-y-3">
            <li className="flex items-start gap-3">
              <MapPin aria-hidden size={20} className="mt-1 shrink-0" />
              <span>{contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle aria-hidden size={20} className="shrink-0" />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-4 hover:underline"
              >
                WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone aria-hidden size={20} className="shrink-0" />
              <a
                href={telHref}
                className="font-semibold underline-offset-4 hover:underline"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail aria-hidden size={20} className="shrink-0" />
              <a
                href={mailHref}
                className="font-semibold underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
            </li>
          </ul>

          <ButtonLink href={homeReserve.cta.href} variant="dark" className="mt-10">
            {homeReserve.cta.label}
          </ButtonLink>
        </div>

        <div className="relative min-h-72">
          <Image
            src={homeReserve.photo.src}
            alt={homeReserve.photo.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
