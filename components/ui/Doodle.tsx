import { doodles, type DoodleName } from "@/content/doodles";
import { cn } from "@/lib/utils/cn";

type DoodleProps = {
  name: DoodleName;
  /** El color se da con una clase de fondo (`bg-fg`, `bg-primary`…). Por defecto, tinta. */
  className?: string;
  /** Si el dibujo aporta información, se anuncia con su `alt`; si es decoración, se oculta. */
  decorative?: boolean;
};

/**
 * Dibujo de línea de la marca, teñido con un token de color.
 * Por qué no es <Image>: el archivo es una silueta blanca que se usa como
 * MÁSCARA CSS (mask-image); el color lo pone el fondo del <span>. Así un mismo
 * archivo sirve en negro sobre amarillo, amarillo sobre negro, crema sobre marrón…
 */
export function Doodle({ name, className, decorative = true }: DoodleProps) {
  const { src, ratio, alt } = doodles[name];
  const mask = `url(${src}) center / contain no-repeat`;

  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative || undefined}
      style={{ aspectRatio: ratio, mask, WebkitMask: mask }}
      className={cn("bg-fg block w-full", className)}
    />
  );
}
