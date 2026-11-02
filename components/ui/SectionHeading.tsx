import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  id: string;
  /** Texto, o un componente (p. ej. <GhostType>) que se pinta dentro del <h1>/<h2>. */
  title: React.ReactNode;
  /** Frase italiana corta encima del título (opcional). */
  eyebrow?: string;
  subtitle?: string;
  /** 1 cuando la sección es el contenido principal de su página (un solo <h1> por página). */
  level?: 1 | 2;
  className?: string;
};

/** Título de sección: display en mayúsculas, compacto, en negro sobre blanco. */
export function SectionHeading({ id, title, eyebrow, subtitle, level = 2, className }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-2 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-fg-muted">
          {eyebrow}
        </p>
      )}
      <Heading id={id} className="font-display text-4xl font-black uppercase leading-none text-fg md:text-6xl">
        {title}
      </Heading>
      {subtitle && <p className="mt-3 text-lg text-fg-muted">{subtitle}</p>}
    </header>
  );
}
