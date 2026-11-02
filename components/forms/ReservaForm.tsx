"use client";

import { Field, inputClass } from "@/components/forms/Field";
import { FormError, FormSuccess } from "@/components/forms/FormFeedback";
import { Turnstile } from "@/components/forms/Turnstile";
import { useApiForm } from "@/components/forms/useApiForm";
import { buttonVariants } from "@/components/ui/Button";
import { reservaForm as copy } from "@/content/contacto";
import { MAX_GUESTS, reservaSchema, type Reserva } from "@/lib/validations/reserva";
import { todayInSpain } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const guestOptions = Array.from({ length: MAX_GUESTS }, (_, i) => String(i + 1));

/** Formulario de reserva → POST /api/reservas → email al restaurante. */
export function ReservaForm() {
  const { form, onSubmit, onToken, turnstileReset, sent, serverError, startOver } = useApiForm<Reserva>(
    reservaSchema,
    "/api/reservas",
    { name: "", phone: "", email: "", date: "", time: "", guests: "2", notes: "", website: "", turnstileToken: "" }
  );
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  if (sent) {
    return <FormSuccess title={copy.success.title} text={copy.success.text} againLabel={copy.success.again} onAgain={startOver} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-6">
      <Field id="r-date" label={copy.labels.date} error={errors.date?.message} className="sm:col-span-2">
        {(c) => <input {...c} type="date" min={todayInSpain()} className={inputClass} {...register("date")} />}
      </Field>
      <Field id="r-time" label={copy.labels.time} error={errors.time?.message} className="sm:col-span-2">
        {(c) => <input {...c} type="time" step={900} className={inputClass} {...register("time")} />}
      </Field>
      <Field id="r-guests" label={copy.labels.guests} error={errors.guests?.message} className="sm:col-span-2">
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
      <p className="-mt-3 text-sm text-fg-muted sm:col-span-6">{copy.guestsHint}</p>

      <Field id="r-name" label={copy.labels.name} error={errors.name?.message} className="sm:col-span-6">
        {(c) => <input {...c} type="text" autoComplete="name" className={inputClass} {...register("name")} />}
      </Field>
      <Field id="r-phone" label={copy.labels.phone} error={errors.phone?.message} className="sm:col-span-3">
        {(c) => <input {...c} type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />}
      </Field>
      <Field id="r-email" label={copy.labels.email} error={errors.email?.message} className="sm:col-span-3">
        {(c) => <input {...c} type="email" autoComplete="email" className={inputClass} {...register("email")} />}
      </Field>
      <Field id="r-notes" label={copy.labels.notes} error={errors.notes?.message} optional className="sm:col-span-6">
        {(c) => <textarea {...c} rows={3} placeholder={copy.notesPlaceholder} className={inputClass} {...register("notes")} />}
      </Field>

      {/* Honeypot: fuera de la vista y del teclado; solo un bot lo rellena. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="r-website">No rellenar</label>
        <input id="r-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="sm:col-span-6">
        <Turnstile onToken={onToken} resetKey={turnstileReset} />
        {errors.turnstileToken?.message && (
          <p className="mt-1.5 text-sm font-semibold text-accent">{errors.turnstileToken.message}</p>
        )}
      </div>

      <div className="space-y-4 sm:col-span-6">
        <FormError message={serverError} />
        <button type="submit" disabled={isSubmitting} className={cn(buttonVariants(), "w-full disabled:opacity-60 sm:w-auto")}>
          {isSubmitting ? copy.sending : copy.submit}
        </button>
      </div>
    </form>
  );
}
