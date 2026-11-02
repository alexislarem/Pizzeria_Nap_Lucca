import { ImageResponse } from "next/og";
import { LOGO_PATHS, VIEWBOX } from "@/components/ui/LucaLogo";
import { siteConfig } from "@/site.config";

/**
 * Imagen que aparece al compartir la web (WhatsApp, Instagram, Google…).
 * Se genera al compilar: bloque amarillo de marca con el logo LUCA completo.
 * Los colores van en hex porque aquí no llegan los tokens de CSS
 * (son los de app/globals.css: luca-gold y luca-black).
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "#f1a200";
const INK = "#1a1a1a";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 70,
        background: GOLD,
        color: INK,
      }}
    >
      <svg viewBox={VIEWBOX.full} width={300} height={404} fill={INK}>
        <path d={LOGO_PATHS.stroke} />
        <path d={LOGO_PATHS.hand} />
        <path d={LOGO_PATHS.L} />
        <path d={LOGO_PATHS.U} />
        <path d={LOGO_PATHS.C} />
        <path fillRule="evenodd" d={LOGO_PATHS.A} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 10 }}>
          PIZZA NAPOLETANA
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            padding: "12px 28px",
            borderRadius: 999,
            background: INK,
            color: GOLD,
            fontSize: 30,
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          Valdepeñas · Masa de 72 h
        </div>
      </div>
    </div>,
    size
  );
}
