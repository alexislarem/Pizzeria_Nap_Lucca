"use client";

import Link from "next/link";
import type { UseFormRegisterReturn } from "react-hook-form";
import { SpringCheck } from "@/components/ui/SpringCheck";
import { privacyConsent } from "@/content/legal";

type PrivacyCheckProps = {
  id: string;
  checked: boolean;
  error?: string;
  registration: UseFormRegisterReturn<"privacy">;
  className?: string;
};

/** Casilla obligatoria "He leído y acepto la política de privacidad" (con enlace en pestaña nueva). */
export function PrivacyCheck({
  id,
  checked,
  error,
  registration,
  className,
}: PrivacyCheckProps) {
  return (
    <SpringCheck
      id={id}
      className={className}
      checked={checked}
      error={error}
      label={
        <>
          {privacyConsent.before}{" "}
          <Link
            href="/privacidad"
            target="_blank"
            className="font-semibold underline underline-offset-4"
          >
            {privacyConsent.link}
          </Link>
          .
        </>
      }
      {...registration}
    />
  );
}
