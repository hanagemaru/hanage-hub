/**
 * Cloudflare Web Analytics のビーコン。
 *
 * サイトトークンはビルド時の環境変数 `NEXT_PUBLIC_CF_BEACON_TOKEN` から読む。
 * リポジトリにはトークンを置かない（`AGENTS.md` の「解析用の秘密情報をコミットしない」）。
 * 未設定のビルド（ローカルの `npm run dev` や Deploy Preview など）では何も出力しない。
 */
const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export function WebAnalytics() {
  if (!token) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
