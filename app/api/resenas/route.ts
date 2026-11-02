import { createFormHandler } from "@/lib/server/form-handler";
import { resenaSchema } from "@/lib/validations/resena";

/**
 * POST /api/resenas — reseña del público. NO se publica sola: llega por email
 * (con las fotos adjuntas) para que el restaurante la revise antes de ponerla en la web.
 * TODO: automatizar la publicación tras la revisión (Fase 4: base de datos).
 */
export const POST = createFormHandler({
  key: "resenas",
  schema: resenaSchema,
  // 3 fotos de ~500 KB en base64 + el texto.
  maxBodyBytes: 2_200_000,
  toEmail: (r) => ({
    subject: `Reseña para revisar: ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)} de ${r.name}`,
    replyTo: r.email,
    rows: [
      { label: "Puntuación", value: `${r.rating} / 5` },
      { label: "Nombre", value: r.name },
      { label: "Email", value: r.email },
      { label: "Reseña", value: r.message },
      { label: "Fotos", value: r.photos.length ? `${r.photos.length} adjunta(s)` : "" },
      { label: "Permiso", value: "Acepta que se publique tras revisarla" },
    ],
    attachments: r.photos.map((photo, i) => ({
      filename: `resena-foto-${i + 1}.jpg`,
      content: Buffer.from(photo.split(",")[1] ?? "", "base64"),
    })),
  }),
});
