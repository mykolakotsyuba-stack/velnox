#!/usr/bin/env bash
#
# deploy_prod.sh — deploy the current local repo to PROD (velnox.eu).
#
# Workflow: edit code -> deploy & test on DEV (existing *_auto.exp scripts) ->
# when happy, run THIS script to ship the same code to prod.
#
# What it does:
#   1. Backs up the prod DB/storage first (backup_prod.sh).
#   2. rsyncs frontend + api code (NEVER the prod .env, the SQLite DB or the
#      ./data bind-mount — prod runtime data is preserved).
#   3. Rebuilds the Docker images and restarts the stack on prod.
#
# The app is isolated in Docker; the host nginx (shared with other projects)
# reverse-proxies velnox.eu -> 127.0.0.1:8505/8506 and is NOT touched here.
#
# Auth: export PROD_SSH_PASS=...   (do NOT hardcode the prod password in git)
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
RSYNC="sshpass -p $PROD_SSH_PASS rsync -az -e \"ssh $SSH_OPTS\""
SSH="sshpass -p $PROD_SSH_PASS ssh $SSH_OPTS"

echo "==> [1/4] Backing up prod data first..."
"$REPO_DIR/backup_prod.sh"

echo "==> [2/4] Syncing frontend code (media included, dev junk excluded)..."
eval $RSYNC \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude '*.pdf' --exclude '*.xlsx' --exclude '*.csv' \
  "$REPO_DIR/velnox-frontend/" "$PROD_HOST:$RPATH/frontend/"

echo "==> [2b] Forcing prod frontend env (root domain, API at /api)..."
$SSH "$PROD_HOST" "printf 'NEXT_PUBLIC_API_URL=/api\nDEPLOY_TARGET=prod\n' > $RPATH/frontend/.env.local"

echo "==> [3/4] Syncing api code (preserving prod .env + SQLite DB)..."
eval $RSYNC \
  --exclude vendor --exclude .git --exclude node_modules \
  --exclude '.env' --exclude 'database/*.sqlite' \
  "$REPO_DIR/velnox-api/" "$PROD_HOST:$RPATH/api/"

echo "==> [3b] Syncing docker-compose.yml (ports, INTERNAL_API_URL, volumes)..."
eval $RSYNC "$REPO_DIR/deploy/docker-compose.yml" "$PROD_HOST:$RPATH/docker-compose.yml"

echo "==> [4/4] Rebuilding images and restarting stack on prod..."
$SSH "$PROD_HOST" "cd $RPATH && echo '$SUDO_PASS' | sudo -S docker compose build && echo '$SUDO_PASS' | sudo -S docker compose up -d && echo '$SUDO_PASS' | sudo -S docker compose ps"

echo "==> Smoke test:"
curl -s -m 20 -o /dev/null -w "  home    : %{http_code}\n" -L https://velnox.eu/
curl -s -m 20 -o /dev/null -w "  api     : %{http_code}\n" https://velnox.eu/api/v1/categories
curl -s -m 20 -o /dev/null -w "  sitemap : %{http_code}\n" https://velnox.eu/sitemap.xml
echo "==> Done. Live: https://velnox.eu"
