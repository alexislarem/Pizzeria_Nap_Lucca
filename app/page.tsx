import { IntroSplash } from "@/components/sections/home/IntroSplash";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { PhraseStrip } from "@/components/sections/home/PhraseStrip";
import { HomeAbout } from "@/components/sections/home/HomeAbout";
import { HomeProcess } from "@/components/sections/home/HomeProcess";
import { HomeMenu } from "@/components/sections/home/HomeMenu";
import { HomeBrand } from "@/components/sections/home/HomeBrand";
import { HomeReserve } from "@/components/sections/home/HomeReserve";

/**
 * Inicio — identidad propia, sin repetir las otras pestañas:
 * Intro (telón con el logo animado) → Hero (collage de carteles) → Franja → Familia (galería en profundidad) → Proceso (pizza que gira)
 * → Carta (portada que se abre) → Marca (carrusel circular) → Reserva.
 * No hay galería ni historia de la obra: viven en /galeria y /nosotros.
 */
export default function Home() {
  return (
    <>
      <IntroSplash />
      <HomeHero />
      <PhraseStrip />
      <HomeAbout />
      <HomeProcess />
      <HomeMenu />
      <HomeBrand />
      <HomeReserve />
    </>
  );
}
