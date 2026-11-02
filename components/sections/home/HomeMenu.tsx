import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollExpand } from "@/components/ui/ScrollExpand";
import { homeMenu } from "@/content/home";

/**
 * Carta (resumen): foto que se abre a pantalla completa con el scroll
 * (ScrollExpand) con el título; al abrirse aparecen subtítulo y botón a /carta.
 * Los platos ya no se muestran aquí: se ven en la página de la carta.
 */
export function HomeMenu() {
  return (
    <section aria-labelledby="home-menu-title">
      <ScrollExpand
        photo={homeMenu.cover}
        scrollHint={
          <ChevronDown
            aria-hidden
            className="size-7 animate-bounce motion-reduce:animate-none"
          />
        }
        title={
          <div>
            <p className="font-display mb-3 text-sm font-extrabold tracking-[0.2em] uppercase md:text-base">
              {homeMenu.eyebrow}
            </p>
            <h2
              id="home-menu-title"
              className="font-display text-5xl leading-none font-black uppercase md:text-8xl"
            >
              {homeMenu.title}
            </h2>
          </div>
        }
      >
        <p className="font-display text-4xl leading-none font-black uppercase md:text-7xl">
          {homeMenu.subtitle}
        </p>
        <ButtonLink href={homeMenu.cta.href}>{homeMenu.cta.label}</ButtonLink>
      </ScrollExpand>
    </section>
  );
}
