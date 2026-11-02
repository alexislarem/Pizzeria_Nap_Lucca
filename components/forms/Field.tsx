import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Estilo común de inputs, selects y textareas (tokens de globals.css). */
export const inputClass = cn(
  "w-full rounded-sm border-2 border-border bg-bg px-4 py-3 text-base text-fg transition-colors",
  "placeholder:text-fg-muted/70 hover:border-fg-muted focus:border-fg focus:outline-none",
  "aria-[invalid=true]:border-accent"
);

/** Atributos que conectan el campo con su etiqueta y su mensaje de error (accesibilidad). */
export type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  /** Texto de ayuda bajo el campo. */
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Recibe los atributos de accesibilidad y devuelve el <input>/<select>/<textarea>. */
  children: (control: ControlProps) => ReactNode;
};

/** Etiqueta + control + ayuda/error. El error se lee por lector de pantalla gracias a aria-describedby. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-fg-muted"> (opcional)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
