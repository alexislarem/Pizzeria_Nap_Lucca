import { z } from "zod";
import {
  email,
  honeypot,
  longText,
  name,
  privacy,
  turnstileToken,
} from "@/lib/validations/common";

/** Máximo de fotos por reseña. */
export const MAX_PHOTOS = 3;

/**
 * Foto ya comprimida en el navegador (components/forms/PhotoPicker.tsx) y enviada
 * como "data URL" JPEG. Tope de ~700 KB de texto por foto (≈ 500 KB de imagen).
 * "/9j/" es cómo se ve en base64 la firma de todo JPEG (bytes FF D8 FF): así no se
 * cuela otro tipo de archivo renombrado a .jpg en el email del restaurante.
 */
export const photoDataUrl = z
  .string()
  .max(700_000, "Una de las fotos es demasiado grande")
  .regex(/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+=*$/, "Formato de foto no válido");

export const resenaSchema = z.object({
  rating: z.number().int().min(1, "Toca las estrellas para puntuar").max(5),
  name,
  email,
  message: longText(1500).pipe(
    z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
  ),
  photos: z.array(photoDataUrl).max(MAX_PHOTOS, `Máximo ${MAX_PHOTOS} fotos`),
  // Sin este permiso no se puede publicar nada (nombre, texto ni fotos).
  consent: z.boolean().refine((v) => v, "Necesitamos tu permiso para publicarla"),
  privacy,
  website: honeypot,
  turnstileToken,
});

export type ResenaInput = z.input<typeof resenaSchema>;
export type Resena = z.output<typeof resenaSchema>;
