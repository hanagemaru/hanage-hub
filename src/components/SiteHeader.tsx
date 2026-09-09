import Link from "next/link";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { LocaleSwitch } from "./LocaleSwitch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <header className="siteHeader">
      <div className="headerInner pageWidth">
        <Link
          className="brand"
          href={localePath(locale, "/")}
          aria-label={t.nav.brandHomeLabel}
        >
          <BrandMark />
          <span>hanage.app</span>
        </Link>
        <nav className="mainNav" aria-label={t.nav.mainNavLabel}>
          <Link href={localePath(locale, "/games/")}>{t.nav.games}</Link>
          <Link href={localePath(locale, "/updates/")}>{t.nav.updates}</Link>
          <Link href={localePath(locale, "/about/")}>{t.nav.about}</Link>
          <LocaleSwitch label={t.nav.otherLocaleLabel} />
        </nav>
      </div>
    </header>
  );
}
