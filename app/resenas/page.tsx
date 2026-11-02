import type { Metadata } from "next";
import { ResenasIntro } from "@/components/sections/resenas/ResenasIntro";
import { ResenasWall } from "@/components/sections/resenas/ResenasWall";
import { ResenaFormSection } from "@/components/sections/resenas/ResenaFormSection";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.resenas.title,
  description: pages.resenas.description,
};

/** Reseñas (antes Foodtrucks): cabecera → panel de reseñas (Google / Instagram) → formulario. */
export default function ResenasPage() {
  return (
    <>
      <ResenasIntro />
      <ResenasWall />
      <ResenaFormSection />
    </>
  );
}
