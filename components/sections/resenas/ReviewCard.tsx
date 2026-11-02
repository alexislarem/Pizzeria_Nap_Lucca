import { Instagram, MapPin, Star } from "lucide-react";
import { Doodle } from "@/components/ui/Doodle";
import { PulseHeart } from "@/components/ui/PulseHeart";
import { WarmTooltip } from "@/components/ui/WarmTooltip";
import { resenasWall, reviewSources, type Review } from "@/content/resenas";
import { cn } from "@/lib/utils/cn";

const SOURCE_ICON = { google: MapPin, instagram: Instagram } as const;

/** Inclinación de cada comanda, como papeles colgados a mano en la barra. */
const TILTS = ["-rotate-1", "rotate-[0.6deg]", "-rotate-[0.4deg]", "rotate-1"] as const;

type ReviewCardProps = {
  review: Review;
  /** Número de comanda (1, 2, 3…). */
  number: number;
};

/**
 * Reseña pintada como una comanda de pizzería: papel crema con bordes
 * perforados, número de pedido, estrellas, el texto, la respuesta de LUCA
 * (si la hay) y, al pie, quién la escribió y el "me gusta".
 */
export function ReviewCard({ review, number }: ReviewCardProps) {
  const source = reviewSources[review.source];
  const SourceIcon = SOURCE_ICON[review.source];

  return (
    <article
      aria-label={`Reseña de ${review.author}`}
      className={cn(
        "ticket-perforated bg-surface text-on-surface px-6 pt-8 pb-9 transition-transform duration-300 hover:rotate-0",
        TILTS[number % TILTS.length]
      )}
    >
      <header className="border-luca-brown/40 flex items-center justify-between gap-3 border-b-2 border-dashed pb-3">
        <p className="font-display text-luca-brown text-xs font-extrabold tracking-[0.2em] uppercase">
          {resenasWall.ticketLabel} Nº {String(number).padStart(2, "0")}
        </p>
        <p className="text-fg-muted text-xs font-semibold">{review.date}</p>
      </header>

      <div className="mt-4 flex items-center justify-between gap-3">
        {review.rating ? (
          <p className="flex gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                aria-hidden
                size={18}
                className={cn(
                  i < (review.rating ?? 0)
                    ? "fill-primary text-fg"
                    : "text-fg-muted fill-transparent"
                )}
              />
            ))}
          </p>
        ) : (
          <span />
        )}
        <WarmTooltip content={source.tooltip} label={source.label}>
          <span className="rounded-pill bg-bg grid size-8 place-items-center">
            <SourceIcon aria-hidden size={16} />
          </span>
        </WarmTooltip>
      </div>

      <p className="mt-3 leading-relaxed">{review.text}</p>

      {review.reply && (
        <div className="border-primary bg-bg/60 mt-4 rounded-sm border-l-4 p-3">
          <p className="font-display flex items-center gap-2 text-xs font-extrabold tracking-[0.15em] uppercase">
            <span className="w-4">
              <Doodle name="chasquido" />
            </span>
            {resenasWall.replyLabel}
          </p>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">{review.reply}</p>
        </div>
      )}

      <footer className="border-luca-brown/40 mt-5 flex items-center gap-3 border-t-2 border-dashed pt-4">
        <span
          aria-hidden
          className="rounded-pill bg-fg font-display text-primary grid size-9 shrink-0 place-items-center font-black"
        >
          {review.author.charAt(0)}
        </span>
        <p className="min-w-0 flex-1 text-sm leading-tight font-semibold">
          {review.author}
        </p>
        <PulseHeart id={review.id} count={review.likes} label={resenasWall.likeLabel} />
      </footer>
    </article>
  );
}

/** Comanda especial al final de la barra: invita a etiquetar a LUCA en Instagram. */
export function InstagramCard() {
  const instagram = reviewSources.instagram;
  return (
    <a
      href={instagram.href}
      target="_blank"
      rel="noopener noreferrer"
      className="ticket-perforated bg-primary text-on-primary group block rotate-1 px-6 pt-8 pb-9 transition-transform duration-300 hover:rotate-0"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-2xl leading-none font-black uppercase">
          {resenasWall.instagram.title}
        </span>
        <span className="w-12 shrink-0 transition-transform duration-300 group-hover:-rotate-12">
          <Doodle name="coctel" />
        </span>
      </span>
      <span className="mt-3 block">{resenasWall.instagram.text}</span>
      <span className="rounded-pill bg-fg text-primary mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold">
        <Instagram aria-hidden size={16} />
        {instagram.cta}
      </span>
    </a>
  );
}
