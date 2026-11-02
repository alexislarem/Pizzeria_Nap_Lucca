import { ContactoForm } from "@/components/forms/ContactoForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { contactoForm } from "@/content/contacto";

/** Bloque crema con el formulario de contacto: título a la izquierda, campos a la derecha. */
export function ContactoFormSection() {
  return (
    <section aria-labelledby="contacto-form-title" className="px-4 pb-20 md:pb-28">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-xl bg-surface px-6 py-12 text-on-surface md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-14 md:py-16">
        <SectionHeading
          id="contacto-form-title"
          eyebrow={contactoForm.eyebrow}
          title={contactoForm.title}
          subtitle={contactoForm.subtitle}
        />
        <ContactoForm />
      </Reveal>
    </section>
  );
}
