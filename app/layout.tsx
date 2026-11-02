import type { Metadata } from "next";
import { DM_Sans, League_Spartan } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { introSkipScript } from "@/components/sections/home/intro-script";
import { siteConfig } from "@/site.config";
import { siteUrl } from "@/lib/utils/site-url";
import { restaurantJsonLd } from "@/lib/utils/structured-data";
import "./globals.css";

/* Body: DM Sans — legible y neutra. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

/* Display: League Spartan — sans geométrica, compacta y contundente (brand.md). */
const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-league-spartan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteUrl()),
  // La imagen la genera app/opengraph-image.tsx (Next la añade sola a cada página).
  openGraph: {
    type: "website",
    locale: siteConfig.locale.replace("-", "_"),
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de <head> añade data-intro a <html> antes de React.
    <html
      lang="es"
      className={`${dmSans.variable} ${leagueSpartan.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Decide antes del primer pintado si se salta la intro del Inicio
            ("menos movimiento"). Va aquí porque el layout no se vuelve
            a pintar al navegar: el script solo corre en la carga completa. */}
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        {/* Ficha de restaurante para Google (schema.org): dirección, horario, carta. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        {/* Sin JavaScript: ni telón ni animaciones de entrada que dejen el hero oculto. */}
        <noscript>
          <style>
            {
              ".intro-splash{display:none}#inicio *,[data-reveal]{opacity:1!important;transform:none!important}"
            }
          </style>
        </noscript>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
