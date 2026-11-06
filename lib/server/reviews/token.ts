import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Enlace firmado para moderar una reseña desde el email.
 * Formato: "<id>.<caducidad>.<firma>". La firma es un HMAC-SHA256 con REVIEW_SIGNING_SECRET:
 * sin esa clave nadie puede fabricar un enlace válido ni cambiar el id o la fecha.
 * No hace falta que sea de un solo uso: solo se puede moderar una reseña que siga "pendiente".
 */

/** Lo que dura el enlace (y lo que se guarda una reseña pendiente): 30 días. */
export const REVIEW_TTL_SECONDS = 60 * 60 * 24 * 30;

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function createReviewToken(id: string, secret: string): string {
  const expires = Math.floor(Date.now() / 1000) + REVIEW_TTL_SECONDS;
  const payload = `${id}.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Devuelve el id de la reseña si el enlace es auténtico y no ha caducado; si no, null. */
export function verifyReviewToken(token: string, secret: string): string | null {
  const [id, expires, signature] = token.split(".");
  if (!id || !expires || !signature || !/^[\w-]{8,64}$/.test(id)) return null;

  const expected = Buffer.from(sign(`${id}.${expires}`, secret));
  const given = Buffer.from(signature);
  // timingSafeEqual: compara sin dar pistas por el tiempo que tarda.
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(expires) * 1000 < Date.now()) return null;
  return id;
}
