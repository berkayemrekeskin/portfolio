import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Absolute URLs are required, so there is nothing meaningful to emit until
  // SITE.url is filled in.
  if (!SITE.url) return [];
  return [
    { url: `${SITE.url}/`, priority: 1 },
    { url: `${SITE.url}/text/`, priority: 0.8 },
  ];
}
