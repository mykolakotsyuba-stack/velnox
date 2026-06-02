#!/usr/bin/env bash
#
# backup_prod.sh — snapshot the PROD database + Laravel storage on velnox.eu.
# Pulls a copy to ./backups-prod/ locally as well. Read-only on the running app.
#
# Auth: export PROD_SSH_PASS=... (do NOT hardcode the prod password in git).
#
set -euo pipefail

PROD_HOST="${PROD_HOST:-admin-site@velnox.eu}"
RPATH="/home/admin-site/velnox"
TS="$(date +%Y%m%d-%H%M%S)"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)/backups-prod"

if [[ -z "${PROD_SSH_PASS:-}" ]]; then
  echo "ERROR: set PROD_SSH_PASS env var (prod ssh password)." >&2
  exit 1
fi

SSH="sshpass -p $PROD_SSH_PASS ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
SCP="sshpass -p $PROD_SSH_PASS scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo ">> Creating snapshot on prod ($TS)..."
$SSH "$PROD_HOST" "
  cp $RPATH/data/database.sqlite $RPATH/backups/database-$TS.sqlite
  tar -czf $RPATH/backups/storage-$TS.tar.gz -C $RPATH/data storage
  ls -la $RPATH/backups/ | tail -5
"

echo ">> Pulling DB snapshot to $LOCAL_DIR ..."
mkdir -p "$LOCAL_DIR"
$SCP "$PROD_HOST:$RPATH/backups/database-$TS.sqlite" "$LOCAL_DIR/database-$TS.sqlite"
echo ">> Done: $LOCAL_DIR/database-$TS.sqlite"
