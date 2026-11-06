import "server-only";
import { unstable_cache } from "next/cache";
import type { Review } from "@/content/resenas";
import { listPublishedReviews, type StoredReview } from "@/lib/server/reviews/store";

/** Etiqueta de caché: al publicar una reseña se invalida y el muro se regenera. */
export const WEB_REVIEWS_TAG = "web-reviews";

/** 1730000000000 → "Noviembre 2026" (mismo formato que las reseñas de Google). */
function monthLabel(ms: number): string {
  const label = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(ms);
  return (label.charAt(0).toUpperCase() + label.slice(1)).replace(" de ", " ");
}

/** Convierte lo guardado en Redis en una reseña del muro. El email NO sale de aquí. */
export function toReview(r: StoredReview): Review {
  return {
    id: `web-${r.id}`,
    author: r.name,
    source: "web",
    rating: r.rating,
    date: monthLabel(r.publishedAt ?? r.createdAt),
    text: r.message,
    likes: 0,
    photos: (r.photos ?? []).map((src, i) => ({
      src,
      alt: `Foto ${i + 1} de la reseña de ${r.name} en LUCA`,
    })),
  };
}

// Se guarda en la caché de Next una hora (o hasta que se publique otra reseña).
// Solo hacen falta las claves de Upstash (leer el muro no envía emails).
const cachedWebReviews = unstable_cache(
  async (url: string, token: string) =>
    (await listPublishedReviews({ UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token })).map(toReview),
  ["web-reviews"],
  { tags: [WEB_REVIEWS_TAG], revalidate: 3600 }
);

/**
 * Reseñas enviadas desde la web y aprobadas por el restaurante, de la más nueva a la más antigua.
 * Si Redis no responde (o faltan las claves, p. ej. al compilar en local), devuelve [] y la página
 * se muestra solo con las de Google: nunca rompe la web.
 */
export async function getWebReviews(): Promise<Review[]> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return [];
  try {
    return await cachedWebReviews(url, token);
  } catch (err) {
    console.error("[resenas] no se pudieron leer las reseñas de la web", err);
    return [];
  }
}
