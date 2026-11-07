/** Resultado de pulsar Publicar / Rechazar (lo comparten la acción del servidor y el panel). */
export type ModerationState =
  | { status: "idle" }
  | { status: "published" }
  | { status: "rejected" }
  | { status: "error"; message: string };
