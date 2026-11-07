import "server-only";
import { Redis } from "@upstash/redis";
import type { ServerEnv } from "@/lib/server/env";

let client: Redis | undefined;

/**
 * Cliente de Upstash Redis compartido (límite de envíos + reseñas).
 * Habla por HTTP, así que funciona en las funciones de Vercel sin conexiones abiertas.
 */
export function redis(env: Pick<ServerEnv, "UPSTASH_REDIS_REST_URL" | "UPSTASH_REDIS_REST_TOKEN">): Redis {
  client ??= new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
  return client;
}
