import type { Metadata } from "next";
import { ReservarHero } from "@/components/sections/reservar/ReservarHero";
import { pages } from "@/content/pages";

export const metadata: Metadata = {
  title: pages.reservar.title,
  description: pages.reservar.description,
};

/** Reservar: formulario (→ /api/reservas) con alternativas de teléfono y email. */
export default function ReservarPage() {
  return <ReservarHero />;
}
