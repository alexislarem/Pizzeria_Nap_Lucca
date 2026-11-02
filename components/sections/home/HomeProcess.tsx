import { Reveal } from "@/components/ui/Reveal";
import { SpinningPizza } from "@/components/ui/SpinningPizza";
import { homeProcess } from "@/content/home";
import { ProcessTicket } from "./ProcessTicket";

/** Inclinación y altura de cada ticket en escritorio: juntos dibujan un arco sobre la pizza. */
const ARC = [
  { tilt: -6, lift: 28 },
  { tilt: -2, lift: 0 },
  { tilt: 2, lift: 0 },
  { tilt: 6, lift: 28 },
] as const;

/**
 * Proceso: bloque marrón (color de los carteles de marca) con los 4 pasos como
 * tickets de feria en arco (se elevan y se sellan con su dibujo al tocarlos) y,
 * debajo, media pizza que gira con el scroll.
 */
export function HomeProcess() {
  return (
    <section aria-labelledby="home-process-title" className="px-4 py-16 md:py-24">
      <div className="bg-luca-brown text-surface relative mx-auto max-w-6xl overflow-hidden rounded-xl px-5 pt-14 md:px-10 md:pt-20">
        <Reveal className="text-center">
          <p className="font-display text-sm font-extrabold tracking-[0.2em] uppercase">
            {homeProcess.eyebrow}
          </p>
          <h2
            id="home-process-title"
            className="font-display mt-2 text-4xl leading-none font-black uppercase md:text-6xl"
          >
            {homeProcess.title}
          </h2>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-4 md:gap-3">
          {homeProcess.steps.map((step, i) => {
            const arc = ARC[i % ARC.length] ?? ARC[0];
            return (
              <li
                key={step.title}
                // Variables CSS: solo en escritorio se aplica el arco (md:[transform:…]).
                style={
                  {
                    "--tilt": `${arc.tilt}deg`,
                    "--lift": `${arc.lift}px`,
                  } as React.CSSProperties
                }
                className="md:[transform:translateY(var(--lift))_rotate(var(--tilt))]"
              >
                <Reveal delay={i * 0.08} className="h-full">
                  <ProcessTicket step={step} index={i} />
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Ventana que enseña solo la mitad superior de la pizza (efecto "asoma desde abajo"). */}
        <div className="relative mx-auto mt-14 aspect-[2/1] w-[min(100%,38rem)] overflow-hidden md:mt-20">
          <SpinningPizza
            photo={homeProcess.pizza}
            ringText={homeProcess.ring}
            className="absolute inset-x-0 top-0 w-full"
          />
        </div>
      </div>
    </section>
  );
}
