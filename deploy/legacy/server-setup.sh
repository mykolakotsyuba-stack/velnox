#!/bin/bash

# Velnox Native Deployment Script for Ubuntu
# Run this on: 172.20.222.90 (marketing)
# Usage: sudo ./server-setup.sh

PROJECT_NAME="velnox"
PROJECT_DIR="/srv/projects/velnox"
DOMAIN="mx.irbis.ua"

echo "=================================================="
echo "🚀 Velnox Native Server Setup (Port 8505 & 8506)"
echo "=================================================="

# 1. Install prerequisites (Node.js 20, PHP 8.2, Composer, Nginx)
echo "Installing prerequisites (Node.js, PHP, Nginx)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

sudo apt-get update
sudo apt-get install -y php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip unzip git nginx mysql-client
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

# 2. Directory Structure
echo "Setting up $PROJECT_DIR..."
mkdir -p "$PROJECT_DIR/frontend"
mkdir -p "$PROJECT_DIR/api"
mkdir -p "$PROJECT_DIR/logs"
chown -R user:user "$PROJECT_DIR"
chmod -R 775 "$PROJECT_DIR"

# 3. Pull Repositories (assuming GitHub PAT is set up as per DEPLOYMENT_GUIDE.md)
# git config --global http.sslVerify false # WatchGuard SSL bypass
# Uncomment and configure with your PAT:
# git clone -b main https://$PAT@github.com/org/velnox-frontend.git $PROJECT_DIR/frontend
# git clone -b main https://$PAT@github.com/org/velnox-api.git $PROJECT_DIR/api

# --- Assuming the code will be placed in $PROJECT_DIR/frontend and $PROJECT_DIR/api via SCP for now ---

# 4. Create Systemd Service for Laravel API
echo "Creating Velnox API systemd service..."
cat <<EOF > /etc/systemd/system/velnox-api.service
[Unit]
Description=Velnox Laravel API Service
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=$PROJECT_DIR/api
ExecStart=/usr/bin/php artisan serve --host=127.0.0.1 --port=8506
Restart=always
RestartSec=10
StandardOutput=append:$PROJECT_DIR/logs/api.log
StandardError=append:$PROJECT_DIR/logs/api.log

[Install]
WantedBy=multi-user.target
EOF

# 5. Create Systemd Service for Next.js Frontend
echo "Creating Velnox Frontend systemd service..."
cat <<EOF > /etc/systemd/system/velnox-frontend.service
[Unit]
Description=Velnox Next.js Frontend Service
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=$PROJECT_DIR/frontend
Environment=NODE_ENV=production
Environment=PORT=8505
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=append:$PROJECT_DIR/logs/frontend.log
StandardError=append:$PROJECT_DIR/logs/frontend.log

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable Services
sudo systemctl daemon-reload
sudo systemctl enable velnox-api.service
sudo systemctl enable velnox-frontend.service
# Note: they won't start successfully until files are copied and 'npm run build' / 'composer install' are run.

# 7. Nginx Configuration
echo "Configuring Nginx reverse proxy..."

cat <<EOF > /etc/nginx/sites-available/velnox
server {
    listen 80;
    server_name $DOMAIN;

    # Backend API: http://mx.irbis.ua/velnox-api/
    location /velnox-api/ {
        proxy_pass http://127.0.0.1:8506/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Frontend Next.js: http://mx.irbis.ua/velnox/
    location /velnox/ {
        proxy_pass http://127.0.0.1:8505/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# We do not symlink immediately since 'server { listen 80; server_name mx.irbis.ua }' 
# might conflict with Asana's existing block if they are in separate files.
# It is better to merge these location blocks into the existing 'mx.irbis.ua' config file!

echo "=================================================="
echo "✅ Setup script completed!"
echo "Next steps:"
echo "1. Upload frontend code to $PROJECT_DIR/frontend"
echo "2. Upload api code to $PROJECT_DIR/api"
echo "3. Run 'npm install && npm run build' in frontend"
echo "4. Run 'composer install' and configure '.env' in api"
echo "5. 'sudo systemctl start velnox-api velnox-frontend'"
echo "6. Merge Nginx locations (/velnox/ & /velnox-api/) into your existing Asana Nginx config if it uses the same server_name!"
echo "=================================================="
