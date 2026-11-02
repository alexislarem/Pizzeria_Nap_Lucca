import { Info } from "lucide-react";
import { ResenaForm } from "@/components/forms/ResenaForm";
import { Doodle } from "@/components/ui/Doodle";
import { Reveal } from "@/components/ui/Reveal";
import { WarmTooltip } from "@/components/ui/WarmTooltip";
import { resenaForm } from "@/content/resenas";

/**
 * Cuadro "Cuéntanos tu visita": bloque crema con el título (y un tooltip que
 * explica la revisión previa) a la izquierda y el formulario a la derecha.
 * `id="escribir"` = destino del botón "Escribir una reseña" de la cabecera.
 */
export function ResenaFormSection() {
  return (
    <section
      id="escribir"
      aria-labelledby="resena-form-title"
      className="scroll-mt-24 px-4 pb-20 md:pb-28"
    >
      <Reveal className="bg-surface text-on-surface relative mx-auto grid max-w-6xl grid-cols-1 gap-10 overflow-hidden rounded-xl px-6 py-12 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-14 md:py-16">
        <div>
          <p className="font-display text-fg-muted mb-2 text-sm font-extrabold tracking-[0.2em] uppercase">
            {resenaForm.eyebrow}
          </p>
          <div className="flex items-start gap-2">
            <h2
              id="resena-form-title"
              className="font-display text-4xl leading-none font-black uppercase md:text-6xl"
            >
              {resenaForm.title}
            </h2>
            <WarmTooltip
              content={resenaForm.reviewTooltip}
              label={resenaForm.reviewTooltip}
              side="bottom"
            >
              <Info
                aria-hidden
                size={22}
                className="text-fg-muted hover:text-fg mt-1 transition-colors"
              />
            </WarmTooltip>
          </div>
          <p className="text-fg-muted mt-3 text-lg">{resenaForm.subtitle}</p>
          <div className="animate-sway mt-10 hidden w-40 [animation-duration:4s] md:block">
            <Doodle name="espaguetis" className="bg-luca-brown" />
          </div>
        </div>
        <ResenaForm />
      </Reveal>
    </section>
  );
}
