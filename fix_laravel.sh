#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

# Ensure PHP and Composer are properly installed and linked
echo "12345678" | sudo -S DEBIAN_FRONTEND=noninteractive apt-get install -y php-cli curl unzip

# Install composer explicitly
echo "12345678" | sudo -S bash -c 'curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer'
echo "12345678" | sudo -S chmod +x /usr/local/bin/composer

echo "12345678" | sudo -S -H -u user bash -c '
export PATH=$PATH:/usr/local/bin:/usr/bin
cd /srv/projects/velnox/api
php /usr/local/bin/composer install
if [ ! -f .env ]; then 
  cp .env.example .env
  php artisan key:generate
fi
php artisan migrate --force
'

# Fix the systemd files to use explicit absolute paths or sh wrappers
echo "12345678" | sudo -S bash -c 'cat <<EOF > /etc/systemd/system/velnox-api.service
[Unit]
Description=Velnox Laravel API Service
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/srv/projects/velnox/api
ExecStart=/usr/bin/php artisan serve --host=127.0.0.1 --port=8506
Restart=always
RestartSec=10
StandardOutput=append:/srv/projects/velnox/logs/api.log
StandardError=append:/srv/projects/velnox/logs/api.log

[Install]
WantedBy=multi-user.target
EOF'

echo "12345678" | sudo -S bash -c 'cat <<EOF > /etc/systemd/system/velnox-frontend.service
[Unit]
Description=Velnox Next.js Frontend Service
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/srv/projects/velnox/frontend
Environment=NODE_ENV=production
Environment=PORT=8505
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=append:/srv/projects/velnox/logs/frontend.log
StandardError=append:/srv/projects/velnox/logs/frontend.log

[Install]
WantedBy=multi-user.target
EOF'

echo "12345678" | sudo -S systemctl daemon-reload
echo "12345678" | sudo -S chown -R user:user /srv/projects/velnox
echo "12345678" | sudo -S systemctl restart velnox-frontend velnox-api
echo "12345678" | sudo -S systemctl reload nginx
