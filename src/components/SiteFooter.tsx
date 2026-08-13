import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner pageWidth">
        <div className="footerIntro">
          <Link className="brand" href="/">
            <span className="brandMark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>hanage.app</span>
          </Link>
          <p>個人制作のゲームとWebアプリを公開しています。</p>
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
