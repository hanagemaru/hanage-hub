import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = [
  "",
  "/games/",
  "/games/multicolor-sweeper/",
  "/games/multicolor-sweeper/how-to-play/",
  "/games/putt/",
  "/games/putt/how-to-play/",
  "/updates/",
  "/about/",
  "/privacy/",
  "/terms/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `https://hanage.app${route}`,
    lastModified: new Date("2026-09-04"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route.startsWith("/games/") ? 0.8 : 0.5,
  }));
}
