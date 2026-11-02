"use client";

import { useCallback, useState } from "react";
import { useForm, type DefaultValues, type FieldValues, type Path, type PathValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { postForm } from "@/lib/forms/submit";

type ApiFormValues = FieldValues & { turnstileToken: string };

/**
 * Lógica común de los formularios que envían a una API:
 * validación Zod en el navegador, envío, errores del servidor, éxito y reinicio de Turnstile.
 */
export function useApiForm<T extends ApiFormValues>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, url: string, defaultValues: DefaultValues<T>) {
  const form = useForm<T>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues });
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const { setValue } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null);
    const res = await postForm(url, data);
    // Cada token de Turnstile vale para un solo envío: pedimos uno nuevo siempre.
    setTurnstileReset((n) => n + 1);

    if (res.ok) {
      form.reset();
      setSent(true);
      return;
    }
    setServerError(res.error);
    for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
      if (messages?.[0]) form.setError(field as Path<T>, { message: messages[0] });
    }
  });

  const onToken = useCallback(
    (token: string | null) =>
      setValue("turnstileToken" as Path<T>, (token ?? "") as PathValue<T, Path<T>>, { shouldValidate: Boolean(token) }),
    [setValue]
  );

  return { form, onSubmit, onToken, turnstileReset, sent, serverError, startOver: () => setSent(false) };
}
