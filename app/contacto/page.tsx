import type { Metadata } from "next";
import { ContactoHero } from "@/components/sections/contacto/ContactoHero";
import { ContactoMap } from "@/components/sections/contacto/ContactoMap";
import { ContactoFormSection } from "@/components/sections/contacto/ContactoFormSection";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.contacto.title,
  description: pages.contacto.description,
};

/** Contacto: datos → mapa de Google Maps → formulario de mensaje. */
export default function ContactoPage() {
  return (
    <>
      <ContactoHero />
      <ContactoMap />
      <ContactoFormSection />
    </>
  );
}
