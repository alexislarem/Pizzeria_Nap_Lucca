import Image from "next/image";
import { Doodle } from "@/components/ui/Doodle";
import { Reveal } from "@/components/ui/Reveal";
import { cartaChipCategories, cartaDoodles, cartaFeatured } from "@/content/carta";
import type { Photo } from "@/content/home";
import type { MenuCategory } from "@/content/menu";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { CartaFeatured } from "./CartaFeatured";
import { DishTicket } from "./DishTicket";

/** Bebidas: grupos (refrescos, cervezas, vinos…) en tarjetas que se elevan al pasar el ratón. */
function Drinks({ category }: { category: MenuCategory }) {
  return (
    <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
      {category.groups.map((group, i) => (
        <Reveal key={group.title} delay={i * 0.04} className="mb-5 break-inside-avoid">
          <section className="bg-surface text-on-surface shadow-card rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1">
            {group.title && (
              <h3 className="font-display border-luca-brown/30 mb-3 border-b-2 border-dashed pb-2 text-lg font-black uppercase">
                {group.title}
              </h3>
            )}
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-baseline gap-2 text-sm">
                  <span>{item.name}</span>
                  <span
                    aria-hidden
                    className="border-border mb-1 flex-1 border-b-2 border-dotted"
                  />
                  <span className="font-semibold whitespace-nowrap">
                    {typeof item.price === "number"
                      ? formatPrice(item.price)
                      : `${formatPrice(item.price.glass)} / ${formatPrice(item.price.bottle)}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

type CartaCategoryProps = {
  category: MenuCategory;
  photo?: Photo;
  /** Alterna la foto a izquierda/derecha entre categorías. */
  reversed?: boolean;
};

/**
 * Una categoría de la carta: título con su dibujo y platos en tickets.
 * Pizzas: la destacada primero (bloque amarillo) y el resto en rejilla.
 * Si la categoría tiene foto, va fija al lado en escritorio.
 */
export function CartaCategory({ category, photo, reversed = false }: CartaCategoryProps) {
  const titleId = `${category.id}-title`;
  const doodle = cartaDoodles[category.id];
  const items = category.groups.flatMap((g) => g.items);
  const featured = items.find((item) => item.name === cartaFeatured.dish);
  const dishes = items.filter((item) => item !== featured);
  const chips = cartaChipCategories.includes(category.id);

  return (
    <section
      id={category.id}
      aria-labelledby={titleId}
      className="scroll-mt-36 px-4 py-12 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex items-end gap-4">
          <h2
            id={titleId}
            className="font-display text-4xl leading-none font-black uppercase md:text-6xl"
          >
            {category.title}
          </h2>
          {doodle && (
            <span className="animate-sway w-10 shrink-0 md:w-14">
              <Doodle name={doodle} />
            </span>
          )}
        </Reveal>

        {featured && (
          <div className="mt-8">
            <CartaFeatured item={featured} />
          </div>
        )}

        <div
          className={cn(
            "mt-8 grid grid-cols-1 gap-10",
            photo && "md:grid-cols-[1.3fr_1fr] md:gap-12",
            photo && reversed && "md:[&>*:first-child]:order-2"
          )}
        >
          {category.layout === "dishes" ? (
            <ul className={cn("grid grid-cols-1 gap-5", !photo && "md:grid-cols-2")}>
              {dishes.map((item, i) => (
                <li key={item.name}>
                  <Reveal delay={(i % 2) * 0.06} className="h-full">
                    <DishTicket item={item} doodle={doodle} chips={chips} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <Drinks category={category} />
          )}

          {photo && (
            <Reveal delay={0.1} className="md:sticky md:top-36 md:self-start">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Reveal>
          )}
        </div>

        {category.note && <p className="text-fg-muted mt-6 text-sm">{category.note}</p>}
      </div>
    </section>
  );
}
