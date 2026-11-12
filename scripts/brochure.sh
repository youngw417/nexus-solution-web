#!/bin/sh
# 회사 소개서 PDF 만들기: 사이트를 빌드하고, /brochure 페이지를 Chrome으로 A4 PDF로 인쇄해 public/에 저장합니다.
# 다른 위치의 Chrome을 쓰려면 CHROME 환경 변수로 경로를 지정하세요.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="public/nexus-solution-brochure.pdf"
PORT=4391

npx astro build >/dev/null
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory dist >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT

i=0
until curl -sf "http://127.0.0.1:$PORT/brochure/" >/dev/null; do
  i=$((i + 1)); [ "$i" -gt 50 ] && { echo "정적 서버가 시작되지 않았습니다" >&2; exit 1; }
  sleep 0.2
done

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" "http://127.0.0.1:$PORT/brochure/" 2>/dev/null
echo "만들었습니다: $OUT"

# 자료실 페이지에 쓰는 미리보기 이미지 (표지 · 사례 · 업종 쪽). poppler(pdftoppm)가 있어야 합니다.
if command -v pdftoppm >/dev/null 2>&1; then
  PREV=public/brochure-preview
  mkdir -p "$PREV"
  for p in 1 7 10; do
    pdftoppm -r 70 -f "$p" -l "$p" -singlefile -png "$OUT" "$PREV/tmp"
    sips -s format jpeg -s formatOptions 80 "$PREV/tmp.png" --out "$PREV/page-$p.jpg" >/dev/null
    rm "$PREV/tmp.png"
  done
  echo "미리보기: $PREV/page-{1,7,10}.jpg"
else
  echo "pdftoppm이 없어 미리보기 이미지는 건너뜁니다 (brew install poppler)" >&2
fi
