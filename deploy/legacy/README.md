# Одноразові скрипти

Сюди зведені діагностичні та разові скрипти, які лежали в корені репозиторію
і на які ніхто не посилається — ні документація, ні інші скрипти. Історія
збережена (`git mv`), тож будь-який з них можна повернути.

- `check_*`, `get_*` — разові перевірки стану дев-сервера (логи, білд, git, env)
- `fix_*` — точкові виправлення 2026 року: nginx, laravel, `B_mm` у таблиці 3
- `restart_server.exp`, `server_diag.py`, `server-setup.sh`, `sync_images.sh`,
  `test-local.sh`, `run_update_desc.exp` — обслуговування
- `deploy_api.sh`, `deploy_api_migrate_only.exp` — витіснені варіантами
  `deploy_api_*_auto.exp` / `deploy_api_seed_only.exp`
- `kit_t1.php` — разовий сидер таблиці kit-t1

**Робочі скрипти лишились у корені:** `deploy_prod.sh`, `backup_prod.sh`,
`deploy_frontend_auto.exp`, `clean_deploy_frontend.exp`, `deploy_api_seed_only.exp`,
`deploy_api_migrate_seed.exp`, `deploy_api_auto.exp` — їхні шляхи зашиті в
документацію і правила, тому вони не переїжджали.
