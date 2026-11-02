import type { Metadata } from "next";
import { CartaIntro } from "@/components/sections/carta/CartaIntro";
import { CartaNav } from "@/components/sections/carta/CartaNav";
import { CartaCategory } from "@/components/sections/carta/CartaCategory";
import { HomeReserve } from "@/components/sections/home/HomeReserve";
import { cartaPhotos } from "@/content/carta";
import { menu } from "@/content/menu";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.carta.title,
  description: pages.carta.description,
};

/** Carta: cabecera con dibujos → índice con píldora activa → categorías en tickets (pizza destacada primero) → reserva. */
export default function CartaPage() {
  return (
    <>
      <CartaIntro />
      <CartaNav />
      {menu.map((category, i) => (
        <CartaCategory
          key={category.id}
          category={category}
          photo={cartaPhotos[category.id]}
          reversed={i % 2 === 1}
        />
      ))}
      <HomeReserve />
    </>
  );
}
