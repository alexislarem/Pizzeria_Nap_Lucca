"use client";

import { Controller } from "react-hook-form";
import { Field, inputClass } from "@/components/forms/Field";
import { FormError, FormSuccess } from "@/components/forms/FormFeedback";
import { PhotoPicker } from "@/components/forms/PhotoPicker";
import { PrivacyCheck } from "@/components/forms/PrivacyCheck";
import { Turnstile } from "@/components/forms/Turnstile";
import { useApiForm } from "@/components/forms/useApiForm";
import { PeekRating } from "@/components/ui/PeekRating";
import { SlideCommit } from "@/components/ui/SlideCommit";
import { SpringCheck } from "@/components/ui/SpringCheck";
import { resenaForm as copy } from "@/content/resenas";
import { MAX_PHOTOS, resenaSchema, type Resena } from "@/lib/validations/resena";

/**
 * Formulario de reseña → POST /api/resenas → email al restaurante con las fotos.
 * Nada se publica solo: la reseña se revisa antes (ver app/api/resenas/route.ts).
 * Puntuación (PeekRating), permiso (SpringCheck) y envío deslizando (SlideCommit).
 */
export function ResenaForm() {
  const { form, onSubmit, onToken, turnstileReset, sent, serverError, startOver } =
    useApiForm<Resena>(resenaSchema, "/api/resenas", {
      rating: 0,
      name: "",
      email: "",
      message: "",
      photos: [],
      consent: false,
      privacy: false,
      website: "",
      turnstileToken: "",
    });
  const {
    register,
    control,
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
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <PeekRating
              name="rating"
              legend={copy.labels.rating}
              words={copy.ratingWords}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.rating?.message}
            />
          )}
        />
      </div>

      <Field id="r-name" label={copy.labels.name} error={errors.name?.message}>
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
        id="r-email"
        label={copy.labels.email}
        error={errors.email?.message}
        hint={copy.emailHint}
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
        id="r-message"
        label={copy.labels.message}
        error={errors.message?.message}
        className="sm:col-span-2"
      >
        {(c) => (
          <textarea
            {...c}
            rows={5}
            placeholder={copy.messagePlaceholder}
            className={inputClass}
            {...register("message")}
          />
        )}
      </Field>

      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <PhotoPicker
              value={field.value}
              onChange={field.onChange}
              max={MAX_PHOTOS}
              copy={{ label: copy.labels.photos, ...copy.photos }}
              error={
                errors.photos?.message ??
                errors.photos?.find?.((e) => e?.message)?.message
              }
            />
          )}
        />
      </div>

      <SpringCheck
        id="r-consent"
        className="sm:col-span-2"
        checked={watch("consent")}
        label={copy.consent}
        error={errors.consent?.message}
        {...register("consent")}
      />

      <PrivacyCheck
        id="rs-privacy"
        className="sm:col-span-2"
        checked={watch("privacy")}
        error={errors.privacy?.message}
        registration={register("privacy")}
      />

      {/* Honeypot: fuera de la vista y del teclado; solo un bot lo rellena. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="r-website">No rellenar</label>
        <input
          id="r-website"
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
        <SlideCommit
          onCommit={() => onSubmit()}
          label={copy.slide}
          busyLabel={copy.sending}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
