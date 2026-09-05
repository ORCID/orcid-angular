#!/usr/bin/env bash
#
# Blocking style gate for the composed homepage renderer (spec-v2 §0 D8).
#
# `yarn lint` in this repo is `echo 'temporally disable Angular linter to until
# eslint update'` — it enforces nothing. These greps and the accessibility specs
# ARE the gate, so this script fails loudly and exits non-zero.
#
# Three invariants of src/app/home/**:
#
#   1. No raw <h1>-<h6> outside the heading primitive. Heading levels are
#      computed from position (§4.4); a hand-written tag is exactly how an
#      outline silently acquires a skipped level or a second h1.
#   2. No hex colour literal outside sections/_tone.scss. Colour comes from the
#      ORCID tokens; a literal is a contrast failure nobody can theme away.
#   3. No [innerHTML]. Editor text is rendered as elements built from parsed
#      nodes, never as markup. There is no exception.
#
# Usage: scripts/check-home-styles.sh [repo root]
set -uo pipefail

ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
HOME_DIR="$ROOT/src/app/home"

if [ ! -d "$HOME_DIR" ]; then
  echo "check-home-styles: $HOME_DIR does not exist" >&2
  exit 1
fi

# The one file allowed to emit a heading tag, and the one file allowed to hold
# hex colours. Relative to $HOME_DIR.
HEADING_PRIMITIVE='components/heading/heading.component.ts'
TONE_STYLESHEET='sections/_tone.scss'

# The v1 page, exempt until the units of work that delete it land: W-NG-HOME
# retires the WordPress branch and wordpress-styles.scss, W-NG-DELETE removes
# the four v1 section components, W-SEC-NEWS moves the news heading into the
# section shell. Listed file by file, never by directory, so the list can only
# shrink — and a stale entry is a failure (see the check below), so it cannot
# quietly outlive the file it excuses.
LEGACY_V1=(
  'components/news/news.component.html'
  'pages/home/home.component.html'
  'pages/home/home.component.ts'
  'pages/home/wordpress-styles.scss'
  'pages/homepage-preview/homepage-preview.component.scss'
)

failures=0

for legacy in "${LEGACY_V1[@]}"; do
  if [ ! -f "$HOME_DIR/$legacy" ]; then
    echo "FAIL: src/app/home/$legacy is exempted by check-home-styles.sh but no longer exists." >&2
    echo "  Delete it from LEGACY_V1 — the exemption list must not outlive the v1 page." >&2
    failures=$((failures + 1))
  fi
done

# Prints "path:line:text" for every hit of $2, minus the allowed file $3 and the
# v1 files. Returns 1 when anything survived the filter.
report() {
  local title="$1" pattern="$2" allow="$3" hint="$4"
  local excluded=("${LEGACY_V1[@]}")
  [ -n "$allow" ] && excluded+=("$allow")

  local hits
  hits="$(
    cd "$HOME_DIR" || exit 1
    grep -rInE --include='*.ts' --include='*.html' --include='*.scss' \
      -- "$pattern" . 2>/dev/null |
      sed 's|^\./||' |
      # A line that only talks about the rule in a comment is not a breach of it.
      grep -vE '^[^:]+:[0-9]+:[[:space:]]*(//|\*|/\*)' |
      { kept=''
        while IFS= read -r line; do
          file="${line%%:*}"
          skip=''
          for entry in "${excluded[@]}"; do
            [ "$file" = "$entry" ] && skip=1 && break
          done
          [ -z "$skip" ] && kept+="$line"$'\n'
        done
        printf '%s' "$kept"; }
  )"

  [ -z "$hits" ] && return 0

  echo "" >&2
  echo "FAIL: $title" >&2
  echo "  $hint" >&2
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    local file rest line text
    file="${hit%%:*}"
    rest="${hit#*:}"
    line="${rest%%:*}"
    text="${rest#*:}"
    echo "  src/app/home/$file:$line: ${text#"${text%%[![:space:]]*}"}" >&2
  done <<<"$hits"
  return 1
}

report \
  'a raw heading tag in src/app/home/**' \
  '<[[:space:]]*/?[[:space:]]*[hH][1-6]([[:space:]>/]|$)' \
  "$HEADING_PRIMITIVE" \
  "Use <app-heading [level]=\"...\">. Only $HEADING_PRIMITIVE may emit h1-h6." ||
  failures=$((failures + 1))

report \
  'a hex colour literal in src/app/home/**' \
  '#[0-9a-fA-F]{3,8}' \
  "$TONE_STYLESHEET" \
  "Use an ORCID token from projects/orcid-tokens. Only $TONE_STYLESHEET may name a colour." ||
  failures=$((failures + 1))

report \
  'an innerHTML binding in src/app/home/**' \
  '\[innerHTML\][[:space:]]*=|\.innerHTML[[:space:]]*=' \
  '' \
  'Render content as elements built from parsed nodes. There is no exception.' ||
  failures=$((failures + 1))

if [ "$failures" -gt 0 ]; then
  echo "" >&2
  echo "check-home-styles: $failures rule(s) violated." >&2
  exit 1
fi

echo "check-home-styles: ok"
