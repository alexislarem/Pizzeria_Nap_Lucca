import "server-only";
import { z } from "zod";

/**
 * Secretos del servidor (en .env.local o en Vercel). Nunca se importan desde el navegador:
 * "server-only" hace fallar la compilación si alguien lo intenta.
 *
 * Se leen al recibir una petición (no al compilar), así `pnpm build` funciona sin ellos.
 */
const schema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  RESEND_TO_EMAIL: z.string().email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

/** Extra de las reseñas: la clave con la que se firman los enlaces "Publicar / Rechazar". */
const reviewsSchema = schema.extend({
  REVIEW_SIGNING_SECRET: z.string().min(32, "REVIEW_SIGNING_SECRET debe tener 32 caracteres o más"),
});

export type ServerEnv = z.infer<typeof schema>;
export type ReviewsEnv = z.infer<typeof reviewsSchema>;

function parse<S extends z.ZodTypeAny>(s: S): z.infer<S> {
  const parsed = s.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Faltan o son inválidas estas variables de entorno: ${missing}`);
  }
  return parsed.data;
}

/** Devuelve las variables o lanza un error que dice cuáles faltan (sin mostrar sus valores). */
export const serverEnv = (): ServerEnv => parse(schema);

/** Como serverEnv, más la clave de firma de las reseñas. */
export const reviewsEnv = (): ReviewsEnv => parse(reviewsSchema);
