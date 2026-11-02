/**
 * Constantes de la intro de entrada, sin hooks de React: este archivo lo importa
 * también layout.tsx, que es de servidor. La lógica de cliente está en intro-state.ts.
 */
export const INTRO_ATTR = "data-intro";

/**
 * Script en línea para <head>: antes del primer pintado, salta la intro solo si el
 * usuario pide "menos movimiento". En cualquier otro caso, cada carga del Inicio la muestra.
 */
export const introSkipScript = `try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("${INTRO_ATTR}","skip")}catch(e){}`;
