import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal/LegalPage";
import { privacidad } from "@/content/legal";

export const metadata: Metadata = {
  title: privacidad.title,
  description: privacidad.description,
};

export default function PrivacidadPage() {
  return <LegalPage doc={privacidad} />;
}
