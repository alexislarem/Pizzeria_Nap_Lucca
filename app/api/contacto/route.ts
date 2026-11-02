import { createFormHandler } from "@/lib/server/form-handler";
import { contactoSchema } from "@/lib/validations/contacto";

/** POST /api/contacto — mensaje del formulario de Contacto; llega por email al restaurante. */
export const POST = createFormHandler({
  key: "contacto",
  schema: contactoSchema,
  toEmail: (c) => ({
    subject: `Mensaje web de ${c.name}`,
    replyTo: c.email,
    rows: [
      { label: "Nombre", value: c.name },
      { label: "Email", value: c.email },
      { label: "Teléfono", value: c.phone ?? "" },
      { label: "Mensaje", value: c.message },
    ],
  }),
});
