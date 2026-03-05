echo "12345678" | sudo -S bash -c '
cd /srv/projects/velnox
sudo -u user tar -xzf /home/user/velnox.tar.gz
sudo -u user cp -R velnox-frontend/* frontend/
sudo -u user cp -R velnox-api/* api/
sudo -u user cp velnox-api/.env* api/ 2>/dev/null || true
sudo -u user cp velnox-frontend/.env* frontend/ 2>/dev/null || true
sudo rm -rf velnox-frontend velnox-api
'

echo "12345678" | sudo -S bash -c '
cd /srv/projects/velnox/frontend
sudo -u user npm i
sudo -u user npm run build

cd /srv/projects/velnox/api
sudo -u user composer install
if [ ! -f .env ]; then 
  sudo -u user cp .env.example .env
  sudo -u user php artisan key:generate
fi

sudo systemctl restart velnox-frontend velnox-api
sudo systemctl reload nginx
'
