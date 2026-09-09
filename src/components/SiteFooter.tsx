import Link from "next/link";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <footer className="siteFooter">
      <div className="footerInner pageWidth">
        <div className="footerIntro">
          <Link className="brand" href={localePath(locale, "/")}>
            <BrandMark />
            <span>hanage.app</span>
          </Link>
          <p>{t.footerTagline}</p>
        </div>
        <nav className="footerLinks" aria-label={t.nav.footerNavLabel}>
          <Link href={localePath(locale, "/about/")}>{t.nav.about}</Link>
          <Link href={localePath(locale, "/privacy/")}>{t.nav.privacy}</Link>
          <Link href={localePath(locale, "/terms/")}>{t.nav.terms}</Link>
          <Link href={localePath(locale, "/contact/")}>{t.nav.contact}</Link>
        </nav>
        <p className="copyright">© 2026 hanage.app</p>
      </div>
    </footer>
  );
}
