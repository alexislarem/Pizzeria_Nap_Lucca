import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { instagramHandle, isSet, mailHref, mapsHref, telHref } from "@/lib/utils/contact";
import { siteConfig } from "@/site.config";

type Detail = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  /** Texto del enlace secundario bajo el valor (p. ej. "Cómo llegar"). */
  action?: string;
  external?: boolean;
};

const { contact, hours, social } = siteConfig;

const details: Detail[] = [
  { icon: MapPin, label: "Dirección", value: contact.address, href: mapsHref, action: "Cómo llegar", external: true },
  { icon: Phone, label: "Teléfono", value: contact.phone, href: telHref },
  { icon: Mail, label: "Email", value: contact.email, href: mailHref },
  { icon: Instagram, label: "Instagram", value: instagramHandle, href: social.instagram, external: true },
];

// Los horarios solo se muestran cuando estén confirmados en site.config.ts.
const hoursLines = [hours.weekdays, hours.weekend].filter(isSet);

/** Lista de datos de contacto: icono en círculo amarillo, etiqueta pequeña y valor enlazado. */
export function ContactoDetails() {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {details.map(({ icon: Icon, label, value, href, action, external }) => (
        <div key={label} className="flex items-start gap-4 py-5">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-pill bg-primary text-on-primary">
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <dt className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-fg-muted">{label}</dt>
            <dd className="mt-1 text-lg font-semibold break-words">
              {href && !action ? (
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="underline-offset-4 hover:underline"
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
            {href && action && (
              <dd className="mt-1">
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {action}
                  <ArrowUpRight aria-hidden size={16} />
                  {external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
                </a>
              </dd>
            )}
          </div>
        </div>
      ))}

      {hoursLines.length > 0 && (
        <div className="flex items-start gap-4 py-5">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-pill bg-primary text-on-primary">
            <Clock size={20} />
          </span>
          <div>
            <dt className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-fg-muted">Horario</dt>
            {hoursLines.map((line) => (
              <dd key={line} className="mt-1 text-lg font-semibold">
                {line}
              </dd>
            ))}
          </div>
        </div>
      )}
    </dl>
  );
}
