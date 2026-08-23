#!/usr/bin/env bash
# Regenerates the Open Graph image and app icons from scripts/og/template.html.
#
# The generated PNGs are committed, so this only needs to be run when the artwork
# itself changes. It requires a Chromium/Chrome binary and network access to
# fonts.googleapis.com (the template loads Noto Sans JP).
#
# Usage: CHROME=/path/to/chrome scripts/og/generate.sh

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
template="file://${root}/scripts/og/template.html"
outdir="${root}/src/app"
work="$(mktemp -d)"
trap 'rm -rf "${work}"' EXIT

chrome="${CHROME:-}"
if [ -z "${chrome}" ]; then
  for candidate in \
    /opt/pw-browsers/chromium-*/chrome-linux/chrome \
    "$(command -v chromium || true)" \
    "$(command -v chromium-browser || true)" \
    "$(command -v google-chrome || true)"; do
    if [ -x "${candidate}" ]; then chrome="${candidate}"; break; fi
  done
fi
if [ -z "${chrome}" ]; then
  echo "No Chromium binary found. Set CHROME=/path/to/chrome." >&2
  exit 1
fi

run_chrome() {
  "${chrome}" \
    --headless \
    --no-sandbox \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --user-data-dir="${work}/profile" \
    "$@"
}

# Headless Chrome reserves some window height for its own frame, so the viewport
# is shorter than --window-size. Measure that difference once and compensate,
# otherwise every screenshot is vertically off-centre.
cat > "${work}/probe.html" <<'HTML'
<!doctype html><html><body><b id="h"></b>
<script>document.getElementById("h").textContent = window.innerHeight;</script>
</body></html>
HTML
probe_height=1000
viewport="$(run_chrome --virtual-time-budget=2000 --window-size=800,${probe_height} \
  --dump-dom "file://${work}/probe.html" 2>/dev/null \
  | grep -o 'id="h">[0-9]*' | grep -o '[0-9]*$' || true)"
chrome_offset=0
if [ -n "${viewport}" ] && [ "${viewport}" -gt 0 ] && [ "${viewport}" -lt "${probe_height}" ]; then
  chrome_offset=$((probe_height - viewport))
fi

# Renders one variant at render_width x render_height, then crops away the strip
# Chrome leaves unpainted and, when a final size is given, scales the result down.
# Chrome refuses very small windows, so small icons are rendered large and scaled.
shoot() {
  local variant="$1" render_width="$2" render_height="$3" out="$4"
  local final_width="${5:-$render_width}" final_height="${6:-$render_height}"
  run_chrome \
    --virtual-time-budget=10000 \
    --window-size="${render_width},$((render_height + chrome_offset))" \
    --screenshot="${out}" \
    "${template}?variant=${variant}" >/dev/null 2>&1
  python3 "${root}/scripts/og/crop_png.py" \
    "${out}" "${render_width}" "${render_height}" "${final_width}" "${final_height}"
  echo "  ${out#"${root}/"} (${final_width}x${final_height})"
}

echo "Generating images with ${chrome} (window height offset: ${chrome_offset}px)"
shoot og 1200 630 "${outdir}/opengraph-image.png"
shoot icon 512 512 "${outdir}/icon.png"
shoot icon 720 720 "${outdir}/apple-icon.png" 180 180
