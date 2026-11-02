import type { Metadata } from "next";
import { DM_Sans, League_Spartan } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { introSkipScript } from "@/components/sections/home/intro-script";
import { siteConfig } from "@/site.config";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
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
