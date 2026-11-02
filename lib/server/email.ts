import "server-only";
import { Resend } from "resend";
import type { ServerEnv } from "@/lib/server/env";

/** Escapa < > & " ' para que lo que escribe el usuario nunca se interprete como HTML. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export type EmailRow = { label: string; value: string };

/** Archivo adjunto (p. ej. las fotos de una reseña). */
export type EmailAttachment = { filename: string; content: Buffer };

type SendFormEmailOptions = {
  subject: string;
  rows: EmailRow[];
  /** Email del cliente: al pulsar "Responder" en el correo, se le contesta directamente. */
  replyTo: string;
  attachments?: EmailAttachment[];
};

/** Envía al restaurante un email sencillo (texto + HTML) con los datos del formulario. */
export async function sendFormEmail(env: ServerEnv, { subject, rows, replyTo, attachments }: SendFormEmailOptions) {
  const filled = rows.filter((r) => r.value !== "");
  const text = filled.map((r) => `${r.label}: ${r.value}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:15px">${filled
    .map(
      (r) =>
        `<tr><td style="color:#5f4b44;vertical-align:top"><strong>${escapeHtml(r.label)}</strong></td><td style="white-space:pre-line">${escapeHtml(r.value)}</td></tr>`
    )
    .join("")}</table>`;

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.RESEND_TO_EMAIL,
    replyTo,
    subject,
    text,
    html,
    attachments,
  });
  if (error) throw new Error(`Resend: ${error.name}`);
}
