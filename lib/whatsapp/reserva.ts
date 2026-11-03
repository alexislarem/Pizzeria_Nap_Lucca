import { formatLongDate } from "@/lib/utils/date";
import { whatsappMessageHref } from "@/lib/utils/contact";
import type { Reserva } from "@/lib/validations/reserva";
import { reservaWhatsapp as copy } from "@/content/contacto";

/**
 * Convierte la reserva del formulario en el mensaje de WhatsApp que recibe LUCA.
 * Los *asteriscos* ponen el texto en negrita dentro de WhatsApp.
 */
export function reservaMessage(r: Reserva): string {
  const lines = [
    copy.greeting,
    "",
    `📅 *${copy.labels.date}:* ${formatLongDate(r.date)}`,
    `🕖 *${copy.labels.time}:* ${r.time}`,
    `👥 *${copy.labels.guests}:* ${r.guests}`,
    `🙋 *${copy.labels.name}:* ${r.name}`,
    `📞 *${copy.labels.phone}:* ${r.phone}`,
    `✉️ *${copy.labels.email}:* ${r.email}`,
  ];
  if (r.notes) lines.push(`📝 *${copy.labels.notes}:* ${r.notes}`);
  lines.push("", copy.closing);
  return lines.join("\n");
}

/** Enlace wa.me que abre el chat de LUCA con la reserva ya escrita. */
export const reservaWhatsappHref = (r: Reserva) => whatsappMessageHref(reservaMessage(r));
