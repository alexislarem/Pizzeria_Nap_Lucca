import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal/LegalPage";
import { cookies } from "@/content/legal";

export const metadata: Metadata = {
  title: cookies.title,
  description: cookies.description,
};

export default function CookiesPage() {
  return <LegalPage doc={cookies} />;
}
