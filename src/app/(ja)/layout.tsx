import { AdSenseScript } from "@/components/AdSenseScript";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WebAnalytics } from "@/components/WebAnalytics";
import { getContent } from "@/lib/content";
import { rootMetadata } from "@/lib/metadata";
import "../globals.css";

/**
 * 日本語のルートレイアウト。
 *
 * 言語ごとに <html lang> が違うので、ルートレイアウトも言語ごとに置く。
 * `(ja)` はURLに出ないため、日本語のパスは公開当時のまま変わらない。
 */
const locale = "ja";

export const metadata = rootMetadata(locale);

export default function JapaneseLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={getContent(locale).htmlLang}>
      <body>
        <SiteHeader locale={locale} />
        {children}
        <SiteFooter locale={locale} />
        <WebAnalytics />
        <AdSenseScript />
      </body>
    </html>
  );
}
