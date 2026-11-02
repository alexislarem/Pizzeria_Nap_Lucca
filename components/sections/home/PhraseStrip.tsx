import { Doodle } from "@/components/ui/Doodle";
import { homeStrip, homeStripDoodles } from "@/content/home";

/**
 * Franja negra con las expresiones de marca desplazándose en bucle (CSS puro).
 * Entre frase y frase, un dibujo de la marca en amarillo que se balancea.
 * La lista se duplica para que el bucle no tenga salto; la copia es aria-hidden.
 * Con "reducir movimiento" la franja queda quieta.
 */
export function PhraseStrip() {
  const items = homeStrip.map((phrase, i) => (
    <li key={phrase} className="flex items-center gap-8 pr-8">
      <span>{phrase}</span>
      <span className="animate-sway w-8 shrink-0 md:w-12">
        <Doodle
          name={homeStripDoodles[i % homeStripDoodles.length] ?? "albahaca"}
          className="bg-primary max-h-12 md:max-h-16"
        />
      </span>
    </li>
  ));

  return (
    <div className="bg-fg text-primary my-10 overflow-hidden py-5 md:my-16">
      <div className="animate-marquee font-display flex w-max text-3xl font-black uppercase motion-reduce:animate-none md:text-5xl">
        <ul className="flex">{items}</ul>
        <ul className="flex" aria-hidden>
          {items}
        </ul>
      </div>
    </div>
  );
}
