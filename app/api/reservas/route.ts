import { createFormHandler } from "@/lib/server/form-handler";
import { reservaSchema } from "@/lib/validations/reserva";
import { formatLongDate } from "@/lib/utils/date";

/** POST /api/reservas — solicitud de reserva; llega por email al restaurante, que la confirma. */
export const POST = createFormHandler({
  key: "reservas",
  schema: reservaSchema,
  toEmail: (r) => ({
    subject: `Reserva: ${r.name} — ${r.guests} pers. — ${r.date} ${r.time}`,
    replyTo: r.email,
    rows: [
      { label: "Nombre", value: r.name },
      { label: "Fecha", value: formatLongDate(r.date) },
      { label: "Hora", value: r.time },
      { label: "Personas", value: r.guests },
      { label: "Teléfono", value: r.phone },
      { label: "Email", value: r.email },
      { label: "Comentarios", value: r.notes ?? "" },
    ],
  }),
});
