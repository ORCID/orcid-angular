#!/usr/bin/env bash
# Orchestrates local single-locale builds + screenshot capture for the
# translation experiment. For each language: starts a local Angular dev
# server (proxied to the QA backend for real auth/data), waits for it to
# compile, runs the Cypress screenshot spec against it, then tears it down.
#
# Usage: ./run-local-screenshots.sh <model-name-or-set-label>
#   e.g. ./run-local-screenshots.sh claude-sonnet-5

set -euo pipefail

SET_LABEL="${1:?Usage: $0 <screenshot-set-label>}"

ANGULAR_DIR="/Users/l.mendoza/code/orcid/orcid-angular"
CYPRESS_DIR="/Users/l.mendoza/code/orcid/orcid-cypress_tests-private"

LANGS=(de es fr it ja pt ru zh_CN)

for lang in "${LANGS[@]}"; do
  echo "=== [$lang] starting local dev server ==="
  npm --prefix "$ANGULAR_DIR" run "start:$lang" > "/tmp/ng-serve-$lang.log" 2>&1 &
  SERVER_PID=$!

  # Wait for the dev server to report it's listening (max ~3 minutes)
  for i in $(seq 1 90); do
    if grep -q "Compiled successfully" "/tmp/ng-serve-$lang.log" 2>/dev/null; then
      echo "  compiled after ${i}s"
      break
    fi
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      echo "  ERROR: dev server process died early for $lang"
      cat "/tmp/ng-serve-$lang.log"
      exit 1
    fi
    sleep 2
  done

  echo "=== [$lang] running screenshot spec ==="
  (
    cd "$CYPRESS_DIR"
    npx cypress run \
      --config-file cypress.translation.config.js \
      --spec cypress/e2e/translation-experiment/screenshots-local.cy.js \
      --config baseUrl=http://localhost:4200 \
      --env "screenshotSet=$SET_LABEL,lang=$lang" \
      --headless || true
  )

  echo "=== [$lang] tearing down dev server ==="
  kill "$SERVER_PID" 2>/dev/null || true
  pkill -f "ng serve.*local-qa-$lang" 2>/dev/null || true
  # Free port 4200 in case of orphaned child processes
  lsof -ti:4200 | xargs -r kill -9 2>/dev/null || true
  sleep 2
done

echo "=== All languages done for set: $SET_LABEL ==="
