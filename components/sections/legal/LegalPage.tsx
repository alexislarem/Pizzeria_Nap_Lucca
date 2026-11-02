import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { legalDocs, type LegalDoc } from "@/content/legal";
import { cn } from "@/lib/utils/cn";

/**
 * Página legal (aviso legal, privacidad, cookies): texto largo en una columna
 * cómoda de leer y, arriba, accesos a las otras dos.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section aria-labelledby="legal-title" className="px-4 pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Textos legales" className="mb-10">
          <ul className="flex flex-wrap gap-2">
            {legalDocs.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/${d.slug}`}
                  aria-current={d.slug === doc.slug ? "page" : undefined}
                  className={cn(
                    "rounded-pill block border px-4 py-2 text-sm font-semibold transition-colors",
                    d.slug === doc.slug
                      ? "bg-primary text-on-primary border-transparent"
                      : "border-border hover:border-fg"
                  )}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SectionHeading
          level={1}
          id="legal-title"
          title={doc.title}
          subtitle={`Actualizado: ${doc.updated}`}
        />

        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl leading-tight font-black uppercase">
                {section.title}
              </h2>
              <div className="text-fg-muted mt-3 space-y-3 leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
