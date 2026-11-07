import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import type { ServerEnv } from "@/lib/server/env";
import { redis } from "@/lib/server/redis";

let limiter: Ratelimit | undefined;

/**
 * Máximo 5 envíos cada 10 minutos por IP y formulario.
 * El contador vive en Upstash Redis, compartido por todas las instancias de Vercel.
 */
export async function isRateLimited(key: string, env: ServerEnv): Promise<boolean> {
  limiter ??= new Ratelimit({
    redis: redis(env),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "luca:form",
  });
  const { success } = await limiter.limit(key);
  return !success;
}
