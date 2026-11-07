/**
 * Textos legales: Aviso legal (LSSI-CE art. 10), Política de privacidad
 * (RGPD art. 13) y Política de cookies (LSSI-CE art. 22.2).
 * Los datos del titular vienen de site.config.ts → legal (dados por el cliente el 2026-11-03).
 *
 * TODO: plantilla redactada para esta web concreta (qué datos recoge y con qué
 * servicios); conviene que la revise un asesor antes de publicar.
 */
import { siteConfig } from "@/site.config";

const { contact, legal, url } = siteConfig;

export type LegalSection = { title: string; paragraphs: string[] };
export type LegalDoc = {
  slug: "aviso-legal" | "privacidad" | "cookies";
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const owner = `${legal.owner} (NIF ${legal.taxId})`;
const registry = legal.registry ? ` Inscrita en ${legal.registry}.` : "";
const site = url.startsWith("TODO") ? "esta web" : url;

export const avisoLegal: LegalDoc = {
  slug: "aviso-legal",
  title: "Aviso legal",
  description:
    "Datos del titular y condiciones de uso de la web de LUCA — Pizza Napoletana.",
  updated: "Noviembre 2026",
  sections: [
    {
      title: "Titular de la web",
      paragraphs: [
        `En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que ${site} es titularidad de ${owner}, con domicilio en ${legal.address}.${registry}`,
        `Establecimiento: LUCA — Pizza Napoletana, ${contact.address}.`,
        `Contacto: ${contact.email} · ${contact.phone} (también WhatsApp) · ${contact.landline}.`,
      ],
    },
    {
      title: "Objeto y uso de la web",
      paragraphs: [
        "Esta web presenta el restaurante LUCA — Pizza Napoletana: su carta, su historia, fotografías y formas de contacto y reserva. Quien la visita se compromete a usarla de forma lícita y a no dañar su funcionamiento.",
        "Las reservas se gestionan por WhatsApp: el formulario de la web prepara un mensaje que envías tú desde tu WhatsApp. La reserva no es definitiva hasta que el restaurante la confirma por WhatsApp o por teléfono.",
      ],
    },
    {
      title: "Precios y carta",
      paragraphs: [
        "Los precios de la carta incluyen IVA y pueden cambiar sin previo aviso. En caso de diferencia, prevalece la carta vigente en el local.",
      ],
    },
    {
      title: "Propiedad intelectual",
      paragraphs: [
        "Los textos, fotografías, logotipos, ilustraciones y el diseño de la web pertenecen a su titular o se usan con permiso de sus autores. No se permite copiarlos ni reutilizarlos sin autorización.",
        "Las reseñas mostradas proceden de Google Maps o han sido enviadas por sus autores, que autorizan su publicación.",
      ],
    },
    {
      title: "Responsabilidad y enlaces",
      paragraphs: [
        "El titular no se hace responsable de los contenidos de webs de terceros enlazadas (Google Maps, Instagram, WhatsApp) ni de interrupciones del servicio ajenas a su control.",
      ],
    },
    {
      title: "Legislación aplicable",
      paragraphs: [
        "Esta web se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores.",
      ],
    },
  ],
};

export const privacidad: LegalDoc = {
  slug: "privacidad",
  title: "Política de privacidad",
  description:
    "Cómo trata LUCA — Pizza Napoletana los datos de reservas, mensajes y reseñas.",
  updated: "Noviembre 2026",
  sections: [
    {
      title: "Responsable del tratamiento",
      paragraphs: [
        `${owner}. Domicilio: ${legal.address}. Email: ${contact.email}. Teléfono: ${contact.phone}.`,
      ],
    },
    {
      title: "Qué datos tratamos y para qué",
      paragraphs: [
        "Reservas: nombre, teléfono, email, fecha, hora, número de personas y comentarios, para gestionar y confirmar tu mesa. La web no guarda ni envía estos datos: con ellos prepara un mensaje que mandas tú por WhatsApp a nuestro número. Los recibimos en el WhatsApp Business del restaurante y te respondemos por ahí.",
        "Si nos escribes por WhatsApp o nos llamas, tratamos los datos que nos des (nombre, teléfono y lo que nos cuentes) para atenderte.",
        "Contacto: nombre, email, teléfono (opcional) y mensaje, para responderte.",
        "Reseñas: puntuación, nombre, email, texto y fotos, para revisarlas y, si nos das permiso, publicarlas en esta web con tu nombre. El email nunca se publica.",
        "No usamos tus datos para enviarte publicidad ni elaboramos perfiles.",
      ],
    },
    {
      title: "Base legal",
      paragraphs: [
        "Tu consentimiento, que das al marcar la casilla de cada formulario o al escribirnos (art. 6.1.a RGPD), y la gestión de la reserva que solicitas (art. 6.1.b RGPD). Puedes retirar el consentimiento cuando quieras escribiendo a nuestro email.",
      ],
    },
    {
      title: "Cuánto tiempo los guardamos",
      paragraphs: [
        "Los datos de reservas y mensajes (también las conversaciones de WhatsApp), el tiempo necesario para atenderte y como máximo un año. Las reseñas publicadas, mientras sigan en la web o hasta que pidas retirarlas.",
      ],
    },
    {
      title: "Quién más los trata (encargados)",
      paragraphs: [
        "Para que la web funcione usamos proveedores que tratan datos solo siguiendo nuestras instrucciones: Vercel (alojamiento), Resend (envío de los emails de contacto y reseñas), Cloudflare Turnstile (protección contra robots), Upstash (límite de envíos, que guarda la IP de forma temporal, y almacén de las reseñas: las pendientes de revisar se borran solas a los 30 días) y Vercel Blob (fotos de las reseñas publicadas). Algunos están en Estados Unidos y se acogen a las garantías del Marco de Privacidad de Datos UE-EE. UU. o a cláusulas contractuales tipo.",
        "Las reservas y los mensajes por WhatsApp viajan por el servicio de WhatsApp (WhatsApp Ireland Limited, grupo Meta), que tiene su propia política de privacidad (whatsapp.com/legal). Usarlo es opcional: también puedes reservar por teléfono.",
        "No cedemos tus datos a terceros salvo obligación legal.",
      ],
    },
    {
      title: "Tus derechos",
      paragraphs: [
        `Puedes pedir acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${contact.email}. Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).`,
      ],
    },
  ],
};

export const cookies: LegalDoc = {
  slug: "cookies",
  title: "Política de cookies",
  description: "Qué cookies y almacenamiento usa la web de LUCA — Pizza Napoletana.",
  updated: "Noviembre 2026",
  sections: [
    {
      title: "Lo que usamos",
      paragraphs: [
        "Esta web no usa cookies de publicidad ni de analítica. Solo usa elementos técnicos necesarios para funcionar, que no requieren consentimiento:",
        "• Cloudflare Turnstile, en los formularios de contacto y reseñas, para comprobar que no eres un robot.",
        '• Almacenamiento local de tu navegador para recordar tus "me gusta" en las reseñas (luca:likes) y si ya aceptaste cargar el mapa (luca:maps-ok). No sale de tu dispositivo.',
      ],
    },
    {
      title: "Google Maps (solo si lo aceptas)",
      paragraphs: [
        'El mapa de la página de Contacto lo sirve Google, que puede instalar sus propias cookies. Por eso no se carga hasta que pulsas "Ver mapa". Más información en la política de privacidad de Google (policies.google.com/privacy).',
      ],
    },
    {
      title: "Cómo borrarlas",
      paragraphs: [
        "Puedes borrar las cookies y el almacenamiento local desde la configuración de tu navegador. Si borras luca:maps-ok, la web volverá a preguntarte antes de mostrar el mapa.",
      ],
    },
  ],
};

export const legalDocs = [avisoLegal, privacidad, cookies] as const;

/** Textos comunes de los formularios (casilla de privacidad). */
export const privacyConsent = {
  before: "He leído y acepto la",
  link: "política de privacidad",
  error: "Necesitamos que aceptes la política de privacidad",
} as const;
