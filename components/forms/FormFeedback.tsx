"use client";

import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type FormSuccessProps = {
  title: string;
  text: string;
  againLabel: string;
  onAgain: () => void;
  /** Enlace principal opcional (p. ej. "Abrir WhatsApp" si no se abrió solo). */
  action?: { label: string; href: string };
};

/** Mensaje de envío correcto. Recibe el foco al aparecer para que el lector de pantalla lo anuncie. */
export function FormSuccess({ title, text, againLabel, onAgain, action }: FormSuccessProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="bg-primary text-on-primary rounded-lg p-8 md:p-10"
    >
      <CircleCheck aria-hidden size={40} />
      <p className="font-display mt-4 text-3xl leading-none font-black uppercase md:text-4xl">
        {title}
      </p>
      <p className="mt-3 text-lg">{text}</p>
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "dark" }), "mt-6")}
        >
          {action.label}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      )}
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 block font-semibold underline underline-offset-4"
      >
        {againLabel}
      </button>
    </div>
  );
}

/** Error general del envío (red, servidor, demasiados intentos). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="bg-accent text-on-accent rounded-sm px-4 py-3 text-sm font-semibold"
    >
      {message}
    </p>
  );
}
