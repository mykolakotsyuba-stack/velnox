#!/bin/bash
set -e

echo "🚀 Deploying velnox-api..."

# Rsync API files to server
echo "📁 Syncing files to server..."
rsync -avz --exclude vendor --exclude .env --exclude .git \
  velnox-api/ user@mail.irbis.ua:/srv/projects/velnox/api/

# SSH and run migrations + restart
echo "🔧 Running migrations and restarting service..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null user@mail.irbis.ua << 'REMOTE'
cd /srv/projects/velnox/api

# Run migrations/seeding
php artisan migrate:fresh --seed

# Restart service
echo "12345678" | sudo -S systemctl restart velnox-api

echo "✅ Deployment complete!"
systemctl status velnox-api --no-pager
REMOTE
