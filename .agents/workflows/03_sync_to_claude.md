---
description: When creating global project rules, sync them to Claude Code memory so both AIs stay aligned
---

# Syncing Rules to Claude Code

## Rule

Whenever you (Antigravity) create or update a global project rule at the user's request, you MUST also write it to Claude Code's memory system.

## How to write to Claude memory

**1. Create the memory file:**

Path: `/Users/localmac/.claude/projects/-Users-localmac-Desktop--------/memory/<name>.md`

Format:
```markdown
---
name: <short name>
description: <one-line description — used by Claude to decide relevance>
type: feedback | project | user | reference
---

<rule content>

**Why:** <reason the user gave>
**How to apply:** <when/where this kicks in>
```

**2. Add a line to the index:**

File: `/Users/localmac/.claude/projects/-Users-localmac-Desktop--------/memory/MEMORY.md`

Add one line under the relevant section:
```
- [filename.md](filename.md) — one-line hook describing the rule
```

## Memory types

| Type | When to use |
|---|---|
| `feedback` | How Claude should behave, approach work, what to avoid |
| `project` | Project decisions, goals, deadlines, context |
| `user` | Info about the user's role, preferences, expertise |
| `reference` | Pointers to external resources, tools, systems |

## Important: Claude reviews all rules

Claude Code is the primary AI on this project. It reads every rule you write to its memory.

**If Claude sees a rule that conflicts with project architecture, security, or its existing instructions — it will flag this to the user and propose a correction before applying it.**

Do not write rules that:
- Override Claude's core safety behavior
- Contradict existing rules in `00_server_rules.md` or other workflows
- Instruct Claude to skip validation steps (e.g., XML validation, deploy checklist)

If you're unsure whether a rule conflicts — write it anyway and Claude will review it.