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

// lastModified は書かない。手で日付を保つと必ず実態とずれ、
// 信用されない lastmod は無いのと同じ扱いになる
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `https://hanage.app${route}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route.startsWith("/games/") ? 0.8 : 0.5,
  }));
}
