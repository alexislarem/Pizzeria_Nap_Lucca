import { z } from "zod";
import {
  email,
  honeypot,
  longText,
  name,
  phone,
  turnstileToken,
  privacy,
} from "@/lib/validations/common";
import { openingHoursFor, todayInSpain } from "@/lib/utils/date";

/** Máximo de comensales por reserva online; grupos mayores, por teléfono. */
export const MAX_GUESTS = 12;

export const reservaSchema = z
  .object({
    name,
    phone,
    email,
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha")
      .refine((d) => d >= todayInSpain(), "La fecha ya ha pasado"),
    // Que sea un día y una hora de apertura se comprueba abajo (superRefine), con site.config.ts → hours.
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Elige una hora"),
    // Llega como texto desde el <select>; se comprueba que sea un número entre 1 y MAX_GUESTS.
    guests: z
      .string()
      .regex(/^\d{1,2}$/, "Elige cuántos sois")
      .refine((n) => Number(n) >= 1 && Number(n) <= MAX_GUESTS, "Elige cuántos sois"),
    notes: longText(500).optional(),
    privacy,
    website: honeypot,
    turnstileToken,
  })
  .superRefine(({ date, time }, ctx) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    const hours = openingHoursFor(date);
    if (!hours) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Ese día está cerrado (abrimos de martes a sábado)",
      });
      return;
    }
    // "19:00" < "23:30" funciona al comparar texto porque ambos van con dos cifras.
    if (/^\d{2}:\d{2}$/.test(time) && (time < hours.open || time > hours.close)) {
      ctx.addIssue({
        code: "custom",
        path: ["time"],
        message: `Ese día abrimos de ${hours.open} a ${hours.close}`,
      });
    }
  });

/** Lo que escribe el usuario (antes de limpiar) y lo que recibe el servidor (ya limpio). */
export type ReservaInput = z.input<typeof reservaSchema>;
export type Reserva = z.output<typeof reservaSchema>;
