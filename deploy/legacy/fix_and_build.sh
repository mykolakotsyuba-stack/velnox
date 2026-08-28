#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "12345678" | sudo -S DEBIAN_FRONTEND=noninteractive apt-get update
echo "12345678" | sudo -S DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-downgrades --allow-remove-essential --allow-change-held-packages php8.2-cli php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip unzip git nginx mysql-client

if ! command -v composer &> /dev/null; then
    echo "12345678" | sudo -S bash -c 'curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer'
fi

cd /srv/projects/velnox/frontend
echo "12345678" | sudo -S -u user npm install
echo "12345678" | sudo -S -u user npm run build

cd /srv/projects/velnox/api
echo "12345678" | sudo -S -u user composer install
if [ ! -f .env ]; then 
  echo "12345678" | sudo -S -u user cp .env.example .env
  echo "12345678" | sudo -S -u user php artisan key:generate
fi
echo "12345678" | sudo -S -u user php artisan migrate --force

echo "12345678" | sudo -S systemctl restart velnox-frontend velnox-api
echo "12345678" | sudo -S systemctl reload nginx
