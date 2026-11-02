import { z } from "zod";
import { email, honeypot, longText, name, phone, turnstileToken } from "@/lib/validations/common";

export const contactoSchema = z.object({
  name,
  email,
  // Opcional: "" se acepta como "sin teléfono".
  phone: z.union([z.literal(""), phone]).optional(),
  message: longText(2000).pipe(z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")),
  website: honeypot,
  turnstileToken,
});

export type ContactoInput = z.input<typeof contactoSchema>;
export type Contacto = z.output<typeof contactoSchema>;
