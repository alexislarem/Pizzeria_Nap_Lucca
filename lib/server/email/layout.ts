import "server-only";
import { siteConfig } from "@/site.config";
import { mapsHref, telHref } from "@/lib/utils/contact";

/**
 * Piezas HTML de los emails de LUCA.
 *
 * Los correos no entienden Tailwind ni variables CSS (Gmail y Outlook las ignoran), así que
 * aquí los colores van escritos a mano. Son COPIA de los tokens de app/globals.css:
 * si cambia la marca allí, hay que cambiarlos aquí también.
 * Maquetación con <table> y estilos en línea: es lo único que respetan todos los clientes de correo.
 */
export const mailTheme = {
  gold: "#f1a200",
  cream: "#e8e1d9",
  white: "#ffffff",
  black: "#1a1a1a",
  inkSoft: "#5f4b44",
  line: "#d9cfc4",
  red: "#a22e2f",
  brown: "#563933",
  font: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  display: "'League Spartan', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
} as const;

const t = mailTheme;

/** Escapa < > & " ' para que lo que escribe el usuario nunca se interprete como HTML. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Texto del usuario con sus saltos de línea convertidos en <br>. */
export const multiline = (value: string) => escapeHtml(value).replace(/\n/g, "<br>");

/** "★★★★☆" */
export const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

/** Botón "a prueba de balas": se ve como botón incluso en Outlook (sin imágenes ni CSS moderno). */
export function button(href: string, label: string, variant: "dark" | "gold" | "outline" = "dark") {
  const styles = {
    dark: { bg: t.black, fg: t.gold, border: t.black },
    gold: { bg: t.gold, fg: t.black, border: t.gold },
    outline: { bg: t.white, fg: t.red, border: t.red },
  }[variant];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:6px 6px 6px 0"><tr><td style="border-radius:999px;background:${styles.bg};border:2px solid ${styles.border}"><a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${t.font};font-size:15px;font-weight:700;color:${styles.fg};text-decoration:none;border-radius:999px">${escapeHtml(label)}</a></td></tr></table>`;
}

export type EmailRow = { label: string; value: string; href?: string };

/** Tabla de datos (Nombre, Email…). Las filas vacías no se pintan. */
export function rows(items: EmailRow[]) {
  const filled = items.filter((r) => r.value !== "");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;border-top:2px dashed ${t.line}">${filled
    .map((r) => {
      const value = r.href
        ? `<a href="${escapeHtml(r.href)}" style="color:${t.black};text-decoration:underline">${escapeHtml(r.value)}</a>`
        : escapeHtml(r.value);
      return `<tr><td style="padding:12px 12px 12px 0;border-bottom:2px dashed ${t.line};font-family:${t.font};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${t.brown};width:110px;vertical-align:top">${escapeHtml(r.label)}</td><td style="padding:12px 0;border-bottom:2px dashed ${t.line};font-family:${t.font};font-size:15px;color:${t.black};vertical-align:top">${value}</td></tr>`;
    })
    .join("")}</table>`;
}

/** Cita destacada (el texto de una reseña o de un mensaje), con la barra amarilla de la marca. */
export function quote(text: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0"><tr><td style="background:${t.cream};border-left:5px solid ${t.gold};border-radius:6px;padding:18px 20px;font-family:${t.font};font-size:16px;line-height:1.6;color:${t.black}">${multiline(text)}</td></tr></table>`;
}

export const paragraph = (html: string) =>
  `<p style="margin:0 0 14px;font-family:${t.font};font-size:16px;line-height:1.6;color:${t.black}">${html}</p>`;

export const smallPrint = (html: string) =>
  `<p style="margin:18px 0 0;font-family:${t.font};font-size:13px;line-height:1.5;color:${t.inkSoft}">${html}</p>`;

type LayoutOptions = {
  /** Etiqueta pequeña encima del título ("Nueva reseña"). */
  eyebrow: string;
  title: string;
  /** Texto que Gmail/Outlook muestran junto al asunto en la bandeja de entrada. */
  preheader: string;
  body: string;
  /** URL absoluta de la web (para el logo y los enlaces del pie). */
  baseUrl: string;
};

/** Esqueleto común: cabecera amarilla con el logo, tarjeta blanca y pie negro con los datos del local. */
export function layout({ eyebrow, title, preheader, body, baseUrl }: LayoutOptions) {
  const { contact } = siteConfig;
  const site = baseUrl.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=League+Spartan:wght@900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${t.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${t.cream}">
<tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${t.white};border-radius:18px;overflow:hidden">
    <tr><td style="background:${t.gold};padding:26px 32px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:14px;vertical-align:middle"><img src="${siteConfig.url}/apple-icon" width="56" height="56" alt="" style="display:block;border-radius:14px;border:2px solid ${t.black}"></td>
        <td style="vertical-align:middle">
          <div style="font-family:${t.display};font-size:34px;line-height:1;font-weight:900;letter-spacing:2px;color:${t.black}">LUCA</div>
          <div style="font-family:${t.font};font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${t.black};padding-top:4px">Pizza Napoletana · Valdepeñas</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:34px 32px 30px">
      <div style="display:inline-block;background:${t.cream};border-radius:999px;padding:6px 14px;font-family:${t.font};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${t.brown}">${escapeHtml(eyebrow)}</div>
      <h1 style="margin:14px 0 18px;font-family:${t.display};font-size:28px;line-height:1.1;font-weight:900;text-transform:uppercase;color:${t.black}">${escapeHtml(title)}</h1>
      ${body}
    </td></tr>
    <tr><td style="background:${t.black};padding:24px 32px;font-family:${t.font};font-size:13px;line-height:1.7;color:${t.cream}">
      <div style="font-family:${t.display};font-size:16px;font-weight:900;letter-spacing:1px;color:${t.gold}">LUCA — PIZZA NAPOLETANA</div>
      <a href="${escapeHtml(mapsHref)}" style="color:${t.cream};text-decoration:none">${escapeHtml(contact.address)}</a><br>
      <a href="${telHref}" style="color:${t.cream};text-decoration:none">${escapeHtml(contact.phone)}</a> · <a href="${baseUrl}" style="color:${t.gold};text-decoration:none">${escapeHtml(site)}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
