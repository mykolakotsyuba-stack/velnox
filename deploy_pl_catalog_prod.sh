#!/usr/bin/env bash
#
# deploy_pl_catalog_prod.sh — ship ONLY the Polish catalog PDF to PROD.
#
# Why a dedicated script: deploy_prod.sh excludes *.pdf from its rsync, and the
# prod frontend bakes public/ into the Docker image at build time. So the PDF
# must be rsynced into the prod build context explicitly, then the frontend
# image rebuilt and the container restarted.
#
# Auth: export PROD_SSH_PASS=...   (prod ssh password; do NOT hardcode it)
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
PROD_HOST="${PROD_HOST:-admin-site@velnox.eu}"
RPATH="/home/admin-site/velnox"
SUDO_PASS="${PROD_SUDO_PASS:-${PROD_SSH_PASS:-}}"

if [[ -z "${PROD_SSH_PASS:-}" ]]; then
  echo "ERROR: set PROD_SSH_PASS env var (prod ssh password)." >&2
  exit 1
fi

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "==> [1/3] Copying velnox-catalog-pl.pdf into prod build context..."
sshpass -p "$PROD_SSH_PASS" rsync -az -e "ssh $SSH_OPTS" \
  "$REPO_DIR/velnox-frontend/public/files/velnox-catalog-pl.pdf" \
  "$PROD_HOST:$RPATH/frontend/public/files/velnox-catalog-pl.pdf"

echo "==> [2/3] Rebuilding + restarting the frontend container only..."
sshpass -p "$PROD_SSH_PASS" ssh $SSH_OPTS "$PROD_HOST" \
  "cd $RPATH && echo '$SUDO_PASS' | sudo -S docker compose build velnox-frontend && echo '$SUDO_PASS' | sudo -S docker compose up -d velnox-frontend"

echo "==> [3/3] Smoke test (expect Polish catalog md5 = 827957a5e49d841dc70f2f767bdde546):"
curl -sL -m 60 -o /tmp/prod-pl.pdf -w "  http=%{http_code} size=%{size_download}\n" https://velnox.eu/files/velnox-catalog-pl.pdf
md5 -q /tmp/prod-pl.pdf 2>/dev/null || md5sum /tmp/prod-pl.pdf
echo "==> Done."
