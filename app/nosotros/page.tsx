import type { Metadata } from "next";
import { NosotrosIntro } from "@/components/sections/nosotros/NosotrosIntro";
import { NosotrosStory } from "@/components/sections/nosotros/NosotrosStory";
import { NosotrosValues } from "@/components/sections/nosotros/NosotrosValues";
import { NosotrosBuild } from "@/components/sections/nosotros/NosotrosBuild";
import { NosotrosClosing } from "@/components/sections/nosotros/NosotrosClosing";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.nosotros.title,
  description: pages.nosotros.description,
};

/**
 * Nosotros: cabecera (foto en arco que se abre) → historia (foto fija + texto que se
 * ilumina) → valores (72 h + tarjetas que giran) → obra (scroll horizontal) → cierre.
 */
export default function NosotrosPage() {
  return (
    <>
      <NosotrosIntro />
      <NosotrosStory />
      <NosotrosValues />
      <NosotrosBuild />
      <NosotrosClosing />
    </>
  );
}
