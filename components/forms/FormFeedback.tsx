"use client";

import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";

type FormSuccessProps = {
  title: string;
  text: string;
  againLabel: string;
  onAgain: () => void;
};

/** Mensaje de envío correcto. Recibe el foco al aparecer para que el lector de pantalla lo anuncie. */
export function FormSuccess({ title, text, againLabel, onAgain }: FormSuccessProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);

  return (
    <div ref={ref} tabIndex={-1} role="status" className="rounded-lg bg-primary p-8 text-on-primary md:p-10">
      <CircleCheck aria-hidden size={40} />
      <p className="mt-4 font-display text-3xl font-black uppercase leading-none md:text-4xl">{title}</p>
      <p className="mt-3 text-lg">{text}</p>
      <button type="button" onClick={onAgain} className="mt-6 font-semibold underline underline-offset-4">
        {againLabel}
      </button>
    </div>
  );
}

/** Error general del envío (red, servidor, demasiados intentos). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-on-accent">
      {message}
    </p>
  );
}
