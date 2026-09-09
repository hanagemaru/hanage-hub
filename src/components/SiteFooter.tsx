import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner pageWidth">
        <div className="footerIntro">
          <Link className="brand" href="/">
            <BrandMark />
            <span>hanage.app</span>
          </Link>
          <p>個人制作のゲームとWebアプリ。</p>
        </div>
        <nav className="footerLinks" aria-label="フッターナビゲーション">
          <Link href="/about/">このサイトについて</Link>
          <Link href="/privacy/">プライバシー</Link>
          <Link href="/terms/">利用規約</Link>
          <Link href="/contact/">お問い合わせ</Link>
        </nav>
        <p className="copyright">© 2026 hanage.app</p>
      </div>
    </footer>
  );
}
