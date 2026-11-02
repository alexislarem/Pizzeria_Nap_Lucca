"use client";

import { useEffect, useState } from "react";
import {
  CircularCarousel,
  type CircularCarouselItem,
} from "@/components/ui/CircularCarousel";

/** Punto de corte `md` de Tailwind (48rem). */
const DESKTOP = "(min-width: 48rem)";

/**
 * Elige la forma del carrusel según el ancho: en escritorio el cilindro entero
 * (se ve desde fuera); en móvil "panorama" (la cámara dentro del cilindro), porque
 * el cilindro completo tendría que encogerse tanto que las tarjetas no se verían.
 */
export function BrandCarousel({ items }: { items: readonly CircularCarouselItem[] }) {
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className="h-[26rem] md:h-[34rem]">
      <CircularCarousel
        items={items}
        label="Carteles e inspiración de LUCA"
        preset={desktop ? "cylinder" : "panorama"}
        intro="rise"
        cardWidth={desktop ? 240 : 200}
        aspectRatio={0.78}
        gap={desktop ? 22 : 14}
        speed={12}
        cornerRadius={16}
        captions
      />
    </div>
  );
}
