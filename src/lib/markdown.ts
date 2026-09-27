/**
 * サイトの文章用の、小さな Markdown 変換。
 *
 * 文章は `content/` の .md ファイルに置き、運営者が GitHub の画面から直接直す。
 * 使う書き方は少ないので、ライブラリは入れずにここで読む。
 *
 * 対応する書き方:
 *   - 空行で段落を分ける
 *   - 段落の中の改行は、そのまま改行として出す（標準の Markdown とは違う。
 *     書いたとおりに表示されるほうが、直す人にとって分かりやすいため）
 *   - `## 見出し` `### 小見出し`
 *   - `- 項目` の箇条書き
 *   - `![説明](/path.jpg)` だけの行は画像
 *   - 文中の `**太字**` と `[文字](URL)`
 *
 * それ以外の記号は、そのまま文字として出す。HTML は解釈しない。
 */

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; children: Inline[] }
  | { kind: "link"; href: string; children: Inline[] }
  | { kind: "break" };

export type Block =
  | { kind: "heading"; level: 2 | 3; children: Inline[] }
  | { kind: "paragraph"; children: Inline[] }
  | { kind: "list"; items: Inline[][] }
  | { kind: "image"; src: string; alt: string };

export type Frontmatter = Record<string, string>;

export type MarkdownDocument = { frontmatter: Frontmatter; blocks: Block[] };

/**
 * 先頭の `---` で囲んだ部分を読む。`key: value` の1行ずつだけに対応する。
 */
function splitFrontmatter(source: string): { frontmatter: Frontmatter; body: string } {
  const text = source.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { frontmatter: {}, body: text };

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) frontmatter[key] = value;
  }
  return { frontmatter, body: text.slice(match[0].length) };
}

/** 文中の太字とリンク。改行は `break` にする */
export function parseInline(text: string): Inline[] {
  const result: Inline[] = [];
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (index > 0) result.push({ kind: "break" });
    result.push(...parseSpans(line));
  });
  return result;
}

const SPAN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function parseSpans(line: string): Inline[] {
  const result: Inline[] = [];
  let last = 0;
  for (const match of line.matchAll(SPAN)) {
    const start = match.index ?? 0;
    if (start > last) result.push({ kind: "text", text: line.slice(last, start) });
    if (match[1] !== undefined) {
      result.push({ kind: "strong", children: parseSpans(match[1]) });
    } else {
      result.push({ kind: "link", href: match[3], children: parseSpans(match[2]) });
    }
    last = start + match[0].length;
  }
  if (last < line.length) result.push({ kind: "text", text: line.slice(last) });
  return result;
}

const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const HEADING = /^(#{2,3})\s+(.+)$/;
const LIST_ITEM = /^[-*]\s+(.*)$/;

function parseBlock(chunk: string): Block[] {
  const lines = chunk.split("\n");

  if (lines.length === 1) {
    const image = IMAGE.exec(lines[0]);
    if (image) return [{ kind: "image", alt: image[1], src: image[2] }];
    const heading = HEADING.exec(lines[0]);
    if (heading) {
      return [
        {
          kind: "heading",
          level: heading[1].length as 2 | 3,
          children: parseInline(heading[2].trim()),
        },
      ];
    }
  }

  if (lines.every((line) => LIST_ITEM.test(line))) {
    return [
      {
        kind: "list",
        items: lines.map((line) => parseInline(LIST_ITEM.exec(line)![1])),
      },
    ];
  }

  // 見出しのすぐ下に空行を置かずに本文を続けても、見出しとして扱う
  const heading = HEADING.exec(lines[0]);
  if (heading) {
    return [
      { kind: "heading", level: heading[1].length as 2 | 3, children: parseInline(heading[2].trim()) },
      ...parseBlock(lines.slice(1).join("\n")),
    ];
  }

  return [{ kind: "paragraph", children: parseInline(chunk) }];
}

export function parseMarkdown(source: string): MarkdownDocument {
  const { frontmatter, body } = splitFrontmatter(source);
  const blocks = body
    .split(/\n[ \t]*\n/)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .replace(/^\n+|\n+$/g, ""),
    )
    .filter((chunk) => chunk.length > 0)
    .flatMap(parseBlock);
  return { frontmatter, blocks };
}

/**
 * 平文にする。一覧の抜粋と meta description に使う。
 *
 * 改行を何でつなぐかは言語で変わる（和文は詰める、英文は空白を入れる）ので呼ぶ側が決める。
 */
export function plainText(inlines: Inline[], lineJoin = ""): string {
  return inlines
    .map((inline) => {
      switch (inline.kind) {
        case "text":
          return inline.text;
        case "break":
          return lineJoin;
        default:
          return plainText(inline.children, lineJoin);
      }
    })
    .join("");
}
