import Link from "next/link";
import { siteConfig } from "@/site.config";
import { mailHref, telHref } from "@/lib/utils/contact";
import { legalDocs } from "@/content/legal";
import { LucaLogo } from "@/components/ui/LucaLogo";

/**
 * Footer: la página sigue siendo blanca; el footer es un bloque amarillo
 * de esquinas orgánicas "apoyado" sobre ese fondo.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { contact, social, hours } = siteConfig;
  const hoursLines = hours.summary;

  const socials = [
    { label: "Instagram", href: social.instagram },
    { label: "Facebook", href: social.facebook },
    { label: "TikTok", href: social.tiktok },
  ].filter((s) => s.href && !s.href.startsWith("TODO"));

  return (
    <footer className="px-4 pb-4">
      <div className="bg-primary text-on-primary mx-auto max-w-6xl rounded-xl px-6 py-12 md:px-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="max-w-xs">
            <LucaLogo className="w-28" />
            <p className="mt-4 text-sm leading-relaxed">{siteConfig.tagline}</p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-lg font-extrabold">Ven a vernos</h2>
            <address className="space-y-1 text-sm not-italic">
              <p>{contact.address}</p>
              <p>
                <a href={telHref} className="underline-offset-4 hover:underline">
                  {contact.phone}
                </a>
              </p>
              <p>
                <a href={mailHref} className="underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </p>
              {hoursLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
          </div>

          <div>
            <h2 className="font-display mb-3 text-lg font-extrabold">Síguenos</h2>
            <ul className="space-y-1 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-on-primary/20 mt-12 flex flex-col gap-3 border-t pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Grazie mille por venir.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legalDocs.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={`/${doc.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
