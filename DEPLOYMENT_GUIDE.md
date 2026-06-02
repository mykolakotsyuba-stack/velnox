# 🚀 Server Deployment Guide — Irbis Projects

---

## 🌍 PROD — velnox.eu (з 2026-06-02)

Окремий бойовий сервер. **Дев лишається тестовим майданчиком** — спочатку правимо
й тестуємо на деві, лише потім переносимо на прод.

| Параметр | Значення |
|----------|----------|
| Домен | `https://velnox.eu` (SSL home.pl, дійсний до 2026-11-19) |
| IP | `31.70.77.158` · Ubuntu 24.04 |
| SSH | `ssh admin-site@velnox.eu` |
| Ізоляція | Уся VELNOX у **Docker** (`/home/admin-site/velnox/`), щоб не конфліктувати з іншими проєктами на хості |
| Контейнери | `velnox-frontend` → `127.0.0.1:8505`, `velnox-api` → `127.0.0.1:8506` (лише локально) |
| Reverse proxy | **Системний nginx** хоста проксує `velnox.eu` → контейнери (спільний з іншими проєктами; конфіг `/etc/nginx/sites-available/velnox.eu`) |
| БД | SQLite, bind-mount `data/database.sqlite` (бекап-френдлі) |
| Дані/медіа | bind-mount `data/storage`, медіа у `frontend/public` |

**Ключові відмінності прода від дева** (їх обробляє код/конфіг автоматично):
- Дев віддає сайт під підшляхом `/velnox/`; прод — у корені домену.
  `next.config.mjs` перемикається через `DEPLOY_TARGET=prod` (білд-env у Dockerfile).
- API: дев `/velnox-api/api`, прод `/api` (host nginx `location /api/`).
- Хардкоднутий у коді/БД префікс `/velnox/` на проді знімається nginx-rewrite
  `location ^~ /velnox/` (стрипить і переобробляє) — код/БД не правимо.

### Робочий цикл «дев → прод»

```bash
# 1) правиш код, деплоїш і ТЕСТУЄШ на деві (наявні скрипти, не змінювались):
./deploy_frontend_auto.exp      # або clean_deploy_frontend.exp
./deploy_api_auto.exp

# 2) коли все ок на деві — переносиш на прод (НОВІ скрипти):
export PROD_SSH_PASS='...'       # пароль прода, НЕ хардкодимо в git
./deploy_prod.sh                 # бекап → rsync коду → docker build → up → smoke-test
```

- `deploy_prod.sh` спочатку викликає `backup_prod.sh`, потім rsync-ить код
  (`.env`, SQLite та `data/` НЕ чіпає — прод-дані зберігаються), перебудовує
  образи й перезапускає стек.
- `backup_prod.sh` робить знімок БД+storage у `backups/` на проді і тягне копію
  в локальний `backups-prod/` (gitignored).
- Артефакти прода в репо: `deploy/docker-compose.yml`, `deploy/velnox.eu.nginx.conf`,
  `velnox-frontend/Dockerfile`, `velnox-api/Dockerfile`, `velnox-api/docker/start.sh`.

> SEO: `/robots.txt` і `/sitemap.xml` генеруються Next-роутами
> (`src/app/robots.ts`, `src/app/sitemap.ts`); canonical/hreflang/OG — у `[locale]/layout.tsx`.

---

## 🖥️ Сервер

| Параметр | Значення |
|----------|----------|
| Internal IP | `172.20.222.90` |
| Hostname | `marketing` |
| OS | Ubuntu 24.04.4 LTS |
| Disk | 110GB (7% використано) |
| RAM | 7.7GB |
| Зовнішній доступ | `http://mx.irbis.ua` (NAT через роутер) |
| SSH | `ssh user@mail.irbis.ua` (спочатку авторизація на порталі) |
| SSH user | `user` / `12345678` |

### Доступ на сервер (з-за меж офісу)
1. Відкрити `https://mail.irbis.ua:4100`
2. Логін: `kotsiuba` / `Kfylifan24`
3. Після успішної авторизації: `ssh user@mail.irbis.ua`

---

## 🗂️ Активні проекти на сервері

| Проект | Тип | Порт | URL | Systemd сервіс |
|--------|-----|------|-----|----------------|
| **irbis-asana** | Python / Streamlit | `8501` | `http://mx.irbis.ua/asana/` | `irbis-asana-dashboard` |
| **velnox-frontend** | Next.js 14 | `8505` | `http://mx.irbis.ua/velnox` | `velnox-frontend` |
| **velnox-api** | Laravel 11 / PHP | `8507` | `http://mx.irbis.ua/velnox-api/` | `velnox-api` |

### 🔒 Зайняті порти (не використовувати!)

| Порт | Ким зайнятий |
|------|-------------|
| `80` | nginx |
| `8501` | irbis-asana (Streamlit) |
| `8505` | velnox-frontend (Next.js) |
| `8506` | **php8.3-fpm** (системний — НЕ займати!) |
| `8507` | velnox-api (Laravel `artisan serve`) |

> ⚠️ Наступний вільний порт для нового проекту: **`8508`**, далі `8509`, `8510`...

---

## 📁 Структура проектів на сервері

```
/srv/projects/
├── irbis-asana/          ← Python / Streamlit
│   ├── app/              ← код з GitHub
│   ├── venv/             ← Python virtualenv
│   ├── data/
│   ├── logs/
│   └── .env
└── velnox/               ← Laravel API + Next.js Frontend
    ├── api/              ← Laravel (порт 8507)
    ├── frontend/         ← Next.js (порт 8505)
    └── logs/
```

Nginx locations конфіг: `/etc/nginx/velnox_locations.conf`

---

## 🔑 API Ключі

> ⚠️ Зберігаються у файлі `.env` в папці проекту на сервері та локально. **Ніколи не комітити!**

| Сервіс | Змінна | Де отримати |
|--------|--------|-------------|
| Asana | `ASANA_ACCESS_TOKEN` | [app.asana.com/0/my-apps](https://app.asana.com/0/my-apps) |
| Asana OAuth | `ASANA_CLIENT_ID` / `ASANA_CLIENT_SECRET` | Там само |
| Gemini AI | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| OpenAI | `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| FTP (звіти) | `FTP_HOST` / `FTP_USER` / `FTP_PASS` | Хостинг провайдер |
| GitHub (deploy) | PAT Token | [github.com/settings/tokens](https://github.com/settings/tokens) — права: `repo` |

---

## 📋 Чеклист для нового проекту

### 1. Визначити вільний порт
```bash
ss -tlnp | grep -E '850[0-9]'
```
Взяти наступний незайнятий номер після `8507`.

### 2. Підготовка репозиторію
- [ ] Перевірити `requirements.txt` або `composer.json` / `package.json`
- [ ] `.env` додати в `.gitignore` (ніколи не комітити ключі!)
- [ ] Комітнути і запушити на GitHub

### 3. Структура на сервері
```bash
# Підключитись до сервера
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null user@mail.irbis.ua

# Для Python/Streamlit проекту:
mkdir -p /srv/projects/{project-name}/{app,venv,data,logs,reports}

# Для Laravel+Next.js проекту:
mkdir -p /srv/projects/{project-name}/{api,frontend,logs}
```

### 4. Клонування коду
```bash
git config --global http.sslVerify false   # WatchGuard SSL bypass
git clone -b {branch} https://{PAT}@github.com/{org}/{repo}.git /srv/projects/{project-name}/app
```

### 5. Встановлення залежностей

**Python / Streamlit:**
```bash
python3 -m venv /srv/projects/{project-name}/venv
/srv/projects/{project-name}/venv/bin/pip install \
  --trusted-host pypi.org \
  --trusted-host files.pythonhosted.org \
  -r /srv/projects/{project-name}/app/requirements.txt
```

**Laravel (PHP):**
```bash
cd /srv/projects/{project-name}/api
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
php artisan migrate
```

**Next.js:**
```bash
cd /srv/projects/{project-name}/frontend
npm install
npm run build
```

### 6. Systemd сервіс
```bash
sudo nano /etc/systemd/system/{project-name}.service
```

**Шаблон для Python / Streamlit:**
```ini
[Unit]
Description={Project Name}
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/srv/projects/{project-name}/app
EnvironmentFile=/srv/projects/{project-name}/.env
ExecStart=/srv/projects/{project-name}/venv/bin/streamlit run dashboard/dashboard.py \
  --server.port=850X --server.address=0.0.0.0 --server.headless=true
Restart=always
RestartSec=10
StandardOutput=append:/srv/projects/{project-name}/logs/app.log
StandardError=append:/srv/projects/{project-name}/logs/app.log

[Install]
WantedBy=multi-user.target
```

**Шаблон для Laravel (PHP artisan serve):**
```ini
[Unit]
Description={Project Name} Laravel API
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/srv/projects/{project-name}/api
ExecStart=/usr/bin/php artisan serve --host=127.0.0.1 --port=850X
Restart=always
RestartSec=10
StandardOutput=append:/srv/projects/{project-name}/logs/api.log
StandardError=append:/srv/projects/{project-name}/logs/api.log

[Install]
WantedBy=multi-user.target
```

**Шаблон для Next.js:**
```ini
[Unit]
Description={Project Name} Next.js Frontend
After=network.target

[Service]
Type=simple
User=user
WorkingDirectory=/srv/projects/{project-name}/frontend
Environment=NODE_ENV=production
Environment=PORT=850X
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=append:/srv/projects/{project-name}/logs/frontend.log
StandardError=append:/srv/projects/{project-name}/logs/frontend.log

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable {project-name}
sudo systemctl start {project-name}
sudo systemctl status {project-name}
```

### 7. Nginx — додати location

Редагувати `/etc/nginx/velnox_locations.conf`:

```bash
sudo nano /etc/nginx/velnox_locations.conf
```

**Шаблон для Streamlit (з WebSocket):**
```nginx
location ^~ /{project-name}/ {
    proxy_pass http://127.0.0.1:850X/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 86400;
}
```

**Шаблон для Laravel API (з strip prefix):**
```nginx
location ^~ /{project-name}-api/ {
    proxy_pass http://127.0.0.1:850X/;   # ← trailing slash = strip prefix!
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

**Шаблон для Next.js:**
```nginx
location ^~ /{project-name} {
    proxy_pass http://127.0.0.1:850X;    # ← без trailing slash
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 8. Cron (щоденні задачі, якщо потрібно)
```bash
crontab -e
```
```
59 21 * * * /srv/projects/{project-name}/run_daily.sh
0 6 * * 1 cd /srv/projects/{project-name}/app && git pull origin main >> /srv/projects/{project-name}/logs/git_pull.log 2>&1
```

---

## ⚠️ Важливі правила

1. **`.env` ніколи не комітити** в GitHub — тільки `.env.example` з порожніми значеннями
2. **Перевіряй порти перед деплоєм!** `ss -tlnp | grep 850` — порт `8506` зайнятий php-fpm, не використовувати
3. **Strip prefix в nginx**: якщо `proxy_pass` вказаний з trailing slash (`http://127.0.0.1:PORT/`) — префікс location вирізається. Без trailing slash — передається як є
4. **SSL bypass для pip/git** (WatchGuard перехоплює HTTPS):
   - pip: `--trusted-host pypi.org --trusted-host files.pythonhosted.org`
   - git: `git config --global http.sslVerify false`
5. **Docker Hub заблокований** WatchGuard — використовувати virtualenv замість Docker
6. **sudo через SSH** потребує `-tt` флаг або `echo "pass" | sudo -S ...`
7. **WatchGuard portal** сесія прив'язана до IP браузера — SSH з того ж пристрою одразу після авторизації
8. **SSH known_hosts** може конфліктувати після перелогіну — використовувати `-o UserKnownHostsFile=/dev/null`
9. **Порти ззовні** доступні тільки через nginx на порту 80 — прямий доступ до 850X з інтернету закритий NAT-ом

---

## 🔧 Корисні команди

```bash
# Статус всіх проектів
sudo systemctl status irbis-asana-dashboard velnox-api velnox-frontend nginx

# Логи в реальному часі
sudo journalctl -u velnox-api -f
sudo journalctl -u irbis-asana-dashboard -f

# Перевірити зайняті порти
ss -tlnp | grep -E '80|850'

# Оновити код і рестартувати (irbis-asana)
cd /srv/projects/irbis-asana/app && git pull && sudo systemctl restart irbis-asana-dashboard

# Оновити код і рестартувати (velnox)
cd /srv/projects/velnox/api && git pull && sudo systemctl restart velnox-api
cd /srv/projects/velnox/frontend && git pull && npm run build && sudo systemctl restart velnox-frontend

# Перевірити nginx конфіг перед застосуванням
sudo nginx -t

# Перезавантажити nginx без зупинки
sudo systemctl reload nginx

# Переглянути поточний nginx locations конфіг
cat /etc/nginx/velnox_locations.conf
```
