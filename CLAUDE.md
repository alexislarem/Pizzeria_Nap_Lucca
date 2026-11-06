# CLAUDE.md — Pizzeria Nap Lucca

## 1. Proyecto
Sitio web en español para **LUCA — Pizza Napoletana**, restaurante de pizza
napolitana artesana en Valdepeñas (Ciudad Real). Desplegado en Vercel.
Objetivo: presentar la marca, exhibir la carta, galería y la historia familiar,
y facilitar reservas de contacto. Sin área privada ni autenticación.

---

## 2. Perfil del usuario
Conoce Python, algo de CSS y Java; **no conoce React/Next.js**.
→ Explicar en español y en pocas líneas cada decisión de arquitectura.
→ Comentar el código de forma útil; evitar jerga sin definir.

---

## 3. Stack fijo (no cambiar sin aprobación)

| Capa | Tecnología |
|------|------------|
| Framework | Next.js (App Router) + React + TypeScript estricto |
| Estilos | Tailwind CSS + shadcn/ui |
| Animaciones | Motion (ex Framer Motion) |
| Base de datos | Postgres (Neon) + Drizzle ORM |
| Formularios | Zod + React Hook Form |
| Email | Resend |
| Anti-spam | Cloudflare Turnstile |
| Rate limit | Upstash Redis |
| Package manager | pnpm |
| Linting | ESLint + Prettier |

**NO hay autenticación**: sin cuentas, contraseñas ni sesiones. No instalar
Auth.js ni ninguna librería de auth.

**Referencia visual:** `pizza-amici.nl` SOLO para composición y estructura de
secciones. No copiar textos, imágenes, logos ni marca.

**Repo de componentes de referencia:** `github.com/sikkeep/morphinui` — usa
sus patrones de componentes (Base UI + Tailwind v4, variantes con CVA,
`motion.tsx` para animaciones).

---

## 4. Comandos

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # compilación de producción
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
NEXT_DIST_DIR=.next-check pnpm build   # compilar sin pisar la .next de `pnpm dev`
```

---

## 5. Estructura de carpetas

```
/app                        → Una carpeta por ruta (page.tsx) + layout raíz + globals.css
/app/api/{contacto,resenas}  → POST de los formularios (route.ts → lib/server/form-handler).
                              Reservas NO usan API: ReservaForm abre WhatsApp con el mensaje (lib/whatsapp/reserva.ts)
/components/layout          → Navbar, Footer
/components/sections/<pág>  → Secciones de cada página: home/, nosotros/, carta/,
                              galeria/, contacto/, reservar/, resenas/
/components/forms           → ReservaForm, ContactoForm, ResenaForm, PhotoPicker, Field,
                              Turnstile, useApiForm
/components/ui              → Piezas base: Button (CVA), SectionHeading, Reveal, LucaLogo,
                              DepthGallery y GhostType (propios, inspirados en React Bits Pro;
                              no hay licencia Pro, no instalar @reactbits-starter),
                              ScrollExpand y CircularCarousel (React Bits gratis, adaptados a
                              tokens + next/image), SpinningPizza (pizza que gira con el scroll), LucaWordmark (letras que saltan;
                              trazos del logo exportados desde LucaLogo: LOGO_PATHS), ScrollText (texto que se
                              ilumina con el scroll), CountUp, LoopVideo (Live Photos),
                              Doodle (dibujos de línea de los carteles como máscara CSS, teñibles
                              con tokens; lista en content/doodles.ts), WiggleDoodle (dibujo que flota
                              y se sacude al tocarlo; hero y Carta). Propios para Reseñas:
                              PeekRating, SpringCheck, PulseHeart, SlideCommit, WarmTooltip.
                              DitherVeil se probó y el usuario lo descartó (no reintroducir).
/content/<pág>.ts           → Textos y fotos de cada página (home, nosotros, carta,
                              galeria, contacto, resenas, pages) + menu.ts (platos y precios)
                              + doodles.ts (dibujos de marca)
/lib/server                 → Solo servidor: env, Turnstile, rate limit, redis, form-handler
/lib/server/email           → layout.ts (plantilla HTML de marca, colores copiados de globals.css),
                              templates.ts (un email por caso), send.ts (Resend)
/lib/server/reviews         → store.ts (reseñas en Upstash; fotos a Vercel Blob al publicar),
                              token.ts (enlaces firmados HMAC, 30 días), public.ts (muro, caché "web-reviews")
/lib/validations            → Esquemas Zod compartidos navegador/servidor
/lib/utils                  → cn, formatPrice, fechas, enlaces de contacto (telHref…)
/design                     → Fuente de verdad: *.md + images/ (originales en fotos/,
                              optimizadas en web/ con INDEX.md; carteles de marca *.svg;
                              cosmos/ = moodboard de inspiración aportado por el usuario)
/public/images/<tema>       → WebP publicados (gallery, menu, proceso, team, historia,
                              marca = carteles SVG rasterizados, inspiracion = cosmos, home,
                              dibujos = solo el trazo de los carteles, silueta blanca + alfa)
/public/videos/<tema>       → MP4 publicados (Live Photos recodificadas a 720 px, sin audio)
site.config.ts              → Marca, navegación, contacto, horarios, redes
```

### Mapa de páginas

| Ruta | Página | Secciones (en orden) | Contenido |
|------|--------|----------------------|-----------|
| `/` | `app/page.tsx` | IntroSplash (telón con el logo animado, en cada recarga; regla del usuario) → HomeHero (LucaWordmark + HeroDoodles: dibujos de marca que se sacuden al tocarlos + sello) → PhraseStrip (frases + dibujos) → HomeAbout (DepthGallery + GhostType) → HomeProcess (tickets interactivos con sello de dibujo + SpinningPizza) → HomeMenu (ScrollExpand) → HomeBrand (CircularCarousel; futuro vídeo Figma/Framer) → HomeReserve. **Regla del usuario:** el Inicio NO lleva galería ni historia de la obra, y no repite textos/fotos de otras pestañas | `content/home.ts` |
| `/nosotros` | `app/nosotros/page.tsx` | NosotrosIntro (foto en arco que se abre) → Story (foto fija + ScrollText) → Values (CountUp 72 h + tarjetas que giran) → Build (scroll horizontal, polaroids con vídeo) → Closing | `content/nosotros.ts` |
| `/carta` | `app/carta/page.tsx` | CartaIntro (WiggleDoodle) → CartaNav (sticky, píldora activa) → CartaCategory ×4 (DishTicket interactivo; pizzas: CartaFeatured primero) → HomeReserve | `content/carta.ts` + `menu.ts` |
| `/galeria` | `app/galeria/page.tsx` | GaleriaIntro → GaleriaGrid (filtros + masonry + Lightbox) → HomeReserve | `content/galeria.ts` |
| `/contacto` | `app/contacto/page.tsx` | ContactoHero (datos + fotos) → ContactoMap (Google Maps incrustado) → ContactoFormSection | `content/contacto.ts` |
| `/reservar` | `app/reservar/page.tsx` | ReservarHero (formulario → WhatsApp de LUCA, máx. 8 personas; alternativas: WhatsApp, teléfono, email). Sin email ni servidor (regla del cliente) | `content/contacto.ts` |
| `/aviso-legal`, `/privacidad`, `/cookies` | `app/<slug>/page.tsx` | LegalPage (texto + accesos entre ellas) | `content/legal.ts` |
| `/resenas/moderar` | `app/resenas/moderar/` | Privada (noindex): se abre desde el email; vista previa + Publicar/Rechazar (Server Action) | `content/resenas.ts` → resenaModeracion |
| `/resenas` | `app/resenas/page.tsx` | ResenasIntro → ResenasWall (barra de comandas: reseñas reales que suben en columnas y se aceleran con el scroll; ReviewCard + InstagramCard) → ResenaFormSection (PeekRating, fotos, SpringCheck, Turnstile, SlideCommit → email para revisar). Sustituye a Foodtrucks (`/foodtrucks` redirige con 307) | `content/resenas.ts` |

### Patrones a seguir
- Sección = componente de servidor; solo lleva `"use client"` si tiene estado
  (GaleriaGrid, Lightbox, formularios, Navbar). Las animaciones de entrada usan `<Reveal>`.
- Cabeceras de página: `SectionHeading level={1}` con `className="md:[&_h1]:text-8xl"`.
- Fotos: tipo `Photo = { src, alt }` (`content/home.ts`); nunca rutas sueltas en JSX.
- Enlaces de teléfono/email/mapa: `lib/utils/contact.ts`, no construirlos a mano.

---

## 6. Identidad visual

**Fuente de verdad:** `/design/*.md` y `/design/images/`.
Si algo no está ahí: **no inventarlo** — preguntar o marcar con `TODO:`.

Los tokens (colores, fuentes, radios, sombras, espaciados) viven **únicamente**
en el bloque `@theme` de `app/globals.css` (Tailwind v4: no hay `tailwind.config.ts`).
Nunca se escriben valores sueltos en los componentes.

- Amarillo LUCA `#F1A200` = color de marca (`primary`). Rojo `#A22E2F` = solo acento
  de componentes (`accent`: precios, errores, enlaces secundarios). Crema = `surface`.
- Display: League Spartan Black (`font-display`, mayúsculas). Texto: DM Sans.
- Utilidad propia: `scrollbar-none` (filas deslizables de filtros/índices).

Archivos de diseño creados: `brand.md`, `content.md`, `menu.md`, `contact.md`.

---

## 7. Reglas de código
- Componentes pequeños, reutilizables y tipados; cero `any`.
- Imágenes siempre con `next/image`, formato WebP, `alt` descriptivo.
- Mobile-first; espaciado generoso; formas orgánicas.
- Animaciones sutiles con Motion; `useReducedMotion()` obligatorio.
- Accesibilidad: HTML semántico, contraste AA mínimo, foco visible.
- Contenido (menú, platos, reseñas) en archivos tipados bajo `content/`,
  nunca hardcodeado en JSX.
- Marca, contacto y textos globales en `site.config.ts`.
- No añadir dependencias fuera del stack sin justificación y aprobación.

---

## 8. Seguridad
- Secretos solo en `.env.local`; mantener `.env.example` actualizado.
- `/api/contacto` y `/api/reservas`: validación Zod, honeypot, Turnstile,
  rate limit (Upstash), sanitización.
- Cabeceras de seguridad en `next.config.ts`.
- Nada sensible expuesto al cliente.

---

## 9. Forma de trabajo
- Proponer estructura y esperar OK antes de construir.
- Trabajar por fases; al cerrar cada una: correr `lint` + `typecheck` + `build`
  y resumir en ≤5 líneas qué se hizo y qué sigue.
- Respuestas cortas; sin explicar lo obvio.

---

## 10. Estado actual — Progreso

- [x] **Fase 0 — Setup:** dependencias, `tsconfig`, tokens, `site.config.ts`, `.env.example`
- [x] **Fase 1 — Layout:** `RootLayout`, navbar, footer, tokens CSS, `<LucaLogo />` vectorial
      (Figma: https://www.figma.com/design/5uQTdQPf7tjFc2yn7lpLnF — páginas Sistema, Home, Home v2)
- [x] **Fase 2 — Páginas (multipágina):** Inicio, Nosotros, Carta, Galería, Contacto y
      Reservar rediseñadas con fotos reales, estilo pizza-amici. Foodtrucks: provisional
- [x] **Fase 3 — Formularios/API:** `/api/contacto` y `/api/resenas` (Zod, honeypot,
      Turnstile, rate limit Upstash, Resend). Probado con curl; falta probar Turnstile en
      navegador y poner claves reales en Vercel
- [ ] **Fase 4 — Base de datos:** solo si se quieren reservas con horas disponibles (slots)
- [x] **Fase 5 — Galería:** 49 fotos en 6 temas, filtros, masonry y visor `<dialog>`
- [ ] **Fase 6 — SEO / Pulido:** metadata, OG, sitemap, CSP, lighthouse

**En curso:** Inicio rehecho sin carteles (solo dibujos, 2026-11-02); Reseñas creada; mapa en
Contacto; Carta con tickets interactivos. Siguiente: reseñas reales (design/resenas.md). Nada de Inicio está validado aún contra Figma "Home v2"
(límite MCP del plan Starter agotado).

---

## 11. Pendientes (TODO detectados)

| # | Pendiente | Estado |
|---|-----------|--------|
| 1 | Claves reales en Vercel (8 variables, prod + preview), 2026-11-02. Falta: probar una reserva real en producción | ✅ Hecho |
| 2 | Dominio lucapizzerianapoletana.es en Vercel (DNS de Vercel) + registros DNS de Resend y DMARC. Falta: pulsar Verify en Resend | ⏳ Usuario |
| 3 | Horarios (site.config → hours) y validación de reservas por día/hora | ✅ Hecho |
| 4 | Reseñas: 7 reales de Google cargadas (`design/resenas.md`). Faltan: estrellas de B.I.N, final del texto de Sonia, reseñas de Instagram y automatizar la publicación tras revisar por email | ⏳ Usuario |
| 5 | Confirmar copy del Hero y textos marcados `TODO` en `content/*.ts` (Proceso, Obra, pies de foto, textos de formularios) | ⏳ Pendiente |
| 6 | Enlace de Google Maps del local (`contact.mapUrl`, por cid) | ✅ Hecho |
| 7 | Facebook / TripAdvisor / Google Business | ⏳ Pendiente |
| 15 | Confirmar pizza destacada de la Carta (hoy La Divina, `cartaFeatured`) | ⏳ Usuario |
| 8 | Comparar Inicio, Nosotros, Carta y Galería con Figma cuando haya cuota | ⏳ Pendiente |
| 9 | Revisar `alt` de fotos con personas (escritos sin saber quién es cada uno) | ⏳ Pendiente |
| 10 | Imagen OG generada (app/opengraph-image.tsx), iconos, sitemap, robots, JSON-LD | ✅ Hecho |
| 11 | Fotos del moodboard retiradas de la web y sustituidas por fotos propias (no reintroducir `public/images/inspiracion`) | ✅ Hecho |
| 12 | Confirmar copy nuevo del Inicio marcado `TODO` (Hecha en familia, Te guardamos la mesa, Así se ve LUCA…) | ⏳ Usuario |
| 13 | La foto de la señora (`gallery/margherita-en-mano.webp`) se retiró de la web por petición del usuario: no volver a usarla | ✅ Hecho |
| 14 | Intro del Inicio: telón que gotea al subir, rehecho en un solo canvas sin sombra (CurtainDrips.tsx → DripCurtain); el hero entra al 80 % de la subida. Comparar con Figma | ⏳ Pendiente |
| 16 | Titular y responsable de datos: Lucas Luciano Mendez Mardones (NIF 54444120S, domicilio fiscal), 2026-11-03. Falta revisión por asesor | ✅ Hecho |
| 18 | Moderación de reseñas por email (2026-11-06): `REVIEW_SIGNING_SECRET` y Blob store (`BLOB_STORE_ID`, auth OIDC) ya en Vercel. Falta: probar una reseña real de punta a punta | ⏳ Usuario |
| 17 | Reservas por WhatsApp (2026-11-03): formulario → wa.me/34637672493 con el mensaje escrito; botones genéricos con el enlace corto. Falta el QR que enviará el usuario | ⏳ Usuario |

Hecho: `/design/*.md`, fotos reales, logo SVG, tipografía (League Spartan Black),
modelo de reservas (formulario simple → email).
