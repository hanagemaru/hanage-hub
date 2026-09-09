import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { alternatesFor, localePath, type Locale } from "@/lib/i18n";

const SITE_URL = "https://hanage.app";
const SITE_NAME = "hanage.app";
const TITLE = "hanage.app | Games & Web Apps";

/**
 * ルートレイアウトのメタデータ。言語ごとに1回だけ呼ぶ。
 *
 * 題名の型（`%s | hanage.app`）とOG・Twitterカードは言語で変えない。
 * 変えるのは説明文・OGのlocale・canonical・hreflang。
 */
export function rootMetadata(locale: Locale): Metadata {
  const t = getContent(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: TITLE, template: `%s | ${SITE_NAME}` },
    description: t.siteDescription,
    applicationName: SITE_NAME,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title: TITLE,
      description: t.siteTagline,
      url: `${SITE_URL}${localePath(locale, "/")}`,
      siteName: SITE_NAME,
      locale: t.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@hanageapp",
      creator: "@hanageapp",
      title: TITLE,
      description: t.siteTagline,
    },
  };
}

/** 下層ページのメタデータ。canonical と hreflang をまとめて付ける */
export function pageMetadata(
  locale: Locale,
  route: string,
  { title, description }: { title: string; description?: string },
): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    alternates: alternatesFor(locale, route),
  };
}
