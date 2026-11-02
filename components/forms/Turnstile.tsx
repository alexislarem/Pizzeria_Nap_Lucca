"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/** Lo mínimo de la API de Turnstile que usamos (la carga el script de Cloudflare en window). */
type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      language: string;
      theme: "light";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileProps = {
  /** Recibe el token cuando la casilla se valida, o null si caduca o falla. */
  onToken: (token: string | null) => void;
  /** Cambia este número para pedir una casilla nueva (cada token solo vale para un envío). */
  resetKey: number;
};

/**
 * Casilla "no soy un robot" de Cloudflare Turnstile.
 * Sin librería extra: se carga el script oficial y se pinta el widget en un <div>.
 */
export function Turnstile({ onToken, resetKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  // Guardamos el callback en una ref para no volver a pintar el widget si el padre lo recrea.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !api || !containerRef.current || !SITE_KEY) return;
    widgetId.current = api.render(containerRef.current, {
      sitekey: SITE_KEY,
      language: "es",
      theme: "light",
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    });
    return () => {
      if (widgetId.current) api.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [ready]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) {
      window.turnstile?.reset(widgetId.current);
      onTokenRef.current(null);
    }
  }, [resetKey]);

  if (!SITE_KEY) {
    return <p className="text-sm text-accent">TODO: falta NEXT_PUBLIC_TURNSTILE_SITE_KEY en .env.local</p>;
  }

  return (
    <>
      {/* onReady se ejecuta también al volver a esta página, cuando el script ya estaba cargado. */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
