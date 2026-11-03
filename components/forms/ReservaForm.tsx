"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, inputClass } from "@/components/forms/Field";
import { FormSuccess } from "@/components/forms/FormFeedback";
import { PrivacyCheck } from "@/components/forms/PrivacyCheck";
import { buttonVariants } from "@/components/ui/Button";
import { reservaForm as copy } from "@/content/contacto";
import { MAX_GUESTS, reservaSchema, type Reserva } from "@/lib/validations/reserva";
import { openingHoursFor, todayInSpain } from "@/lib/utils/date";
import { reservaWhatsappHref } from "@/lib/whatsapp/reserva";
import { cn } from "@/lib/utils/cn";

const guestOptions = Array.from({ length: MAX_GUESTS }, (_, i) => String(i + 1));

/**
 * Formulario de reserva → WhatsApp de LUCA.
 * Se valida aquí mismo (Zod) y, si todo está bien, se abre WhatsApp con la reserva
 * ya escrita para el número del restaurante; la persona solo pulsa enviar.
 * No pasa por ningún servidor ni manda email.
 */
export function ReservaForm() {
  const form = useForm<Reserva>({
    resolver: zodResolver(reservaSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      notes: "",
      privacy: false,
    },
  });
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  // Enlace de WhatsApp de la última reserva: si existe, se muestra el aviso de "ya casi está".
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const onSubmit = form.handleSubmit((data) => {
    const url = reservaWhatsappHref(data);
    // Pestaña nueva: en el móvil abre la app; en el ordenador, WhatsApp Web o de escritorio.
    // Si el navegador lo bloquea, el aviso de éxito tiene el botón "Abrir WhatsApp".
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
    setWhatsappUrl(url);
  });

  if (whatsappUrl) {
    return (
      <FormSuccess
        title={copy.success.title}
        text={copy.success.text}
        action={{ label: copy.success.open, href: whatsappUrl }}
        againLabel={copy.success.again}
        onAgain={() => setWhatsappUrl(null)}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-1 gap-5 sm:grid-cols-6"
    >
      <Field
        id="r-date"
        label={copy.labels.date}
        error={errors.date?.message}
        className="sm:col-span-2"
      >
        {(c) => (
          <input
            {...c}
            type="date"
            min={todayInSpain()}
            className={inputClass}
            {...register("date")}
          />
        )}
      </Field>
      <Field
        id="r-time"
        label={copy.labels.time}
        error={errors.time?.message}
        className="sm:col-span-2"
      >
        {(c) => (
          // min/max según el día elegido: el selector del móvil ya propone horas de apertura.
          <input
            {...c}
            type="time"
            step={900}
            min={openingHoursFor(watch("date"))?.open}
            max={openingHoursFor(watch("date"))?.close}
            className={inputClass}
            {...register("time")}
          />
        )}
      </Field>
      <Field
        id="r-guests"
        label={copy.labels.guests}
        error={errors.guests?.message}
        className="sm:col-span-2"
      >
        {(c) => (
          <select {...c} className={inputClass} {...register("guests")}>
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
      </Field>
      <p className="text-fg-muted -mt-3 text-sm sm:col-span-6">{copy.guestsHint}</p>

      <Field
        id="r-name"
        label={copy.labels.name}
        error={errors.name?.message}
        className="sm:col-span-6"
      >
        {(c) => (
          <input
            {...c}
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register("name")}
          />
        )}
      </Field>
      <Field
        id="r-phone"
        label={copy.labels.phone}
        error={errors.phone?.message}
        className="sm:col-span-3"
      >
        {(c) => (
          <input
            {...c}
            type="tel"
            autoComplete="tel"
            className={inputClass}
            {...register("phone")}
          />
        )}
      </Field>
      <Field
        id="r-email"
        label={copy.labels.email}
        error={errors.email?.message}
        className="sm:col-span-3"
      >
        {(c) => (
          <input
            {...c}
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
        )}
      </Field>
      <Field
        id="r-notes"
        label={copy.labels.notes}
        error={errors.notes?.message}
        optional
        className="sm:col-span-6"
      >
        {(c) => (
          <textarea
            {...c}
            rows={3}
            placeholder={copy.notesPlaceholder}
            className={inputClass}
            {...register("notes")}
          />
        )}
      </Field>

      <PrivacyCheck
        id="r-privacy"
        className="sm:col-span-6"
        checked={watch("privacy")}
        error={errors.privacy?.message}
        registration={register("privacy")}
      />

      <div className="space-y-4 sm:col-span-6">
        <p className="text-fg-muted text-sm">{copy.whatsappNote}</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(buttonVariants(), "w-full disabled:opacity-60 sm:w-auto")}
        >
          {isSubmitting ? copy.sending : copy.submit}
        </button>
      </div>
    </form>
  );
}
