import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ReservaForm } from "@/components/forms/ReservaForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { reservaForm, reservarPage } from "@/content/contacto";
import { mailHref, mapsHref, telHref, whatsappHref } from "@/lib/utils/contact";
import { siteConfig } from "@/site.config";

const { contact } = siteConfig;

type Option = { icon: LucideIcon; label: string; value: string; href: string; external?: boolean };

const options: Option[] = [
  {
    icon: MessageCircle,
    label: reservarPage.options.whatsapp.title,
    value: reservarPage.options.whatsapp.value,
    href: whatsappHref,
    external: true,
  },
  { icon: Phone, label: reservarPage.options.phone.title, value: contact.phone, href: telHref },
  { icon: Mail, label: reservarPage.options.email.title, value: contact.email, href: mailHref },
];

/** Reservar: título + formulario a la izquierda; foto y alternativas (WhatsApp, llamar, email, dirección) a la derecha. */
export function ReservarHero() {
  return (
    <section aria-labelledby="reservar-title" className="px-4 pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[1.25fr_1fr] md:gap-16">
        <div>
          <Reveal>
            <SectionHeading
              level={1}
              id="reservar-title"
              eyebrow={reservarPage.eyebrow}
              title={reservarPage.title}
              subtitle={reservarPage.intro}
              className="md:[&_h1]:text-8xl"
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-10 rounded-xl bg-surface p-6 text-on-surface md:p-10">
            <h2 className="mb-6 font-display text-2xl font-black uppercase leading-none md:text-3xl">{reservaForm.title}</h2>
            <ReservaForm />
          </Reveal>
        </div>

        <aside aria-labelledby="reservar-alt-title" className="md:sticky md:top-28 md:self-start">
          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src={reservarPage.photo.src}
              alt={reservarPage.photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.15} className="mt-8">
            <h2 id="reservar-alt-title" className="font-display text-xl font-black uppercase">
              {reservarPage.options.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {options.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="flex items-center gap-3 font-semibold underline-offset-4 hover:underline">
                    <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill bg-primary text-on-primary">
                      <Icon size={18} />
                    </span>
                    <span className="break-all">
                      <span className="sr-only">{label}: </span>
                      {value}
                      {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-fg-muted underline-offset-4 hover:underline"
                >
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill border-2 border-border">
                    <MapPin size={18} />
                  </span>
                  <span>
                    {contact.address}
                    <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
                  </span>
                </a>
              </li>
            </ul>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
