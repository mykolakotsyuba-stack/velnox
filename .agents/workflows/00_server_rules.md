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
