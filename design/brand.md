# Brand — LUCA Pizza Napoletana

## Nombre y concepto
- **Nombre:** LUCA
- **Subtítulo:** PIZZA NAPOLETANA
- **Concepto:** Restaurante de pizza napolitana de masa artesana con 72 h de fermentación.
  Proyecto familiar de fe y vocación: "los sueños se amasan con paciencia y se hornean con propósito."

---

## Paleta de colores

**Reglas:**
- El fondo de toda la web es BLANCO. El color lo aportan los componentes.
- La marca es AMARILLA. El amarillo es el color protagonista: logo, hero, CTA principal, footer.
- El ROJO NO es color de marca. Solo se permite como acento en componentes
  (badges, precios destacados, etiquetas, bloques secundarios). Nunca en logo, hero ni CTA principal.
- El amarillo tiene contraste ~2:1 sobre blanco → solo como relleno. Texto y logo sobre blanco → negro.
- Texto crema sobre amarillo (como en las piezas impresas) NO pasa AA (1,7:1) → en web, negro.
- Colores medidos del tablero de marca (`Diseño sin título.svg`).

| Token (globals.css)        | HEX       | Uso                                          |
|----------------------------|-----------|----------------------------------------------|
| `luca-white` → `bg`        | `#FFFFFF` | Fondo global de página                       |
| `luca-gold` → `primary`    | `#F1A200` | Logo, hero, CTA principal, bloques, footer   |
| `luca-gold-deep`           | `#D98F00` | Hover/pressed del primario (derivado)        |
| `luca-black` → `fg`, `on-primary` | `#1A1A1A` | Texto, títulos, logo, texto sobre amarillo (~7,8:1) |
| `luca-ink-soft` → `fg-muted` | `#5F4B44` | Texto secundario (8:1 sobre blanco, derivado) |
| `luca-cream` → `surface`   | `#E8E1D9` | Tarjetas, menú móvil, bloques suaves         |
| `luca-red` → `accent`      | `#A22E2F` | Acento SOLO en componentes (7:1 sobre blanco; crema encima 5,4:1) |
| `luca-red-deep`            | `#852526` | Hover del acento (derivado)                  |
| `luca-green`               | `#0B613A` | Solo ilustraciones                           |
| `luca-brown`               | `#563933` | Solo ilustraciones                           |

> Los tokens viven en `app/globals.css` (@theme) y NUNCA se escriben valores sueltos en los componentes.

---

## Tipografías

### Display (headings, logo, pósters)
- **Estilo (confirmado por cliente):** sans serif extra bold — geométrica, compacta y contundente. Mayúsculas.
- **Elegida:** `League Spartan` 800/900 (next/font/google)
- **Alternativas aceptadas:** Anton, Archivo Black
- **Variable CSS:** `--font-display`

### Subtítulo / etiquetas
- **Estilo:** Sans-serif espaciada (letter-spacing amplio), mayúsculas, peso regular/medium
- **Uso:** "PIZZA NAPOLETANA" bajo el logo, subtítulos de sección
- **TODO:** Confirmar si es la misma familia o distinta

### Body
- **Estilo:** Sans-serif legible, peso regular
- **Elegida:** `DM Sans` (next/font/google)
- **Variable CSS:** `--font-body`

---

## Logo

### Variantes identificadas
| Variante              | Descripción                                      | Fondo             |
|-----------------------|--------------------------------------------------|--------------------|
| Logo principal        | "LUCA" bold + mano italiana (gesto perfetto)     | Dorado `#F5A623`   |
| Logo horizontal       | "LUCA" bold + "PIZZA NAPOLETANA" subtítulo       | Dorado `#F5A623`   |
| Logo invertido        | "LUCA" crema sobre fondo rojo/verde/marrón       | Varios             |
| Ícono solo            | Gesto de mano (sin wordmark)                     | Cualquiera         |
| Logo en negro         | "LUCA" negro sobre crema/blanco                  | Claro              |

### Reglas de uso
- El gesto de mano SIEMPRE aparece encima del wordmark "LUCA"
- El subtítulo "PIZZA NAPOLETANA" va en tracking amplio, peso regular, debajo del wordmark
- No deformar ni rotar el logo
- Espacio mínimo: igual al alto de la "L" en todos los lados
- **TODO:** Solicitar archivos SVG/PDF del logo en todas las variantes

---

## Ilustraciones de marca
Sistema de ilustraciones de línea (estilo retro italiano) sobre fondos de color sólido:

| Ilustración          | Color de fondo  | Uso sugerido         |
|----------------------|-----------------|----------------------|
| Tenedor + espagueti  | Marrón `#3D1C24`| Hero / póster        |
| Mano "perfetto"      | Rojo `#9B2335`  | Nosotros / logo      |
| Ramo de albahaca     | Verde `#1B6B3A` | Ingredientes         |
| Chasquido de dedos   | Crema `#EDE0D0` | Galería / decoración |
| Raviolis x3          | Crema `#EDE0D0` | Menú / galería       |
| Mata de tomates      | Rojo `#9B2335`  | Ingredientes         |
| Pizza abierta        | Verde `#1B6B3A` | Hero / menú          |
| Plato espagueti + tenedor | Crema `#EDE0D0` | Menú         |
| Molino de pizza      | Crema `#EDE0D0` | Galería / fun        |
| Mano sosteniendo pizza | Rojo `#9B2335` | Hero / galería      |
| Mano con copa cóctel | Verde `#1B6B3A` | Bebidas / galería    |

---

## Tono de voz
- **Carácter:** Cálido, familiar, auténtico, artesano, con orgullo italiano
- **Registro:** Cercano pero con clase; mezcla italiano y español con naturalidad
- **Expresiones de marca:** "Per favore", "Grazie mille", "Ciao bella", "Mamma mia",
  "Che pizza", "Buon appetito", "Tutto passa", "Buongiorno / Buonasera / Buonanotte"
- **Prohibido:** Jerga, anglicismos innecesarios, tono corporativo o frío
- **Alma:** Fe y gratitud — "De nuestra familia a la vuestra"

---

## Radios y formas
- Formas redondeadas, orgánicas — consistente con el estilo de ilustraciones
- Tarjetas con radio generoso (`--radius-lg: 1.5rem` o más)
- Sin ángulos bruscos en la UI
