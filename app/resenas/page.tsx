import type { Metadata } from "next";
import { ResenasIntro } from "@/components/sections/resenas/ResenasIntro";
import { ResenasWall } from "@/components/sections/resenas/ResenasWall";
import { ResenaFormSection } from "@/components/sections/resenas/ResenaFormSection";
import { pages } from "@/content/pages";
import { getWebReviews } from "@/lib/server/reviews/public";

export const metadata: Metadata = {
  title: pages.resenas.title,
  description: pages.resenas.description,
};

// Se regenera como mucho cada hora; al publicar una reseña desde el email, al momento.
export const revalidate = 3600;

/** Reseñas (antes Foodtrucks): cabecera → panel de reseñas (web / Google / Instagram) → formulario. */
export default async function ResenasPage() {
  const webReviews = await getWebReviews();
  return (
    <>
      <ResenasIntro />
      <ResenasWall webReviews={webReviews} />
      <ResenaFormSection />
    </>
  );
}
