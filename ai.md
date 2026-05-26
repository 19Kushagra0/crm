# DineFlow — AI Shortcut Commands

This file defines shortcut commands for repetitive tasks.
All AI tools should check this file for quick-trigger instructions.

---

## Workflow Overview

```
1. You → Gemini 3.1 Pro (High):  "plan phase X"       Writes the plan, then stops
2. You → Gemini 3.5 Flash (High): "implement phase X" Executes the plan, then stops
3. You → Gemini 3.1 Pro (High):  "review"             Audits, flags violations, then stops
4. You → Gemini 3.5 Flash (High): "fix [description]" Fixes only what was flagged, then stops
5. Repeat from step 3 until Gemini 3.1 Pro says APPROVED
6. Move to next phase
```

---

## Shortcut Command Reference

### For Gemini 3.1 Pro (High) — PLANNER and REVIEWER

| Command | What Gemini 3.1 Pro Does |
|---|---|
| `plan phase 1` | Write Phase 1 implementation plan — Fix metadata title, lock data models |
| `plan phase 2` | Write Phase 2 implementation plan — Install Zustand, create stores and services |
| `plan phase 3` | Write Phase 3 implementation plan — Connect pages to stores via service layer |
| `plan phase 4` | Write Phase 4 implementation plan — Fix Header subtitles, fix order timers |
| `plan phase 5` | Write Phase 5 implementation plan — Tables interactivity, loyalty page, loading states |
| `review` | Audit last changed files against all AGENTS.md rules |
| `status` | Show which phases are done, in progress, not started |
| `what next` | State the next uncompleted task from the AGENTS.md checklist |

### For Gemini 3.5 Flash (High) — IMPLEMENTER

| Command | What Gemini 3.5 Flash Does |
|---|---|
| `implement phase 1` | Execute Phase 1 plan from Gemini 3.1 Pro (High) |
| `implement phase 2` | Execute Phase 2 plan from Gemini 3.1 Pro (High) |
| `implement phase 3` | Execute Phase 3 plan from Gemini 3.1 Pro (High) |
| `implement phase 4` | Execute Phase 4 plan from Gemini 3.1 Pro (High) |
| `implement phase 5` | Execute Phase 5 plan from Gemini 3.1 Pro (High) |
| `fix [description]` | Fix specific violation Gemini 3.1 Pro (High) flagged in review |
| `1` | Inspect and fix `src/app/page.jsx` syntax issues and verify build |

---

## Phase Summary

| Phase | Goal | Status | Implemented By | Reviewed By |
|---|---|---|---|---|
| Phase 1 | Fix metadata title + lock data model shapes | ✅ Complete | Gemini 3.5 Flash (High) | Gemini 3.1 Pro (High) - APPROVED |
| Phase 2 | Install Zustand + create stores + create service layer | ✅ Complete | Gemini 3.5 Flash (High) | Gemini 3.1 Pro (High) - APPROVED |
| Phase 3 | Connect orders, service, kds, dashboard pages to stores | ✅ Complete | Gemini 3.5 Flash (High) | Gemini 3.1 Pro (High) - APPROVED |
| Phase 4 | Fix Header dynamic subtitles + real computed order timers | ⬜ Not Started | — | — |
| Phase 5 | Tables interactivity + loyalty page + loading/error states | ⬜ Not Started | — | — |

---

## Implementation Log

### Phase 1 — ✅ Complete
- **Implemented by:** Gemini 3.5 Flash (High)
- **Reviewed by:** ✅ Gemini 3.1 Pro (High) - Approved
- **Files modified:**
  - `src/app/layout.js` — Updated title from `"Create Next App"` to `"DineFlow"` and added description metadata
  - `src/app/(crm)/orders/page.jsx` — Replaced all static `timer` string fields with `createdAt: new Date(Date.now() - X * 60 * 1000)` to match the canonical Order data model
  - `src/app/(crm)/service/page.jsx` — Added TODO comments above each static `time` field flagging them for Phase 3 dynamic computation
- **Build result:** ✅ Zero errors

### Phase 2 — ✅ Complete
- **Implemented by:** Gemini 3.5 Flash (High)
- **Reviewed by:** ✅ Gemini 3.1 Pro (High) - Approved
- **Files created:**
  - `src/lib/stores/ordersStore.js` — Zustand store, exports `useOrdersStore`. Holds active and completed orders. Actions: `transitionOrder`, `serveAndClose`.
  - `src/lib/stores/customersStore.js` — Zustand store, exports `useCustomersStore`. Holds customers list. Actions: `addCustomer`, `updateCustomer`. Uses locked tiers: `"Standard" | "VIP" | "Platinum"`.
  - `src/lib/stores/tablesStore.js` — Zustand store, exports `useTablesStore`. Holds table floor map. Action: `setTableStatus`.
  - `src/services/OrderService.js` — Service layer, default export `OrderService`. Wraps `useOrdersStore.getState()` calls.
  - `src/services/CustomerService.js` — Service layer, default export `CustomerService`. Wraps `useCustomersStore.getState()` calls.
  - `src/services/TablesService.js` — Service layer, default export `TablesService`. Wraps `useTablesStore.getState()` calls.
- **Files modified:**
  - `package.json` — Added `zustand ^5.0.13` to `dependencies`
- **Known conflict recorded:** `customers/page.jsx` uses non-standard tiers (`"Gold"`, `"Silver"`, `"At Risk"`). Store uses locked model tiers. Will be reconciled in Phase 3.
- **No page files were modified in this phase**
- **Build result:** ✅ Compiled successfully in 7.3s, zero errors, all 14 pages generated

### Phase 3 — ✅ Complete
- **Implemented by:** Gemini 3.5 Flash (High)
- **Reviewed by:** ✅ Gemini 3.1 Pro (High) - Approved
- **Files modified:**
  - `src/services/OrderService.js` — Exposed reactive custom hooks `useActiveOrders` and `useCompletedOrders`.
  - `src/services/TablesService.js` — Exposed reactive custom hook `useTables`.
  - `src/app/(crm)/orders/page.jsx` — Replaced local mock state and arrays with live `OrderService` custom hooks. Added a dynamic duration calculation helper (`getMinutesAgo`).
  - `src/app/(crm)/service/page.jsx` — Replaced inline `initialOrders` state with reactive `OrderService.useActiveOrders()`. Updated UI rendering of order table badges, titles, dynamic notes extraction, and integrated status cycling logic.
  - `src/app/(crm)/kds/page.jsx` — Replaced local mock state with `OrderService` hooks. Added status cycling handlers, a dynamic station heuristic parser based on order items (`getStation`), and item quantity/clean-name parsing.
  - `src/app/(crm)/dashboard/page.jsx` — Added `"use client";` directive and connected KPI cards to reactively display dynamic active orders count and occupied tables metrics (e.g., `9 / 14` with a live progress bar percentage).
- **Build result:** ✅ Compiled successfully in 7.7s, zero errors, production build verified

---

## Notes

- Gemini 3.1 Pro (High) is the PLANNER and REVIEWER — see `CLAUDE.md`
- Gemini 3.5 Flash (High) is the IMPLEMENTER — see `GEMINI.md`
- All architectural rules live in `AGENTS.md` — every AI must read it first
- Never skip a phase — each phase is a dependency for the next
- Current reviewer: **Gemini 3.1 Pro (High)** (Phase 3 Approved)
