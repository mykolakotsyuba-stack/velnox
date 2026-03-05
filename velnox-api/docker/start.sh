#!/bin/sh

# Laravel specifics
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Start PHP-FPM
php-fpm -D

# Start NGINX in foreground
nginx -g "daemon off;"
