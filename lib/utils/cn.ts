import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind sin conflictos. Uso: cn("p-4", isActive && "bg-red-500") */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
