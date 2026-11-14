import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { getNotes, noteRoute } from "@/lib/writing";
import { HUB_PLAY_ENABLED, HUB_PLAY_ROUTES } from "@/lib/site";

export const dynamic = "force-static";

/** 言語を含まないルート。先頭がトップページ */
const routes = [
  "/",
  "/games/",
  "/games/multicolor-sweeper/",
  "/games/multicolor-sweeper/how-to-play/",
  "/games/putt/",
  "/games/putt/how-to-play/",
  "/notes/",
  ...getNotes("ja").map((note) => noteRoute(note.slug)),
  "/updates/",
  "/about/",
  "/privacy/",
  "/terms/",
  "/contact/",
];

// lastModified は書かない。手で日付を保つと必ず実態とずれ、
// 信用されない lastmod は無いのと同じ扱いになる
export default function sitemap(): MetadataRoute.Sitemap {
  // ゲーム本体は言語接頭辞のない1つのURL。/en/games/.../play/は存在しない。
  // 本番経路が公開済みの場合だけ登録し、未公開の404 URLは一切含めない。
  const liveGamePaths = [
    ...(HUB_PLAY_ENABLED.putt ? [HUB_PLAY_ROUTES.putt] : []),
    ...(HUB_PLAY_ENABLED.multicolorSweeper ? [HUB_PLAY_ROUTES.multicolorSweeper] : []),
  ];
  return [
    ...locales.flatMap((locale) =>
      routes.map((route) => ({
        url: `https://hanage.app${localePath(locale, route)}`,
        changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
        priority: route === "/" ? 1 : route.startsWith("/games/") ? 0.8 : 0.5,
        // 同じ内容の別言語版を互いに指す。片方だけが拾われるのを防ぐ
        alternates: {
          languages: Object.fromEntries(
            locales.map((other) => [other, `https://hanage.app${localePath(other, route)}`]),
          ),
        },
      })),
    ),
    ...liveGamePaths.map((route) => ({
      url: `https://hanage.app${route}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
