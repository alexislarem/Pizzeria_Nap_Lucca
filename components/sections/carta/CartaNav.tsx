"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { menu } from "@/content/menu";
import { cn } from "@/lib/utils/cn";

/**
 * Índice de categorías fijo bajo el navbar. Una píldora amarilla se desliza a
 * la categoría que se está leyendo (IntersectionObserver vigila las secciones).
 * Son enlaces ancla (#pizze, #apertura…): sin JavaScript también funcionan.
 */
export function CartaNav() {
  const [active, setActive] = useState(menu[0]?.id ?? "");
  const list = useRef<HTMLUListElement>(null);

  // Marca como activa la sección que cruza la franja superior de la pantalla.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const cat of menu) {
      const section = document.getElementById(cat.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // En móvil la fila se desliza sola para que la categoría activa quede a la vista.
  useEffect(() => {
    const link = list.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const row = list.current;
    if (link && row) row.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label="Categorías de la carta"
        className="bg-bg/95 sticky top-16 z-40 px-4 py-3 backdrop-blur-sm"
      >
        <ul
          ref={list}
          className="mx-auto flex max-w-6xl scrollbar-none gap-2 overflow-x-auto"
        >
          {menu.map((cat) => {
            const isActive = cat.id === active;
            return (
              <li key={cat.id} className="shrink-0">
                <a
                  href={`#${cat.id}`}
                  data-id={cat.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-pill border-border relative block border px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors",
                    isActive
                      ? "text-on-primary border-transparent"
                      : "text-fg hover:border-fg"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="carta-nav-pill"
                      className="rounded-pill bg-primary absolute inset-0"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{cat.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
