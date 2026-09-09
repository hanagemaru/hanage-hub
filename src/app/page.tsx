import Link from "next/link";
import { GameTile } from "@/components/GameTile";
import { formatDate, games, updates } from "@/lib/site";

export default function Home() {
  const latest = updates[0];

  return (
    <main>
      <section className="hero pageWidth">
        <h1>hanage.app</h1>
        <p className="heroCopy">個人制作のブラウザゲームとWebアプリ。インストール不要・無料。</p>
      </section>

      <section className="section pageWidth" aria-labelledby="games-title">
        <div className="sectionHeading">
          <h2 id="games-title">ゲーム</h2>
          <Link className="textLink" href="/games/">
            すべて見る <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="tileGrid">
          {games.map((game) => (
            <GameTile game={game} key={game.slug} />
          ))}
        </div>
      </section>

      <section className="section pageWidth" aria-labelledby="news-title">
        <div className="sectionHeading">
          <h2 id="news-title">更新情報</h2>
          <Link className="textLink" href="/updates/">
            一覧を見る <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link className="newsRow" href="/updates/">
          <time dateTime={latest.date}>{formatDate(latest.date)}</time>
          <span className="newsTag">{latest.kind}</span>
          <strong>{latest.title}</strong>
          <span className="newsArrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
