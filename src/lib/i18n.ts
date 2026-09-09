/**
 * 対応言語。
 *
 * 日本語は接頭辞なし（`/games/`）、英語は `/en/` 配下（`/en/games/`）に置く。
 * 非対称なのは、日本語のURLが先に公開されていて、これを変えると
 * 既存の被リンクと検索結果を捨てることになるため。
 */
export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

/** 接頭辞を持たない言語 */
export const defaultLocale: Locale = "ja";

/** `/games/` のような、言語を含まないルート */
export type Route = string;

/** ルートを言語つきの実パスに変える。ここ以外でパスを組み立てない */
export function localePath(locale: Locale, route: Route): string {
  return locale === defaultLocale ? route : `/${locale}${route}`;
}

/**
 * hreflang。全ページで同じ形にする。
 *
 * x-default は日本語に向ける。言語を指定していない検索利用者には
 * 原文のほうが情報が新しいため。
 */
export function alternatesFor(locale: Locale, route: Route) {
  return {
    canonical: localePath(locale, route),
    languages: {
      ja: route,
      en: `/en${route}`,
      "x-default": route,
    },
  };
}

/** 現在のパスから、もう一方の言語の同じページのパスを求める */
export function swapLocale(pathname: string): { locale: Locale; href: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { locale: "ja", href: pathname.slice(3) || "/" };
  }
  return { locale: "en", href: `/en${pathname}` };
}
