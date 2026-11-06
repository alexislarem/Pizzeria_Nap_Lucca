import "server-only";
import { Resend } from "resend";
import type { ServerEnv } from "@/lib/server/env";
import type { EmailContent } from "@/lib/server/email/templates";

/** Archivo adjunto (p. ej. las fotos de una reseña). */
export type EmailAttachment = { filename: string; content: Buffer };

type SendOptions = EmailContent & {
  /** Por defecto, el email del restaurante (RESEND_TO_EMAIL). */
  to?: string;
  /** A quién se contesta al pulsar "Responder". */
  replyTo?: string;
  attachments?: EmailAttachment[];
};

/** Envía un email con Resend desde la dirección de la web. Lanza un error si Resend lo rechaza. */
export async function sendEmail(
  env: Pick<ServerEnv, "RESEND_API_KEY" | "RESEND_FROM_EMAIL" | "RESEND_TO_EMAIL">,
  { to, replyTo, subject, html, text, attachments }: SendOptions
) {
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: to ?? env.RESEND_TO_EMAIL,
    replyTo,
    subject,
    html,
    text,
    attachments,
  });
  if (error) throw new Error(`Resend: ${error.name} ${error.message}`);
}
