"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import type { Media } from "@/content/home";
import { cn } from "@/lib/utils/cn";

type DepthGalleryProps = {
  /** Fotos (y vídeos cortos opcionales) en el orden en que se atraviesan. */
  photos: readonly Media[];
  /** Distancia (px) entre una foto y la siguiente en profundidad. */
  spacing?: number;
  /** Altura de scroll (en vh) que se dedica a cada foto. */
  scrollPerPhoto?: number;
  /** Contenido fijo encima del escenario (p. ej. una etiqueta con un dato). */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Desplazamiento lateral de cada foto (en % de su ancho) para que no queden
 * en fila india. Fijo, no aleatorio: así servidor y navegador pintan lo mismo.
 */
const SCATTER = [
  { x: 0, y: 0, rotate: 0 },
  { x: -14, y: 6, rotate: -3 },
  { x: 12, y: -8, rotate: 2 },
  { x: -8, y: -10, rotate: 3 },
  { x: 14, y: 8, rotate: -2 },
] as const;

/**
 * Galería "dolly": las fotos están apiladas en profundidad y, al hacer scroll,
 * la cámara avanza y las va atravesando. La sección es más alta que la pantalla
 * y el escenario se queda fijo (sticky) mientras dura el recorrido; termina en
 * la última foto y la página sigue con normalidad (no secuestra la rueda).
 * Con "reducir movimiento" se muestra solo la primera foto.
 */
export function DepthGallery({
  photos,
  spacing = 600,
  scrollPerPhoto = 32,
  children,
  className,
}: DepthGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 → la sección entra arriba del todo; 1 → su final llega al borde inferior.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Suaviza el avance para que no vaya a tirones con la rueda del ratón.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  // Posición de la cámara: de 0 a la profundidad de la última foto.
  const camera = useTransform(progress, [0, 1], [0, (photos.length - 1) * spacing]);

  const first = photos[0];
  if (reduceMotion || photos.length < 2 || !first) {
    return (
      <div ref={trackRef} className={cn("relative", className)}>
        {first && <PhotoFrame photo={first} />}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className={cn("relative", className)}
      style={{ height: `${photos.length * scrollPerPhoto + 45}vh` }}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center pt-16">
        <div className="relative w-full max-w-md">
          {/* Escenario 3D: la perspectiva da la sensación de profundidad. */}
          <div className="relative aspect-[4/5] [perspective:1000px]">
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {photos.map((photo, i) => (
                <DepthItem
                  key={photo.src}
                  photo={photo}
                  index={i}
                  count={photos.length}
                  spacing={spacing}
                  camera={camera}
                />
              ))}
            </div>
          </div>
          {/* Fuera del 3D para que ninguna foto lo tape al pasar. */}
          {children}
        </div>
      </div>
    </div>
  );
}

type DepthItemProps = {
  photo: Media;
  index: number;
  count: number;
  spacing: number;
  camera: MotionValue<number>;
};

/** Una foto del escenario: su profundidad depende de dónde esté la cámara. */
function DepthItem({ photo, index, count, spacing, camera }: DepthItemProps) {
  const scatter = SCATTER[index % SCATTER.length] ?? SCATTER[0];
  // z = 0 → la foto está justo delante; negativo → al fondo; positivo → ya la pasamos.
  const z = useTransform(camera, (c) => c - index * spacing);
  // Aparece al acercarse y se desvanece al cruzarla, antes de "chocar" con la cámara.
  const opacity = useTransform(
    z,
    [-3 * spacing, -1.5 * spacing, 0, 0.35 * spacing],
    [0, 1, 1, 0]
  );
  const isLast = index === count - 1;
  // El vídeo solo se monta mientras la foto se ve: así no se descargan ni reproducen todos a la vez.
  const [near, setNear] = useState(() => opacity.get() > 0.02);
  useMotionValueEvent(opacity, "change", (v) => setNear(v > 0.02));

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        z,
        opacity,
        x: `${scatter.x}%`,
        y: `${scatter.y}%`,
        rotate: isLast ? 0 : scatter.rotate,
        zIndex: count - index,
      }}
    >
      <PhotoFrame photo={photo} priority={index === 0} playVideo={near} />
    </motion.div>
  );
}

type PhotoFrameProps = { photo: Media; priority?: boolean; playVideo?: boolean };

/** Marco de la foto; si tiene vídeo y `playVideo`, lo reproduce en bucle encima del póster. */
function PhotoFrame({ photo, priority = false, playVideo = false }: PhotoFrameProps) {
  return (
    <div className="shadow-soft relative aspect-[4/5] overflow-hidden rounded-xl">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 28rem, 100vw"
        className="object-cover"
      />
      {photo.video && playVideo && <LoopVideo src={photo.video} poster={photo.src} />}
    </div>
  );
}
