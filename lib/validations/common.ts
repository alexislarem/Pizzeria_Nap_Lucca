import { z } from "zod";

/**
 * Piezas de validación compartidas por los formularios.
 * El mismo esquema se usa en el navegador (mensajes al instante) y en el servidor (la comprobación que vale).
 */

/** Quita caracteres de control (salvo saltos de línea) y espacios sobrantes. */
const clean = (value: string) => value.replace(/[^\P{Cc}\n]/gu, "").trim();

/** Texto de una línea: sin saltos de línea (evita inyectar cabeceras en el email). */
export const line = (max: number) =>
  z
    .string()
    .max(max, `Máximo ${max} caracteres`)
    .transform((v) => clean(v).replace(/\s+/g, " "));

export const name = line(80).pipe(z.string().min(2, "Escribe tu nombre"));

export const email = line(120).pipe(z.string().email("Revisa el email"));

/** Teléfono español o internacional: dígitos, espacios, guiones y un "+" inicial. */
export const phone = line(20).pipe(z.string().regex(/^\+?[\d\s-]{9,19}$/, "Revisa el teléfono"));

/** Texto libre de varias líneas (mensaje, comentarios). */
export const longText = (max: number) => z.string().max(max, `Máximo ${max} caracteres`).transform(clean);

/**
 * Campo trampa (honeypot): invisible para personas; si llega relleno, es un bot.
 * No se valida aquí para no avisar al bot: el servidor lo descarta en silencio.
 */
export const honeypot = z.string().optional();

/** Token de Cloudflare Turnstile (la casilla "no soy un robot"). */
export const turnstileToken = z.string().min(1, "Confirma que no eres un robot");
