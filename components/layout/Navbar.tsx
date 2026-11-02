"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { LucaLogo } from "@/components/ui/LucaLogo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/site.config";

const { nav: navLinks, reserveHref } = siteConfig;


export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  // Ruta actual: marca el enlace activo (aria-current) para lectores de pantalla y estilo.
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape cierra el menú móvil y devuelve el foco al botón hamburguesa.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full bg-bg/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3"
        aria-label="Navegación principal"
      >
        <Link href="/" className="block w-24 text-fg" aria-label="LUCA, ir al inicio">
          <LucaLogo variant="wordmark" title="" />
        </Link>

        <ul className="hidden gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium text-fg underline-offset-4 transition-colors hover:underline decoration-primary decoration-2",
                  isActive(link.href) && "underline"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* CTA de reserva: siempre visible, como en la referencia de estructura. */}
          <ButtonLink href={reserveHref} size="sm">
            Reservar mesa
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-pill text-fg md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Menú móvil: bloque crema que se despliega bajo la barra */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id="menu-movil"
            className="mx-4 mb-3 flex flex-col gap-1 rounded-lg bg-surface p-4 md:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-sm px-3 py-3 text-base font-semibold text-on-surface",
                    "hover:bg-bg"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
