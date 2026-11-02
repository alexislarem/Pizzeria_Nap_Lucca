"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { contactoMap } from "@/content/contacto";
import { mapsEmbedSrc, mapsHref } from "@/lib/utils/contact";
import { siteConfig } from "@/site.config";

/** Clave del navegador donde se recuerda que el visitante aceptó cargar el mapa. */
const STORAGE_KEY = "luca:maps-ok";

/** Chincheta de "aquí estamos": ondas que laten bajo el pin (CSS animate-ping de Tailwind). */
function LocationPin() {
  return (
    <span aria-hidden className="relative grid size-20 place-items-center">
      <span className="bg-primary/40 absolute bottom-1 h-4 w-12 rounded-[50%] motion-safe:animate-ping" />
      <span className="bg-primary/60 absolute bottom-2 h-2.5 w-7 rounded-[50%]" />
      <MapPin
        size={52}
        strokeWidth={1.8}
        className="text-fg fill-primary relative -translate-y-2"
      />
    </span>
  );
}

/**
 * Mapa de Google Maps con la ubicación del local. Google instala cookies
 * propias, así que el mapa NO se carga hasta que el visitante pulsa
 * "Ver mapa" (normativa de cookies); la elección se recuerda en su navegador.
 * Encima, una tarjeta amarilla con la dirección y "Cómo llegar".
 */
export function ContactoMap() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      setAllowed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Almacenamiento bloqueado: se vuelve a preguntar en cada visita.
    }
  }, []);

  const allow = () => {
    setAllowed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sin almacenamiento: el mapa se carga igual en esta visita.
    }
  };

  return (
    <section aria-labelledby="contacto-map-title" className="px-4 pb-20 md:pb-28">
      <Reveal className="relative mx-auto max-w-6xl">
        <h2 id="contacto-map-title" className="sr-only">
          {contactoMap.title}
        </h2>
        <div className="border-surface bg-surface relative aspect-[4/5] overflow-hidden rounded-xl border-8 sm:aspect-[16/10] md:aspect-[16/7]">
          {allowed ? (
            <iframe
              src={mapsEmbedSrc}
              title={contactoMap.iframeTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full"
            />
          ) : (
            // Aviso previo con una chincheta de localización (no se descarga nada de Google hasta aceptar).
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="flex max-w-sm flex-col items-center md:-translate-y-6">
                <LocationPin />
                <p className="text-fg-muted mt-4">{contactoMap.consent.text}</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={allow}
                    className="rounded-pill bg-fg text-primary hover:bg-fg/85 px-6 py-3 font-semibold transition-colors"
                  >
                    {contactoMap.consent.load}
                  </button>
                  <Link
                    href="/cookies"
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    {contactoMap.consent.more}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-primary text-on-primary shadow-soft relative mx-4 -mt-20 max-w-sm rounded-lg p-6 md:absolute md:bottom-8 md:left-8 md:mx-0 md:mt-0">
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
