import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { serverEnv } from "@/lib/server/env";
import { isRateLimited } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { sendFormEmail, type EmailAttachment, type EmailRow } from "@/lib/server/email";
import type { FormResponse } from "@/lib/forms/submit";

type Base = { website?: string; turnstileToken: string };

type FormHandlerOptions<S extends z.ZodType<Base>> = {
  /** Nombre corto para el límite de envíos ("contacto", "resenas"). */
  key: string;
  schema: S;
  /** Tamaño máximo del cuerpo. Por defecto 10 KB (solo texto); más si lleva fotos. */
  maxBodyBytes?: number;
  /** Convierte los datos ya validados en el email que recibe el restaurante. */
  toEmail: (data: z.output<S>) => {
    subject: string;
    rows: EmailRow[];
    replyTo: string;
    attachments?: EmailAttachment[];
  };
};

const MAX_BODY_BYTES = 10_000;

const reply = (body: FormResponse, status = 200) => NextResponse.json(body, { status });

/**
 * Crea el POST de una API de formulario. Orden de las comprobaciones (de la más barata a la más cara):
 * tamaño → límite de envíos (Upstash) → Zod → honeypot → Turnstile → envío con Resend.
 */
export function createFormHandler<S extends z.ZodType<Base>>({
  key,
  schema,
  maxBodyBytes = MAX_BODY_BYTES,
  toEmail,
}: FormHandlerOptions<S>) {
  return async function POST(req: NextRequest) {
    let env;
    try {
      env = serverEnv();
    } catch (err) {
      console.error(`[api/${key}]`, err);
      return reply({ ok: false, error: "El formulario no está disponible ahora mismo. Llámanos, por favor." }, 503);
    }

    // Primero por la cabecera (sin leer el cuerpo); después, por lo leído de verdad y en bytes.
    const tooLarge = () => reply({ ok: false, error: "Mensaje demasiado largo." }, 413);
    if (Number(req.headers.get("content-length") ?? 0) > maxBodyBytes) return tooLarge();
    const raw = await req.text();
    if (Buffer.byteLength(raw) > maxBodyBytes) return tooLarge();

    // x-real-ip la pone Vercel y el visitante no puede falsificarla; x-forwarded-for, de reserva.
    const ip =
      req.headers.get("x-real-ip")?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    try {
      if (await isRateLimited(`${key}:${ip}`, env)) {
        return reply({ ok: false, error: "Has enviado varios formularios seguidos. Espera unos minutos." }, 429);
      }
    } catch (err) {
      // Si Upstash falla, seguimos: Turnstile sigue frenando a los bots.
      console.error(`[api/${key}] rate limit`, err);
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return reply({ ok: false, error: "Petición no válida." }, 400);
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return reply({ ok: false, error: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors }, 400);
    }
    const data = parsed.data;

    // Honeypot relleno = bot. Se responde "ok" para que no sepa que lo hemos detectado.
    if (data.website) return reply({ ok: true });

    if (!(await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip))) {
      return reply({ ok: false, error: "No hemos podido comprobar que no eres un robot. Inténtalo de nuevo." }, 400);
    }

    try {
      await sendFormEmail(env, toEmail(data));
    } catch (err) {
      console.error(`[api/${key}] email`, err);
      return reply({ ok: false, error: "No hemos podido enviarlo. Inténtalo de nuevo o llámanos." }, 502);
    }

    return reply({ ok: true });
  };
}
