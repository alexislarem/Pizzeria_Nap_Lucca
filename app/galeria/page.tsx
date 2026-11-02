import type { Metadata } from "next";
import { GaleriaIntro } from "@/components/sections/galeria/GaleriaIntro";
import { GaleriaGrid } from "@/components/sections/galeria/GaleriaGrid";
import { HomeReserve } from "@/components/sections/home/HomeReserve";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.galeria.title,
  description: pages.galeria.description,
};

/** Galería: título → filtros por tema + mosaico de fotos (con visor) → reserva. */
export default function GaleriaPage() {
  return (
    <>
      <GaleriaIntro />
      <GaleriaGrid />
      <HomeReserve />
    </>
  );
}
