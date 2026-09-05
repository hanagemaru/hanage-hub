import Link from "next/link";
import { GameTile } from "@/components/GameTile";
import { games } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <section className="hero pageWidth">
        <p className="eyebrow">GAMES &amp; WEB APPS</p>
        <h1>
          ちょっと変わった、
          <br />
          すぐ遊べる。
        </h1>
        <p className="heroCopy">
          個人制作のブラウザゲームとWebアプリ。インストールなしで、すぐ遊べます。
        </p>
      </section>

      <section className="section pageWidth" aria-labelledby="games-title">
        <div className="sectionHeading">
          <div>
            <p className="sectionKicker">PLAY NOW</p>
            <h2 id="games-title">ゲーム</h2>
          </div>
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
          <div>
            <p className="sectionKicker">UPDATES</p>
            <h2 id="news-title">更新情報</h2>
          </div>
          <Link className="textLink" href="/updates/">
            一覧を見る <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link className="newsRow" href="/updates/">
          <time dateTime="2026-09-04">2026.09.04</time>
          <span className="newsTag">GAME</span>
          <strong>Multicolor Sweeperを公開しました</strong>
          <span className="newsArrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
