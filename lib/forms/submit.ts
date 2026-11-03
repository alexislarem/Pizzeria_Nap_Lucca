/** Respuesta común de /api/contacto y /api/resenas. */
export type FormResponse = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/** Envía un formulario como JSON. Si falla la red, devuelve un error legible en vez de lanzar. */
export async function postForm(url: string, data: unknown): Promise<FormResponse> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as FormResponse;
  } catch {
    return { ok: false, error: "Sin conexión. Revisa tu internet e inténtalo de nuevo." };
  }
}
