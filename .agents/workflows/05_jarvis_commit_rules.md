---
description: Jarvis git commit правила — формат повідомлень (conventional commits + scope), коли комітити, що НЕ комітити
---

# Jarvis — Commit Rules

Правила git commit для repo `git@github.com:mykolakotsyuba-stack/jarvis.git`.

## Формат повідомлення

**Conventional commits** з українським body:
```
<type>(<scope>): <короткий заголовок англ., до 70 символів>

<пояснення українською: ЩО змінено і ЧОМУ>
<деталі по пунктах, якщо треба>
```

**Types:** `fix`, `feat`, `refactor`, `perf`, `chore`, `docs`, `test`

**Scopes:**
- `whisper` — `audio/app/main.py`, транскрипція
- `reprocess` — `audio/app/reprocess.py`, нічний пайплайн
- `listener` — `listener/app/main.py`, нова архітектура
- `orchestrator` — `orchestrator/app/main.py`, FastAPI/UI
- `db` — `audio/app/db.py`, SQLite схема
- `infra` — docker-compose, скрипти, конфіги
- `web` — `orchestrator/web/`, frontend

**Why:** Conventional Commits + scope дозволяють швидко знайти що змінилось у певному модулі. Українське тіло — бо проєкт ведеться українською, а заголовок англійською щоб не ламати tooling.

## Коли комітити

- ✅ Один логічний фікс = один коміт. Якщо 2 окремі проблеми → 2 коміти.
- ✅ Перед деплоєм — все має бути закомічено. Деплоєм є тільки те що в git.
- ✅ Після перевірки що працює локально (хоча б синтаксис).
- ❌ Не комітити "WIP" у `main` — окрема гілка `wip/<topic>`.
- ❌ Не амендити запушені коміти (`--amend` після push). Створювати новий коміт-фікс.
- ❌ Не комітити прямо на сервері. Тільки локально → push → pull на сервері.

## Що НЕ комітити

- `.env` (HF_TOKEN, секрети) — вже в `.gitignore`
- `*.db`, `*.db-journal` — бінарні SQLite
- `*.wav`, `*.webm` — аудіо записи
- `__pycache__/`, `*.pyc`
- `data/`, `results/`

## SSH ключ для push

Repo налаштовано на `~/.ssh/id_ed25519_antigravity`. Якщо `Permission denied (publickey)`:
```bash
cd /Users/localmac/Desktop/Пятниця/jarvis
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_antigravity -o IdentitiesOnly=yes"
```

## Приклад

```
fix(whisper): hallucination filter + tighter VAD + min embedding duration

- Додано HALLUCINATION_PATTERNS у main.py (раніше було тільки в reprocess.py)
- Фільтр перед db.add_segments в /transcribe і /process_turn
- no_speech_threshold 0.3 -> 0.5
- _process_turn_impl: вимагати >=1.5с для embedding; коротші -> UNDECIDED
```
