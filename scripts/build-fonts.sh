#!/usr/bin/env bash
# M PLUS 1p のサブセットを作り直す。
#
# 本文の文字を足したあとに回すこと。サブセットに入っていない漢字は
# Hiragino などのフォールバックで出るので、一文だけ書体が混ざる。
#
# 前提：
#   - pyftsubset（pip install fonttools brotli）
#   - npm run build を先に済ませ、out/ が最新であること
#
# 使い方： bash scripts/build-fonts.sh
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d out ]; then
  echo "out/ がない。先に npm run build を回すこと" >&2
  exit 1
fi

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

repo="https://raw.githubusercontent.com/google/fonts/main/ofl/mplus1p"
curl -sSf -o "$work/OFL.txt" "$repo/OFL.txt"

# out/ の全ページから実際に使っている文字を集め、かなと ASCII を足す。
# かなを丸ごと入れておくと、送り仮名を変えた程度では作り直さずに済む。
python3 - "$work/chars.txt" <<'PY'
import glob, re, sys

used = set()
for path in glob.glob('out/**/*.html', recursive=True):
    html = open(path, encoding='utf-8').read()
    html = re.sub(r'<(script|style|template)[^>]*>.*?</\1>', ' ', html, flags=re.S)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = re.sub(r'&[a-z#0-9]+;', ' ', html)
    used |= {c for c in html if c.strip()}

used |= {chr(c) for c in range(0x20, 0x7f)}          # ASCII
used |= {chr(c) for c in range(0x3000, 0x3100)}      # 約物・ひらがな・カタカナ
used |= {chr(c) for c in range(0xff00, 0xfff0)}      # 全角英数と半角カナ

open(sys.argv[1], 'w', encoding='utf-8').write(''.join(sorted(used)))
print(f'{len(used)} 文字でサブセットする')
PY

for pair in "Regular:400" "Bold:700" "Black:900"; do
  face="${pair%%:*}"
  weight="${pair##*:}"
  curl -sSf -o "$work/$face.ttf" "$repo/MPLUS1p-$face.ttf"
  pyftsubset "$work/$face.ttf" \
    "--text-file=$work/chars.txt" \
    --flavor=woff2 \
    --layout-features='*' \
    --output-file="public/fonts/m-plus-1p-$weight.woff2"
  printf '%s: %s\n' "$weight" "$(du -h "public/fonts/m-plus-1p-$weight.woff2" | cut -f1)"
done

cp "$work/OFL.txt" public/fonts/OFL.txt
echo "public/fonts/ を更新した。npm run build で確認すること"
