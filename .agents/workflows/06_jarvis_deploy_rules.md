---
description: Jarvis deploy правила — порядок (git → server pull → rebuild потрібного контейнера → перевірка), таблиця "що змінилось → що rebuild", як відкотити
---

# Jarvis — Deploy Rules

Правила деплою на production server (`jarvis@100.78.168.112:~/jarvis/`).

## Залізне правило

**Деплоюється тільки те що в git `main` гілці на GitHub.**
- ❌ Не `scp` файли напряму на сервер
- ❌ Не `docker cp` як постійний фікс (тільки для термінового тесту)
- ❌ Не редагувати код через `vim` на сервері

## Порядок деплою

### Крок 1: локально
```bash
cd /Users/localmac/Desktop/Пятниця/jarvis
git status                    # має бути "nothing to commit"
git push origin main
```

### Крок 2: pull на сервері
```bash
ssh -i ~/.ssh/id_ed25519_antigravity jarvis@100.78.168.112 "cd ~/jarvis && git pull"
```

### Крок 3: rebuild відповідного контейнера

| Що змінилось | Команда |
|---|---|
| `audio/app/*` | `docker compose build whisper && docker compose up -d whisper` |
| `audio/requirements.txt` або `Dockerfile` | `docker compose build --no-cache whisper && docker compose up -d whisper` |
| `listener/app/*` | `docker compose build listener && docker compose up -d listener` |
| `orchestrator/app/*` | `docker compose build orchestrator && docker compose up -d orchestrator` |
| `orchestrator/web/*` | НЕ треба rebuild — `git pull` достатньо (статичні файли) |
| `docker-compose.yml` | `docker compose up -d` (без build) |
| Тільки docs/README | НЕ треба нічого |

**Why:** Python код у контейнерах закопіюваний в image через `COPY app/`. Без rebuild контейнер бачить старий код.

### Крок 4: перевірка
```bash
docker ps --format '{{.Names}}\t{{.Status}}' | grep jarvis
docker exec jarvis-whisper grep -c '<нова_функція_з_коміту>' /app/app/main.py
docker logs --tail 30 jarvis-whisper 2>&1 | grep -iE 'error|exception|started'
```

### Крок 5: smoke test (для критичних змін)
Запустити коротку нараду 10-30с через UI на `http://100.78.168.112:8000`, перевірити що в БД є чисті сегменти без галюцинацій.

## Що rebuild НЕ робить
- Не міняє `/data/jarvis.db` (volume persistent)
- Не міняє embeddings, не видаляє speakers
- Не зачіпає аудіо файли
- **Безпечно rebuild'ити whisper посеред дня** — дані лишаються

## Відкат (rollback)

**Швидко** — попередній image ще в Docker:
```bash
docker images jarvis-whisper
docker tag <prev_id> jarvis-whisper:latest
docker compose up -d whisper
```

**Через git:**
```bash
cd ~/jarvis
git log --oneline | head -10
git checkout <hash> -- audio/app/main.py    # один файл
# або: git revert <bad_hash> && git push
```

## Особливі випадки

### Зміна схеми БД (`db.py` `CREATE TABLE`)
**НЕБЕЗПЕЧНО** — sqlite не робить migrations. Перед rebuild:
1. Backup: `docker exec jarvis-whisper cp /data/jarvis.db /data/jarvis.db.bak.$(date +%s)`
2. Описати migration окремим SQL
3. Виконати migration вручну
4. Тільки потім rebuild

### Зміна `requirements.txt`
- `--no-cache` обовʼязково
- Перевірити що моделі завантажились після старту (15-30с)
- Pin `numpy<2.0`, `huggingface-hub<0.24` — НЕ знімати, ламає pyannote

## Що НЕ робити
- ❌ Не деплоїти "одним великим комітом" — деплой має бути атомарним за scope
- ❌ Не rebuild всі контейнери разом якщо змінився один
- ❌ Не деплоїти посеред наради (втратиш чанк/контекст)
- ❌ Не запускати `docker system prune -a` без обережності — може знести volume з БД
- ❌ Не міняти env vars (HF_TOKEN, WHISPER_MODEL) без рестарту контейнера
