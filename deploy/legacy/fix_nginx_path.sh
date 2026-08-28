#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "12345678" | sudo -S bash -c 'cat << "NGINX" > /etc/nginx/velnox_locations.conf
    # Backend API:
    location ^~ /velnox-api/ {
        proxy_pass http://127.0.0.1:8506/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend Next.js:
    location ^~ /velnox/ {
        proxy_pass http://127.0.0.1:8505/velnox/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
NGINX'

# Check if already included to prevent duplicates
if ! grep -q "velnox_locations.conf" /etc/nginx/sites-available/irbis-asana; then
  echo "12345678" | sudo -S bash -c 'sed -i "/location \/ {/i \    include /etc/nginx/velnox_locations.conf;" /etc/nginx/sites-available/irbis-asana'
fi
echo "12345678" | sudo -S systemctl reload nginx

# Fix Next.js basePath
cd /srv/projects/velnox/frontend
if ! grep -q "basePath" next.config.mjs; then
  echo "12345678" | sudo -S -u user sed -i 's/const nextConfig = {/const nextConfig = {\n    basePath: "\/velnox",/' next.config.mjs
  echo "12345678" | sudo -S -u user npm run build
  echo "12345678" | sudo -S systemctl restart velnox-frontend
fi
