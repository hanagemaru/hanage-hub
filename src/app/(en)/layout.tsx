import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WebAnalytics } from "@/components/WebAnalytics";
import { getContent } from "@/lib/content";
import { rootMetadata } from "@/lib/metadata";
import "../globals.css";

/**
 * 英語のルートレイアウト。中身は `/en/` 配下。
 *
 * ルートグループはURLに出ないので、型の上ではこのレイアウトも "/" に立つ。
 */
const locale = "en";

export const metadata = rootMetadata(locale);

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={getContent(locale).htmlLang}>
      <body>
        <SiteHeader locale={locale} />
        {children}
        <SiteFooter locale={locale} />
        <WebAnalytics />
      </body>
    </html>
  );
}
