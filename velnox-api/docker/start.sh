#!/bin/sh
set -e

# Make sure the SQLite file exists (bind-mounted from host ./data)
if [ ! -f /var/www/database/database.sqlite ]; then
    touch /var/www/database/database.sqlite
fi
chown -R www-data:www-data /var/www/database /var/www/storage 2>/dev/null || true

# Clear any stale caches, then rebuild for prod
php artisan config:clear || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Public symlink for uploaded files (storage/app/public -> public/storage)
php artisan storage:link || true

# Apply any pending migrations (DB is imported already; this is a no-op normally)
php artisan migrate --force || true

# Start PHP-FPM
php-fpm -D

# Start NGINX in foreground
nginx -g "daemon off;"
