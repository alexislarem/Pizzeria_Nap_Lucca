import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * Botón-enlace de la marca. Las variantes se definen con CVA (patrón morphinui):
 *   - primary: amarillo con texto negro (CTA principal sobre blanco)
 *   - dark:    negro con texto amarillo (CTA principal SOBRE bloques amarillos)
 *   - outline: borde del color del texto actual (secundario)
 *   - accent:  rojo — solo para acciones secundarias de componente
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        dark: "bg-fg text-primary hover:bg-fg/85",
        outline: "border-2 border-current hover:bg-fg/5",
        accent: "bg-accent text-on-accent hover:bg-accent-hover",
      },
      size: {
        sm: "px-5 py-2.5 text-sm",
        md: "px-6 py-3 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Usa <a> para tel:, mailto: y enlaces externos; <Link> para rutas internas. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const isExternal = /^(tel:|mailto:|https?:)/.test(href);

  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
