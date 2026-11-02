import { z } from "zod";
import { email, honeypot, longText, name, phone, turnstileToken } from "@/lib/validations/common";
import { todayInSpain } from "@/lib/utils/date";

/** Máximo de comensales por reserva online; grupos mayores, por teléfono. */
export const MAX_GUESTS = 12;

export const reservaSchema = z.object({
  name,
  phone,
  email,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha")
    .refine((d) => d >= todayInSpain(), "La fecha ya ha pasado"),
  // TODO: limitar a las horas de apertura cuando estén confirmadas (site.config.ts → hours).
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Elige una hora"),
  // Llega como texto desde el <select>; se comprueba que sea un número entre 1 y MAX_GUESTS.
  guests: z
    .string()
    .regex(/^\d{1,2}$/, "Elige cuántos sois")
    .refine((n) => Number(n) >= 1 && Number(n) <= MAX_GUESTS, "Elige cuántos sois"),
  notes: longText(500).optional(),
  website: honeypot,
  turnstileToken,
});

/** Lo que escribe el usuario (antes de limpiar) y lo que recibe el servidor (ya limpio). */
export type ReservaInput = z.input<typeof reservaSchema>;
export type Reserva = z.output<typeof reservaSchema>;
