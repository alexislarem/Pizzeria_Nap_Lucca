import { sendEmail } from "@/lib/server/email/send";
import { contactEmail } from "@/lib/server/email/templates";
import { createFormHandler } from "@/lib/server/form-handler";
import { siteUrl } from "@/lib/utils/site-url";
import { contactoSchema } from "@/lib/validations/contacto";

/** POST /api/contacto — mensaje del formulario de Contacto; llega por email al restaurante. */
export const POST = createFormHandler({
  key: "contacto",
  schema: contactoSchema,
  handle: async (c, env) => {
    // replyTo: al pulsar "Responder" en el correo, se le contesta directamente a quien escribió.
    await sendEmail(env, { ...contactEmail(c, siteUrl()), replyTo: c.email });
  },
});
