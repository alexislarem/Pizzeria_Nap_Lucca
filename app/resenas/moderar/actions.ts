"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { resenaModeracion as copy } from "@/content/resenas";
import { reviewsEnv } from "@/lib/server/env";
import { sendEmail } from "@/lib/server/email/send";
import { reviewPublishedEmail } from "@/lib/server/email/templates";
import { WEB_REVIEWS_TAG } from "@/lib/server/reviews/public";
import {
  getReview,
  lockReview,
  publishReview,
  rejectReview,
  unlockReview,
} from "@/lib/server/reviews/store";
import { verifyReviewToken } from "@/lib/server/reviews/token";
import { siteUrl } from "@/lib/utils/site-url";
import type { ModerationState } from "./state";

/**
 * Acción del servidor (Server Action): la ejecuta Next al enviar el formulario de /resenas/moderar.
 * Es un punto de entrada público, así que se vuelve a comprobar la firma del enlace aquí:
 * sin un token válido no se puede publicar ni borrar nada.
 */
export async function moderateReview(_prev: ModerationState, form: FormData): Promise<ModerationState> {
  let env;
  try {
    env = reviewsEnv();
  } catch (err) {
    console.error("[resenas/moderar]", err);
    return { status: "error", message: copy.errors.unavailable };
  }

  const token = String(form.get("token") ?? "");
  const decision = form.get("decision");
  const id = verifyReviewToken(token, env.REVIEW_SIGNING_SECRET);
  if (!id) return { status: "error", message: copy.errors.badLink };
  if (decision !== "publish" && decision !== "reject") return { status: "error", message: copy.errors.generic };

  if (!(await lockReview(env, id))) return { status: "error", message: copy.errors.busy };
  try {
    const review = await getReview(env, id);
    if (!review) return { status: "error", message: copy.errors.gone };
    if (review.status === "published") return { status: "published" };

    if (decision === "reject") {
      await rejectReview(env, id);
      return { status: "rejected" };
    }

    // Vercel Blob acepta dos credenciales: BLOB_STORE_ID (Vercel añade solo el token OIDC
    // al ejecutarse) o, en local/antiguo, BLOB_READ_WRITE_TOKEN.
    const hasBlob = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
    if (review.photoCount > 0 && !hasBlob) {
      console.error("[resenas/moderar] falta BLOB_STORE_ID o BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob)");
      return { status: "error", message: copy.errors.unavailable };
    }

    const published = await publishReview(env, review);
    // Que el muro de /resenas se regenere ya, sin esperar a la hora de caché.
    revalidateTag(WEB_REVIEWS_TAG);
    revalidatePath("/resenas");

    // El agradecimiento al autor no debe deshacer la publicación si falla.
    try {
      await sendEmail(env, {
        ...reviewPublishedEmail(published, siteUrl()),
        to: published.email,
        replyTo: env.RESEND_TO_EMAIL,
      });
    } catch (err) {
      console.error("[resenas/moderar] email al autor", err);
    }
    return { status: "published" };
  } catch (err) {
    console.error("[resenas/moderar]", err);
    return { status: "error", message: copy.errors.generic };
  } finally {
    await unlockReview(env, id).catch(() => undefined);
  }
}
