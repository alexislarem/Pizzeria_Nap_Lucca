import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WiggleDoodle } from "@/components/ui/WiggleDoodle";
import { cartaFeatured } from "@/content/carta";
import type { MenuItem } from "@/content/menu";
import { priceLabel, splitIngredients } from "@/lib/utils/format";

/**
 * Pizza destacada: bloque amarillo con su foto (que gira despacio al pasar el
 * ratón), ingredientes en etiquetas, sello de precio y acceso a reservar.
 */
export function CartaFeatured({ item }: { item: MenuItem }) {
  const ingredients = item.description ? splitIngredients(item.description) : [];

  return (
    <Reveal className="bg-primary text-on-primary group relative grid grid-cols-1 overflow-hidden rounded-xl md:grid-cols-[1fr_1.1fr]">
      <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[28rem]">
        <Image
          src={cartaFeatured.photo.src}
          alt={cartaFeatured.photo.alt}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110 group-hover:rotate-3"
        />
      </div>

      <div className="relative px-6 py-10 md:px-12 md:py-14">
        <WiggleDoodle
          name="albahaca"
          rotate={12}
          className="absolute top-6 right-6 w-16 md:w-20"
        />
        <p className="rounded-pill border-fg font-display w-fit border-2 px-3 py-1 text-xs font-extrabold tracking-[0.2em] uppercase">
          {cartaFeatured.label}
        </p>
        <p className="font-display mt-6 text-sm font-extrabold tracking-[0.25em] uppercase">
          {cartaFeatured.eyebrow}
        </p>
        <h3 className="font-display mt-1 text-5xl leading-[0.9] font-black uppercase md:text-7xl">
          {item.name}
        </h3>

        <ul
          className="mt-6 flex flex-wrap gap-2"
          aria-label={`Ingredientes de ${item.name}`}
        >
          {ingredients.map((ingredient) => (
            <li
              key={ingredient}
              className="rounded-pill bg-fg/10 px-3 py-1.5 text-sm font-semibold first-letter:uppercase"
            >
              {ingredient}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <span className="rounded-pill bg-fg font-display text-primary grid size-24 -rotate-8 place-items-center text-xl font-black transition-transform duration-500 group-hover:rotate-6">
            {priceLabel(item.price)}
          </span>
          <ButtonLink href={cartaFeatured.cta.href} variant="dark">
            {cartaFeatured.cta.label}
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}
