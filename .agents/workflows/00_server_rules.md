---
description: How to deploy and work with the Velnox project
---
# Always follow these rules for Velnox:
1. **Never run or install** Node.js, PHP, or Composer locally. 
2. The local machine is ONLY for code editing and syncing.
3. Always refer to `/Users/localmac/Desktop/Велнокс/DEPLOYMENT_GUIDE.md` for architecture and deployment info.
4. Testing is done by deploying the code to the external server (`mx.irbis.ua`).
5. **DATABASE BACKUP**: BEFORE every commit, you MUST create a backup of the SQLite database.
   - Command: `cp velnox-api/database/database.sqlite velnox-api/database/backups/$(date +%Y%m%d_%H%M%S)_database.sqlite`
6. **DUAL COMMIT & PUSH**: Every change MUST be committed locally AND pushed to GitHub (`origin main`).
7. **RSYNC SAFETY** (added 2026-05-19): All deploy `.exp` scripts MUST include `--exclude "database/*.sqlite" --exclude "storage/*.sqlite"` in rsync commands. Without this, the local empty DB overwrites the server's seeded database → complete data loss. Verify this exclusion before running any deploy script.
8. **SPEC KEY NAMESPACING** (added 2026-05-19): Bearings spec keys have no prefix (`J_mm`, `d_mm`, `L`, etc.). All other categories use a category prefix (`hub_J_mm`, `hub_D_mm`, `seal_*`, etc.). Same key name in different categories = different semantic meaning → must be different keys.
9. **IMAGE PATH RULE** (added 2026-05-19, corrected after testing): ALL image paths everywhere (DB, hardcoded in components, fallbacks) MUST include the full `/velnox/` prefix: `/velnox/images/...`, `/velnox/models/...`. Reason: nginx `location /velnox/` proxies to Next.js; browser requests without `/velnox/` return 404. `<Image>` with `unoptimized: true` renders src AS-IS without adding basePath. Diagnosis: nginx `GET /images/... 404` = missing `/velnox/` prefix.
