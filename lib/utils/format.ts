import type { MenuItem } from "@/content/menu";

const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** 13.5 → "13,50 €" */
export function formatPrice(value: number): string {
  return euro.format(value);
}

/**
 * "Tomate, mozzarella, albahaca y AOVE" → ["Tomate", "mozzarella", "albahaca", "AOVE"].
 * Corta por comas y separa el último " y ". Para las etiquetas de ingredientes de la Carta.
 */
export function splitIngredients(description: string): string[] {
  const parts = description.split(/,\s*/);
  const last = parts.pop() ?? "";
  const [beforeY, ...afterY] = last.split(" y ");
  return [...parts, beforeY ?? "", afterY.join(" y ")]
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Precio de un plato: "13,50 €", o "3,00 € copa · 11,00 € botella" en los vinos. */
export function priceLabel(price: MenuItem["price"]): string {
  return typeof price === "number"
    ? formatPrice(price)
    : `${formatPrice(price.glass)} copa · ${formatPrice(price.bottle)} botella`;
}
