import "server-only";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { ServerEnv } from "@/lib/server/env";
import { redis } from "@/lib/server/redis";
import { REVIEW_TTL_SECONDS } from "@/lib/server/reviews/token";
import type { Resena } from "@/lib/validations/resena";

/**
 * Reseñas enviadas desde la web, guardadas en Upstash Redis.
 *
 *   luca:review:<id>          → los datos (JSON). Pendiente: caduca a los 30 días. Publicada: no caduca.
 *   luca:review:<id>:photos   → fotos pendientes en base64 (privadas; caducan a los 30 días).
 *   luca:reviews:published    → lista ordenada por fecha de publicación (ids).
 *
 * Las fotos solo se suben a Vercel Blob (públicas) al pulsar "Publicar"; si se rechaza,
 * se borran sin haber estado nunca en internet.
 */

export type StoredReview = {
  id: string;
  name: string;
  /** Solo para avisar al autor; nunca se publica. */
  email: string;
  rating: number;
  message: string;
  photoCount: number;
  /** Fechas en milisegundos (Date.now()). */
  createdAt: number;
  status: "pending" | "published";
  publishedAt?: number;
  /** URLs públicas de Vercel Blob (solo al publicar). */
  photos?: string[];
};

type RedisEnv = Pick<ServerEnv, "UPSTASH_REDIS_REST_URL" | "UPSTASH_REDIS_REST_TOKEN">;

const reviewKey = (id: string) => `luca:review:${id}`;
const photosKey = (id: string) => `luca:review:${id}:photos`;
const lockKey = (id: string) => `luca:review:${id}:lock`;
const PUBLISHED = "luca:reviews:published";

/** Guarda una reseña nueva como pendiente y devuelve lo guardado. */
export async function saveReview(env: RedisEnv, data: Resena): Promise<StoredReview> {
  const review: StoredReview = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    rating: data.rating,
    message: data.message,
    photoCount: data.photos.length,
    createdAt: Date.now(),
    status: "pending",
  };
  const pipe = redis(env).pipeline();
  pipe.set(reviewKey(review.id), review, { ex: REVIEW_TTL_SECONDS });
  if (data.photos.length) pipe.set(photosKey(review.id), data.photos, { ex: REVIEW_TTL_SECONDS });
  await pipe.exec();
  return review;
}

export async function getReview(env: RedisEnv, id: string): Promise<StoredReview | null> {
  return redis(env).get<StoredReview>(reviewKey(id));
}

/** Fotos pendientes (data URLs JPEG) para verlas en la página de moderación. */
export async function getPendingPhotos(env: RedisEnv, id: string): Promise<string[]> {
  return (await redis(env).get<string[]>(photosKey(id))) ?? [];
}

/**
 * Candado de 60 s para que dos clics seguidos (o dos pestañas) no publiquen dos veces.
 * Devuelve false si otra petición ya está moderando esta reseña.
 */
export async function lockReview(env: RedisEnv, id: string): Promise<boolean> {
  return (await redis(env).set(lockKey(id), 1, { nx: true, ex: 60 })) === "OK";
}

export async function unlockReview(env: RedisEnv, id: string): Promise<void> {
  await redis(env).del(lockKey(id));
}

/** Sube las fotos a Vercel Blob, marca la reseña como publicada y la añade al muro. */
export async function publishReview(env: RedisEnv, review: StoredReview): Promise<StoredReview> {
  const pending = await getPendingPhotos(env, review.id);
  const photos = await Promise.all(
    pending.map(async (dataUrl, i) => {
      const blob = await put(
        `resenas/${review.id}/foto-${i + 1}.jpg`,
        Buffer.from(dataUrl.split(",")[1] ?? "", "base64"),
        // Sufijo aleatorio: la URL no se puede adivinar ni pisar.
        { access: "public", contentType: "image/jpeg", addRandomSuffix: true }
      );
      return blob.url;
    })
  );

  const published: StoredReview = { ...review, status: "published", publishedAt: Date.now(), photos };
  const pipe = redis(env).pipeline();
  pipe.set(reviewKey(review.id), published); // sin caducidad
  pipe.del(photosKey(review.id));
  pipe.zadd(PUBLISHED, { score: published.publishedAt ?? Date.now(), member: review.id });
  await pipe.exec();
  return published;
}

/** Borra la reseña y sus fotos pendientes. No queda rastro. */
export async function rejectReview(env: RedisEnv, id: string): Promise<void> {
  await redis(env).del(reviewKey(id), photosKey(id));
}

/** Las reseñas publicadas, de la más reciente a la más antigua. */
export async function listPublishedReviews(env: RedisEnv, limit = 60): Promise<StoredReview[]> {
  const ids = await redis(env).zrange<string[]>(PUBLISHED, 0, limit - 1, { rev: true });
  if (!ids.length) return [];
  const reviews = await redis(env).mget<(StoredReview | null)[]>(...ids.map(reviewKey));
  return reviews.filter((r): r is StoredReview => r?.status === "published");
}
