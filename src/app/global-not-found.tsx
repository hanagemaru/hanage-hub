import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { getContent } from "@/lib/content";
import { localePath, locales } from "@/lib/i18n";
import "./globals.css";

/**
 * どのルートにも当たらないURLの404。
 *
 * 書き出すと out/404.html になり、Cloudflare が見つからないページ全部にこれを返す
 * （wrangler.jsonc の not_found_handling）。URLから言語を決められないので、
 * 両方の言語を並べて出す。レイアウトを通らないので、ヘッダーも自前で置く。
 */
export const metadata: Metadata = {
  title: "404 | hanage.app",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body>
        <header className="siteHeader">
          <div className="headerInner pageWidth">
            <Link className="brand" href="/">
              <BrandMark />
              <span>hanage.app</span>
            </Link>
          </div>
        </header>
        <main className="pageWidth notFound">
          <p className="notFoundCode">404</p>
          {locales.map((locale) => {
            const t = getContent(locale).notFound;
            return (
              <section key={locale} lang={getContent(locale).htmlLang}>
                <h1>{t.title}</h1>
                <p>{t.body}</p>
                <Link className="buttonSecondary" href={localePath(locale, "/")}>
                  {t.homeLabel}
                </Link>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
