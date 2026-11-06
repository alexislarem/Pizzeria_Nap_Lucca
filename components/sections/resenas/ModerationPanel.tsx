"use client";

import { useActionState } from "react";
import { Check, CircleCheckBig, LoaderCircle, Trash2 } from "lucide-react";
import { ButtonLink, buttonVariants } from "@/components/ui/Button";
import { resenaModeracion as copy } from "@/content/resenas";
import { moderateReview } from "@/app/resenas/moderar/actions";
import type { ModerationState } from "@/app/resenas/moderar/state";
import { cn } from "@/lib/utils/cn";

type ModerationPanelProps = {
  /** Enlace firmado del email: viaja oculto en el formulario y el servidor lo vuelve a comprobar. */
  token: string;
  /** Botón que se pulsó en el email: se resalta aquí. */
  preferred: "publish" | "reject";
};

/**
 * Botones Publicar / Rechazar. Envían un formulario normal a la acción del servidor
 * (funciona incluso sin JavaScript); `useActionState` guarda la respuesta para pintar el resultado.
 */
export function ModerationPanel({ token, preferred }: ModerationPanelProps) {
  const [state, action, pending] = useActionState<ModerationState, FormData>(moderateReview, {
    status: "idle",
  });

  if (state.status === "published" || state.status === "rejected") {
    const done = copy.done[state.status];
    return (
      <div role="status" className="bg-primary text-on-primary rounded-xl p-6 md:p-8">
        <p className="font-display flex items-center gap-3 text-3xl font-black uppercase">
          {state.status === "published" && <CircleCheckBig aria-hidden size={30} />}
          {done.title}
        </p>
        <p className="mt-2 max-w-prose">{done.text}</p>
        <ButtonLink href="/resenas" variant="dark" size="sm" className="mt-5">
          {done.cta}
        </ButtonLink>
      </div>
    );
  }

  const publishClass = buttonVariants({ variant: preferred === "publish" ? "dark" : "outline" });
  const rejectClass = buttonVariants({ variant: preferred === "reject" ? "accent" : "outline" });

  return (
    <form action={action} className="border-border rounded-xl border-2 p-6 md:p-8">
      <input type="hidden" name="token" value={token} />
      <p className="font-display text-2xl font-black uppercase">{copy.question}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          name="decision"
          value="publish"
          disabled={pending}
          className={cn(publishClass, "disabled:opacity-60")}
        >
          {pending ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : <Check aria-hidden size={18} />}
          {pending ? copy.working : copy.publish}
        </button>
        <button
          type="submit"
          name="decision"
          value="reject"
          disabled={pending}
          className={cn(rejectClass, preferred !== "reject" && "text-accent", "disabled:opacity-60")}
        >
          <Trash2 aria-hidden size={18} />
          {copy.reject}
        </button>
      </div>
      <p className="text-fg-muted mt-4 text-sm">{copy.rejectHint}</p>
      {state.status === "error" && (
        <p role="alert" className="text-accent mt-4 font-semibold">
          {state.message}
        </p>
      )}
    </form>
  );
}
