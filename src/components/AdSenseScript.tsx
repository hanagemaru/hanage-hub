/**
 * Google AdSense のスクリプト。
 *
 * パブリッシャーIDはビルド時の環境変数 `NEXT_PUBLIC_ADSENSE_CLIENT_ID` から読む。
 * リポジトリにはIDを置かない（`AGENTS.md` の「広告IDをコミットしない」）。
 * 未設定のビルド（ローカルの `npm run dev` や Deploy Preview など）では何も出力しない。
 *
 * `async` 付きの <script src> は React が <head> に引き上げるので、
 * AdSense が求める「各ページの <head> 内」を満たす。
 */
const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  if (!client) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
