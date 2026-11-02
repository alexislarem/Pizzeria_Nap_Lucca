import { ImageResponse } from "next/og";
import { LOGO_PATHS, VIEWBOX } from "@/components/ui/LucaLogo";

/** Icono de la pestaña: la mano de LUCA en negro sobre círculo amarillo (colores de app/globals.css). */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        background: "#f1a200",
      }}
    >
      <svg viewBox={VIEWBOX.mark} width={38} height={53} fill="#1a1a1a">
        <path d={LOGO_PATHS.stroke} />
        <path d={LOGO_PATHS.hand} />
      </svg>
    </div>,
    size
  );
}
