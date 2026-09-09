"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { swapLocale } from "@/lib/i18n";

/**
 * もう一方の言語の「同じページ」へ移る。
 *
 * 行き先は今のパスから機械的に求める。ページごとに対応表を持たせると、
 * ページを増やしたときに書き忘れて、必ずトップに飛ぶリンクが混ざる。
 *
 * 言語ごとにルートレイアウトが違うため、この移動はページ全体の再読み込みになる。
 */
export function LocaleSwitch({ label }: { label: string }) {
  const pathname = usePathname();
  const { locale, href } = swapLocale(pathname);

  return (
    <Link className="localeSwitch" href={href} hrefLang={locale} lang={locale}>
      {label}
    </Link>
  );
}
