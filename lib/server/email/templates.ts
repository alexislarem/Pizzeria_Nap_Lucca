import "server-only";
import { siteConfig } from "@/site.config";
import type { Contacto } from "@/lib/validations/contacto";
import type { StoredReview } from "@/lib/server/reviews/store";
import {
  button,
  escapeHtml,
  layout,
  mailTheme,
  paragraph,
  quote,
  rows,
  smallPrint,
  stars,
} from "@/lib/server/email/layout";

/**
 * Cada función devuelve un email listo para enviar: asunto + HTML con la marca + texto plano
 * (la versión de texto la usan relojes, lectores de pantalla y clientes de correo antiguos).
 */
export type EmailContent = { subject: string; html: string; text: string };

const firstName = (name: string) => name.split(" ")[0] ?? name;

/* ── Contacto → restaurante ─────────────────────────────────────────────── */

export function contactEmail(c: Contacto, baseUrl: string): EmailContent {
  const phoneHref = c.phone ? `tel:${c.phone.replace(/[\s-]/g, "")}` : undefined;
  const body = [
    paragraph(`<strong>${escapeHtml(c.name)}</strong> os ha escrito desde el formulario de contacto de la web:`),
    quote(c.message),
    rows([
      { label: "Nombre", value: c.name },
      { label: "Email", value: c.email, href: `mailto:${c.email}` },
      { label: "Teléfono", value: c.phone ?? "", href: phoneHref },
    ]),
    button(`mailto:${c.email}?subject=${encodeURIComponent("Re: tu mensaje a LUCA")}`, `Responder a ${firstName(c.name)}`, "gold"),
    phoneHref ? button(phoneHref, "Llamar", "dark") : "",
    smallPrint("También puedes pulsar «Responder» en tu correo: la respuesta le llega directamente."),
  ].join("");

  return {
    subject: `💬 Nuevo mensaje de ${c.name}`,
    html: layout({ eyebrow: "Mensaje de la web", title: "Tenéis un mensaje nuevo", preheader: c.message.slice(0, 120), body, baseUrl }),
    text: [
      `Nuevo mensaje desde la web de LUCA`,
      ``,
      c.message,
      ``,
      `Nombre: ${c.name}`,
      `Email: ${c.email}`,
      c.phone ? `Teléfono: ${c.phone}` : "",
      ``,
      `Pulsa «Responder» para contestarle directamente.`,
    ]
      .filter((l) => l !== "")
      .join("\n"),
  };
}

/* ── Reseña nueva → restaurante (con botones Publicar / Rechazar) ──────── */

type ModerationLinks = { publish: string; reject: string };

export function reviewModerationEmail(r: StoredReview, links: ModerationLinks, baseUrl: string): EmailContent {
  const photosNote = r.photoCount
    ? `📷 Incluye <strong>${r.photoCount} foto${r.photoCount > 1 ? "s" : ""}</strong> (adjuntas a este correo). Si la publicas, también saldrán en la web.`
    : "Sin fotos.";
  const body = [
    `<div style="font-size:30px;letter-spacing:4px;color:${mailTheme.gold};line-height:1;margin-bottom:6px" aria-label="${r.rating} de 5 estrellas">${stars(r.rating)}</div>`,
    paragraph(`<strong>${escapeHtml(r.name)}</strong> ha dejado una reseña de <strong>${r.rating}/5</strong> en la web:`),
    quote(r.message),
    paragraph(photosNote),
    rows([
      { label: "Nombre", value: r.name },
      { label: "Email", value: r.email, href: `mailto:${r.email}` },
      { label: "Permiso", value: "Acepta que se publique con su nombre" },
    ]),
    `<div style="margin:26px 0 4px;font-family:${mailTheme.font};font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${mailTheme.brown}">¿La publicamos?</div>`,
    button(links.publish, "✓ Publicar reseña", "dark"),
    button(links.reject, "✕ Rechazar", "outline"),
    smallPrint(
      "Al pulsar se abre una página para confirmar. Si la publicas, aparece al momento en la web y le enviamos un email de agradecimiento. Si la rechazas, se borra y no se le avisa.<br>Los botones caducan en 30 días; si no haces nada, la reseña se borra sola."
    ),
  ].join("");

  return {
    subject: `⭐ Nueva reseña ${stars(r.rating)} de ${r.name} — ¿la publicamos?`,
    html: layout({ eyebrow: "Reseña por revisar", title: "Os han dejado una reseña", preheader: `${r.rating}/5 · ${r.message.slice(0, 100)}`, body, baseUrl }),
    text: [
      `Nueva reseña en la web de LUCA (${r.rating}/5 ${stars(r.rating)})`,
      ``,
      `De: ${r.name} <${r.email}>`,
      ``,
      r.message,
      ``,
      r.photoCount ? `Fotos: ${r.photoCount} (adjuntas)` : `Sin fotos`,
      ``,
      `Publicar: ${links.publish}`,
      `Rechazar: ${links.reject}`,
      ``,
      `Los enlaces caducan en 30 días.`,
    ].join("\n"),
  };
}

/* ── Reseña publicada → autor ───────────────────────────────────────────── */

export function reviewPublishedEmail(r: StoredReview, baseUrl: string): EmailContent {
  const wallUrl = `${baseUrl}/resenas`;
  const reserveUrl = `${baseUrl}${siteConfig.reserveHref}`;
  const body = [
    paragraph(`¡Hola, ${escapeHtml(firstName(r.name))}!`),
    paragraph(
      "Ya hemos leído tu reseña y la hemos colgado en nuestra barra de comandas, junto a las de quienes también se han sentado a nuestra mesa. Gracias por dedicarnos tu tiempo: cada palabra nos ayuda a seguir amasando con cariño."
    ),
    quote(r.message),
    button(wallUrl, "Ver mi reseña", "gold"),
    button(reserveUrl, "Reservar mesa", "dark"),
    smallPrint(
      `Si quieres cambiarla o retirarla, responde a este correo y lo hacemos.<br>Te escribimos porque dejaste tu reseña en ${escapeHtml(baseUrl.replace(/^https?:\/\//, ""))}; no te enviaremos publicidad.`
    ),
  ].join("");

  return {
    subject: "🍕 ¡Tu reseña ya está en la web de LUCA! Grazie mille",
    html: layout({ eyebrow: "Grazie mille", title: "Tu reseña ya está publicada", preheader: "Gracias por contarnos tu experiencia en LUCA.", body, baseUrl }),
    text: [
      `¡Hola, ${firstName(r.name)}!`,
      ``,
      `Tu reseña ya está publicada en la web de LUCA. ¡Grazie mille por dedicarnos tu tiempo!`,
      ``,
      `"${r.message}"`,
      ``,
      `Verla: ${wallUrl}`,
      `Reservar mesa: ${reserveUrl}`,
      ``,
      `Si quieres cambiarla o retirarla, responde a este correo.`,
      ``,
      `LUCA — Pizza Napoletana · ${siteConfig.contact.address} · ${siteConfig.contact.phone}`,
    ].join("\n"),
  };
}
