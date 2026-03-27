import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${env.SITE_URL}/record`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
