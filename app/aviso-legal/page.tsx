import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal/LegalPage";
import { avisoLegal } from "@/content/legal";

export const metadata: Metadata = {
  title: avisoLegal.title,
  description: avisoLegal.description,
};

export default function AvisoLegalPage() {
  return <LegalPage doc={avisoLegal} />;
}
