---
description: Jarvis Core (AI-сервер для нарад) — де код, як деплоїти, як запускати reprocess. Всі AI повинні слідувати цьому процесу.
---

# Jarvis Core — Workflow

## Де код
- **Канонічне джерело:** `/Users/localmac/Desktop/Пятниця/jarvis/` (git repo)
- **GitHub remote:** `git@github.com:mykolakotsyuba-stack/jarvis.git` (branch `main`)
- **SSH config:** `git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_antigravity -o IdentitiesOnly=yes"` (вже встановлено в repo)
- **Production:** `jarvis@100.78.168.112:~/jarvis/` — НЕ редагувати вручну, тільки `git pull`

**Why:** до 2026-06-14 код жив тільки на сервері без версій. Тепер локально → git → сервер.

## Деплой flow
1. Редагувати локально → `git commit && git push origin main`
2. `ssh -i ~/.ssh/id_ed25519_antigravity jarvis@100.78.168.112 "cd ~/jarvis && git pull"`
3. Якщо зміна в `audio/app/` або `listener/app/`:
   ```bash
   docker compose build whisper   # або listener
   docker compose up -d whisper
   ```
4. Якщо тільки `orchestrator/web/` — `git pull` достатньо

**Why:** `docker cp` працює для разової зміни, але втрачається при рестарті. Треба rebuild image.

## Контейнери і volumes
- `jarvis-whisper` (GPU): Whisper + pyannote. БД `/data/jarvis.db`, чанки `/data/audio/*.webm`
- `jarvis-listener` (CPU, нова арх.): пише `/data/full_recordings/rec_{id}_*_full.wav` та `/data/turns/*.wav`
- `jarvis-orchestrator`: FastAPI + UI на 8000
- `jarvis-chromadb`: для LLM RAG (не для діаризації)

**Volumes НЕ перетинаються між контейнерами.** Listener-файли не видно з whisper. Bridge:
```bash
docker cp jarvis-listener:/data/full_recordings/rec_X_*_full.wav /tmp/
docker cp /tmp/X.wav jarvis-whisper:/data/
```

## Reprocess правила
**ЗАВЖДИ передавати `--prompt`** зі специфічним контекстом наради. Захардкоджений prompt у `WHISPER_PASSES` залишився від rec 5 (CRM/педагогіка).

```bash
docker exec jarvis-whisper python3 -m app.reprocess <id> 0.45 \
  --audio-file /data/rec_<id>_full.wav \
  --prompt 'Нарада з SEO. Учасники: A, B, C. Терміни: Search Console, ...'
```

Threshold:
- 0.45 (default) — консервативно, багато UNKNOWN
- 0.50-0.55 — більше матчів, ризик плутанини
- Якщо UNKNOWN — НЕ підкручувати threshold. Краще власник прослухає сегменти і помітить вручну → це додасть confirmed embeddings → наступний reprocess спрацює.

## Whisper параметри — не повертати на старі (виправлено 2026-06-14)
- `no_speech_threshold = 0.5` (НЕ 0.3 — джерело галюцинацій "Дякую за перегляд")
- `compression_ratio_threshold = 2.4`
- `log_prob_threshold = -1.0`
- `MIN_EMBEDDING_SEC = 1.5` — embedding на коротших сегментах не робити, бо створює фантомних "Невідомий N"
- `is_hallucination()` має бути викликаний у ВСІХ пайплайнах (`main.py` І `reprocess.py`), не дублювати — винести в спільний модуль при можливості

## Що НЕ робити
- ❌ Не редагувати код напряму на сервері (loss of history)
- ❌ Не запускати reprocess без `--prompt`
- ❌ Не знижувати `no_speech_threshold` нижче 0.5 без явної причини
- ❌ Не міняти `is_hallucination()` тільки в одному файлі
- ❌ Не використовувати `docker cp` як постійний фікс — тільки для термінового тесту

## Корінні регресії 2026-06-14 (не повторити)
1. Фільтр галюцинацій був тільки в `reprocess.py` → live pipeline писав "Дякую за перегляд!" в БД
2. `no_speech_threshold=0.3` → галюцинації на тиші
3. Embedding на сегментах <1.5с → клони "Невідомий 81-94"
4. `reprocess.py` був захардкоджений на recording 5 (Антон/Наталя/Іра + CRM prompt)
5. Listener-архітектура НЕ пише chunks у `/data/audio` — потрібно `--audio-file`
