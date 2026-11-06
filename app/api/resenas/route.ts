import { reviewsEnv } from "@/lib/server/env";
import { sendEmail } from "@/lib/server/email/send";
import { reviewModerationEmail } from "@/lib/server/email/templates";
import { createFormHandler } from "@/lib/server/form-handler";
import { saveReview } from "@/lib/server/reviews/store";
import { createReviewToken } from "@/lib/server/reviews/token";
import { siteUrl } from "@/lib/utils/site-url";
import { resenaSchema } from "@/lib/validations/resena";

/**
 * POST /api/resenas — reseña del público. NO se publica sola:
 *   1. Se guarda como "pendiente" en Upstash Redis (caduca a los 30 días).
 *   2. Llega un email al restaurante con las fotos adjuntas y los botones Publicar / Rechazar.
 *   3. Esos botones abren /resenas/moderar (enlace firmado), donde se confirma la decisión.
 */
export const POST = createFormHandler({
  key: "resenas",
  schema: resenaSchema,
  getEnv: reviewsEnv,
  // 3 fotos de ~500 KB en base64 + el texto.
  maxBodyBytes: 2_200_000,
  handle: async (data, env) => {
    const review = await saveReview(env, data);
    const base = siteUrl();
    const moderate = `${base}/resenas/moderar?t=${createReviewToken(review.id, env.REVIEW_SIGNING_SECRET)}`;

    await sendEmail(env, {
      ...reviewModerationEmail(review, { publish: `${moderate}&d=publicar`, reject: `${moderate}&d=rechazar` }, base),
      replyTo: data.email,
      attachments: data.photos.map((photo, i) => ({
        filename: `resena-${review.name.replace(/[^\p{L}\d]+/gu, "-").toLowerCase()}-foto-${i + 1}.jpg`,
        content: Buffer.from(photo.split(",")[1] ?? "", "base64"),
      })),
    });
  },
});
