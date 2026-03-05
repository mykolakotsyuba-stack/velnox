#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "12345678" | sudo -S bash -c 'cat << "NGINX" > /etc/nginx/velnox_locations.conf
    # Backend API:
    location ^~ /velnox-api {
        proxy_pass http://127.0.0.1:8506;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend Next.js:
    location ^~ /velnox {
        proxy_pass http://127.0.0.1:8505;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
NGINX'

echo "12345678" | sudo -S systemctl reload nginx
