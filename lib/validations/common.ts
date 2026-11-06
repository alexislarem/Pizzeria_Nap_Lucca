import { z } from "zod";

/**
 * Piezas de validación compartidas por los formularios.
 * El mismo esquema se usa en el navegador (mensajes al instante) y en el servidor (la comprobación que vale).
 */

/**
 * Quita código HTML que alguien intente colar: los bloques <script>/<style> enteros
 * (con lo que llevan dentro) y cualquier otra etiqueta (<b>, <img …>, <a …>).
 * Así ni el restaurante en su correo ni los visitantes en la web ven nunca ese código.
 * "5 < 6" no se toca: solo se quita lo que empieza como una etiqueta (< seguido de letra).
 */
const stripHtml = (value: string) =>
  value
    .replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?(<\/\1\s*>|$)/gi, "")
    .replace(/<\/?[a-z!][^>]*>?/gi, "");

/** Quita HTML, caracteres de control (salvo saltos de línea) y espacios sobrantes. */
const clean = (value: string) =>
  stripHtml(value)
    .replace(/[^\P{Cc}\n]/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

/** Texto de una línea: sin saltos de línea (evita inyectar cabeceras en el email). */
export const line = (max: number) =>
  z
    .string()
    .max(max, `Máximo ${max} caracteres`)
    .transform((v) => clean(v).replace(/\s+/g, " "));

export const name = line(80).pipe(z.string().min(2, "Escribe tu nombre"));

export const email = line(120).pipe(z.string().email("Revisa el email"));

/** Teléfono español o internacional: dígitos, espacios, guiones y un "+" inicial. */
export const phone = line(20).pipe(
  z.string().regex(/^\+?[\d\s-]{9,19}$/, "Revisa el teléfono")
);

/** Texto libre de varias líneas (mensaje, comentarios). */
export const longText = (max: number) =>
  z.string().max(max, `Máximo ${max} caracteres`).transform(clean);

/**
 * Campo trampa (honeypot): invisible para personas; si llega relleno, es un bot.
 * No se valida aquí para no avisar al bot: el servidor lo descarta en silencio.
 */
export const honeypot = z.string().optional();

/** Token de Cloudflare Turnstile (la casilla "no soy un robot"). */
export const turnstileToken = z.string().min(1, "Confirma que no eres un robot");

/** Casilla "He leído y acepto la política de privacidad" (obligatoria en todos los formularios). */
export const privacy = z
  .boolean()
  .refine((v) => v, "Necesitamos que aceptes la política de privacidad");
