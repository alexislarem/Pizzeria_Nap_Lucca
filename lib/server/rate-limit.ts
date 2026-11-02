import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ServerEnv } from "@/lib/server/env";

let limiter: Ratelimit | undefined;

/**
 * Máximo 5 envíos cada 10 minutos por IP y formulario.
 * El contador vive en Upstash Redis, compartido por todas las instancias de Vercel.
 */
export async function isRateLimited(key: string, env: ServerEnv): Promise<boolean> {
  limiter ??= new Ratelimit({
    redis: new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "luca:form",
  });
  const { success } = await limiter.limit(key);
  return !success;
}
