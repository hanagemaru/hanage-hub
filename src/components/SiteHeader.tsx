import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="headerInner pageWidth">
        <Link className="brand" href="/" aria-label="hanage.app トップページ">
          <span className="brandMark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>hanage.app</span>
        </Link>
        <nav className="mainNav" aria-label="メインナビゲーション">
          <Link href="/games/">ゲーム</Link>
          <Link href="/updates/">更新情報</Link>
          <Link href="/about/">このサイトについて</Link>
        </nav>
      </div>
    </header>
  );
}
