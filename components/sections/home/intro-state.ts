import { useSyncExternalStore } from "react";
import { INTRO_ATTR as ATTR } from "./intro-script";

/**
 * Estado compartido de la intro de entrada (IntroSplash) con el hero.
 * Vive en un atributo de <html> para que lo pueda poner también el script
 * de layout.tsx ANTES de que React arranque (y así el telón no parpadea):
 *   - sin atributo → la intro está en curso; el hero espera
 *   - "skip"       → "menos movimiento": no hay intro
 *   - "done"       → el telón ya está subiendo; el hero puede entrar
 */
const EVENT = "luca:intro";

type IntroState = "pending" | "skip" | "done";

function readState(): IntroState {
  const value = document.documentElement.getAttribute(ATTR);
  return value === "skip" || value === "done" ? value : "pending";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function setIntroState(state: Exclude<IntroState, "pending">) {
  document.documentElement.setAttribute(ATTR, state);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * ¿Se vio ya la intro en ESTA carga de la página? Vive en memoria, así que al
 * recargar (F5) vuelve a `false` y la intro sale otra vez. Solo evita repetirla al
 * volver al Inicio navegando por el menú sin recargar.
 */
let seenThisLoad = false;

export function rememberIntroSeen() {
  seenThisLoad = true;
}

/** `true` cuando el hero ya puede hacer su entrada. En el servidor, siempre `false`. */
export function useIntroReady() {
  return useSyncExternalStore(
    subscribe,
    () => readState() !== "pending",
    () => false
  );
}

/** `true` si el telón no debe mostrarse (ya visto en esta carga o marcado "skip"). */
export function useIntroSkipped() {
  return useSyncExternalStore(
    subscribe,
    () => readState() === "skip" || seenThisLoad,
    () => false
  );
}
