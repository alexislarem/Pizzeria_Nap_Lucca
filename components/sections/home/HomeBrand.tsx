import { Reveal } from "@/components/ui/Reveal";
import { BrandCarousel } from "@/components/sections/home/BrandCarousel";
import { homeBrand } from "@/content/home";

/**
 * Marca: cilindro 3D con los carteles de la identidad visual de LUCA
 * alternados con fotos de inspiración. Gira solo (con botón de pausa), se
 * arrastra y responde a las flechas del teclado.
 * TODO: sustituir o combinar con el vídeo de marca (Figma + Framer).
 */
export function HomeBrand() {
  return (
    <section aria-labelledby="home-brand-title" className="py-16 md:py-24">
      <Reveal className="px-4 text-center">
        <p className="font-display text-fg-muted text-sm font-extrabold tracking-[0.2em] uppercase">
          {homeBrand.eyebrow}
        </p>
        <h2
          id="home-brand-title"
          className="font-display mt-2 text-4xl leading-none font-black uppercase md:text-6xl"
        >
          {homeBrand.title}
        </h2>
        <p className="text-fg-muted mx-auto mt-3 max-w-xl text-lg">
          {homeBrand.subtitle}
        </p>
      </Reveal>

      <div className="mt-2">
        <BrandCarousel items={homeBrand.items} />
      </div>
    </section>
  );
}
