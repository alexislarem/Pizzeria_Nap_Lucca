import type { Metadata } from "next";
import { ModerationPanel } from "@/components/sections/resenas/ModerationPanel";
import { ReviewCard } from "@/components/sections/resenas/ReviewCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resenaModeracion as copy } from "@/content/resenas";
import { reviewsEnv } from "@/lib/server/env";
import { toReview } from "@/lib/server/reviews/public";
import { getPendingPhotos, getReview } from "@/lib/server/reviews/store";
import { verifyReviewToken } from "@/lib/server/reviews/token";

export const metadata: Metadata = {
  title: copy.metaTitle,
  // Página privada: que no salga en Google.
  robots: { index: false, follow: false },
};

// Siempre se genera en el momento (lee el enlace y el estado actual de la reseña).
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ t?: string; d?: string }> };

/**
 * /resenas/moderar?t=<enlace firmado>&d=publicar|rechazar
 * Se abre desde el email "Reseña por revisar". Muestra la reseña tal como saldrá en la web
 * y los botones para confirmar. Abrir la página NO publica nada: hay que pulsar el botón
 * (los antivirus del correo abren los enlaces solos y, si no, se aprobarían sin querer).
 */
export default async function ModerarPage({ searchParams }: PageProps) {
  const { t = "", d } = await searchParams;

  return (
    <section aria-labelledby="moderar-title" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="moderar-title"
          level={1}
          eyebrow={copy.eyebrow}
          title={copy.title}
          className="md:[&_h1]:text-8xl"
        />
        <div className="mt-10">
          <ModerationContent token={t} preferred={d === "rechazar" ? "reject" : "publish"} />
        </div>
      </div>
    </section>
  );
}

async function ModerationContent({ token, preferred }: { token: string; preferred: "publish" | "reject" }) {
  let env;
  try {
    env = reviewsEnv();
  } catch (err) {
    console.error("[resenas/moderar]", err);
    return <Notice text={copy.errors.unavailable} />;
  }

  const id = verifyReviewToken(token, env.REVIEW_SIGNING_SECRET);
  if (!id) return <Notice text={copy.errors.badLink} />;

  const stored = await getReview(env, id);
  if (!stored) return <Notice text={copy.errors.gone} />;
  if (stored.status === "published") {
    return <Notice text={copy.alreadyPublished} cta={copy.done.published.cta} />;
  }

  // Vista previa idéntica a la del muro, con las fotos aún privadas (data URLs, sin subir a internet).
  const photos = await getPendingPhotos(env, id);
  const preview = {
    ...toReview({ ...stored, publishedAt: Date.now() }),
    photos: photos.map((src, i) => ({ src, alt: `Foto ${i + 1} de la reseña de ${stored.name}` })),
  };

  return (
    <div className="grid gap-8">
      <p className="text-fg-muted max-w-prose text-lg">{copy.intro}</p>
      <div className="max-w-md">
        <ReviewCard review={preview} number={1} />
      </div>
      <p className="text-sm">
        <span className="text-fg-muted font-semibold">{copy.emailLabel}: </span>
        {stored.email}
      </p>
      <ModerationPanel token={token} preferred={preferred} />
    </div>
  );
}

function Notice({ text, cta }: { text: string; cta?: string }) {
  return (
    <div role="status" className="bg-surface text-on-surface rounded-xl p-6 md:p-8">
      <p className="text-lg font-semibold">{text}</p>
      <ButtonLink href="/resenas" variant="dark" size="sm" className="mt-5">
        {cta ?? copy.done.rejected.cta}
      </ButtonLink>
    </div>
  );
}
