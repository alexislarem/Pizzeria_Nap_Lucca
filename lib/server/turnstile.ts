import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyResponse = { success: boolean; "error-codes"?: string[] };

/** Pregunta a Cloudflare si el token de la casilla "no soy un robot" es válido (cada token sirve una vez). */
export async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as VerifyResponse;
    return data.success;
  } catch {
    // Si Cloudflare no responde, se rechaza: mejor un reintento que dejar pasar spam.
    return false;
  }
}
