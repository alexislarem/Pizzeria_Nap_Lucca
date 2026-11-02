"use client";

import { Field, inputClass } from "@/components/forms/Field";
import { FormError, FormSuccess } from "@/components/forms/FormFeedback";
import { PrivacyCheck } from "@/components/forms/PrivacyCheck";
import { Turnstile } from "@/components/forms/Turnstile";
import { useApiForm } from "@/components/forms/useApiForm";
import { buttonVariants } from "@/components/ui/Button";
import { contactoForm as copy } from "@/content/contacto";
import { contactoSchema, type Contacto } from "@/lib/validations/contacto";
import { cn } from "@/lib/utils/cn";

/** Formulario de Contacto → POST /api/contacto → email al restaurante. */
export function ContactoForm() {
  const { form, onSubmit, onToken, turnstileReset, sent, serverError, startOver } =
    useApiForm<Contacto>(contactoSchema, "/api/contacto", {
      name: "",
      email: "",
      phone: "",
      message: "",
      privacy: false,
      website: "",
      turnstileToken: "",
    });
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  if (sent) {
    return (
      <FormSuccess
        title={copy.success.title}
        text={copy.success.text}
        againLabel={copy.success.again}
        onAgain={startOver}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <Field
        id="c-name"
        label={copy.labels.name}
        error={errors.name?.message}
        className="sm:col-span-2"
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
      <Field id="c-email" label={copy.labels.email} error={errors.email?.message}>
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
        id="c-phone"
        label={copy.labels.phone}
        error={errors.phone?.message}
        optional
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
        id="c-message"
        label={copy.labels.message}
        error={errors.message?.message}
        className="sm:col-span-2"
      >
        {(c) => (
          <textarea {...c} rows={5} className={inputClass} {...register("message")} />
        )}
      </Field>

      <PrivacyCheck
        id="c-privacy"
        className="sm:col-span-2"
        checked={watch("privacy")}
        error={errors.privacy?.message}
        registration={register("privacy")}
      />

      {/* Honeypot: fuera de la vista y del teclado; solo un bot lo rellena. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">No rellenar</label>
        <input
          id="c-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="sm:col-span-2">
        <Turnstile onToken={onToken} resetKey={turnstileReset} />
        {errors.turnstileToken?.message && (
          <p className="text-accent mt-1.5 text-sm font-semibold">
            {errors.turnstileToken.message}
          </p>
        )}
      </div>

      <div className="space-y-4 sm:col-span-2">
        <FormError message={serverError} />
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
