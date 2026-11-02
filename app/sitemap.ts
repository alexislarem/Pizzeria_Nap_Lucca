import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { legalDocs } from "@/content/legal";
import { siteUrl } from "@/lib/utils/site-url";

/** /sitemap.xml: lista de páginas para Google (las del menú, reservar y las legales). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = [
    ...siteConfig.nav.map((item) => ({
      path: item.href,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    { path: siteConfig.reserveHref, priority: 0.8 },
    ...legalDocs.map((doc) => ({ path: `/${doc.slug}`, priority: 0.2 })),
  ];
  return pages.map(({ path, priority }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    priority,
  }));
}
