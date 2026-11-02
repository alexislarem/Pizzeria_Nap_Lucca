import { ImageResponse } from "next/og";
import { LOGO_PATHS, VIEWBOX } from "@/components/ui/LucaLogo";

/** Icono al guardar la web en la pantalla de inicio del iPhone (180 × 180). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1a200",
      }}
    >
      <svg viewBox={VIEWBOX.mark} width={100} height={140} fill="#1a1a1a">
        <path d={LOGO_PATHS.stroke} />
        <path d={LOGO_PATHS.hand} />
      </svg>
    </div>,
    size
  );
}
