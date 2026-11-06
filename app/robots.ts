import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils/site-url";

/** /robots.txt: todo indexable salvo las APIs de los formularios y la página privada de moderar reseñas. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/resenas/moderar"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
