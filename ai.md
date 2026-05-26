# DineFlow — AI Shortcut Commands

This file defines shortcut commands for repetitive tasks.
All AI tools should check this file for quick-trigger instructions.

---

## Workflow Overview

```
1. You → Claude:  "plan phase X"       Claude writes the plan, then stops
2. You → Gemini:  "implement phase X"  Gemini executes the plan, then stops
3. You → Claude:  "review"             Claude audits, flags violations, then stops
4. You → Gemini:  "fix [description]"  Gemini fixes only what Claude flagged, then stops
5. Repeat from step 3 until Claude says APPROVED
6. Move to next phase
```

---

## Shortcut Command Reference

### For Claude

| Command | What Claude Does |
|---|---|
| `plan phase 1` | Write Phase 1 implementation plan — Fix metadata title, lock data models |
| `plan phase 2` | Write Phase 2 implementation plan — Install Zustand, create stores and services |
| `plan phase 3` | Write Phase 3 implementation plan — Connect pages to stores via service layer |
| `plan phase 4` | Write Phase 4 implementation plan — Fix Header subtitles, fix order timers |
| `plan phase 5` | Write Phase 5 implementation plan — Tables interactivity, loyalty page, loading states |
| `review` | Audit last changed files against all AGENTS.md rules |
| `status` | Show which phases are done, in progress, not started |
| `what next` | State the next uncompleted task from the AGENTS.md checklist |

### For Gemini

| Command | What Gemini Does |
|---|---|
| `implement phase 1` | Execute Phase 1 plan from Claude |
| `implement phase 2` | Execute Phase 2 plan from Claude |
| `implement phase 3` | Execute Phase 3 plan from Claude |
| `implement phase 4` | Execute Phase 4 plan from Claude |
| `implement phase 5` | Execute Phase 5 plan from Claude |
| `fix [description]` | Fix specific violation Claude flagged in review |
| `1` | Inspect and fix `src/app/page.jsx` syntax issues and verify build |

---

## Phase Summary

| Phase | Goal | Status |
|---|---|---|
| Phase 1 | Fix metadata title + lock data model shapes | ⬜ Not Started |
| Phase 2 | Install Zustand + create stores + create service layer | ⬜ Not Started |
| Phase 3 | Connect orders, service, kds, dashboard pages to stores | ⬜ Not Started |
| Phase 4 | Fix Header dynamic subtitles + real computed order timers | ⬜ Not Started |
| Phase 5 | Tables interactivity + loyalty page + loading/error states | ⬜ Not Started |

---

## Notes

- Claude is the PLANNER and REVIEWER — see `CLAUDE.md`
- Gemini is the IMPLEMENTER — see `GEMINI.md`
- All architectural rules live in `AGENTS.md` — every AI must read it first
- Never skip a phase — each phase is a dependency for the next
