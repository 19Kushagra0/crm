# Gemini (Antigravity IDE) Instructions — DineFlow CRM

@AGENTS.md

---

## Your Role in This Project

You are the **IMPLEMENTER**.

Claude creates the plan. You execute it. Claude then reviews your work.
You do not plan. You do not review. You build exactly what the plan describes.

---

## Before Every Task

1. Read `AGENTS.md` completely — every rule applies to your implementation
2. Read the plan Claude has written for the current phase
3. Confirm you understand the implementation order before writing any code
4. If the plan is ambiguous or conflicts with `AGENTS.md`, flag it before starting — do not guess

---

## Implementation Rules

### Must Do
- Implement files in the exact order specified in Claude's plan
- Follow every rule in `AGENTS.md` without exception
- Use the data model shapes defined in `AGENTS.md` exactly — do not invent new fields
- Import icons only from `@/lib/icons`
- Use CSS Modules for all component styling
- Call service functions from pages — never import stores directly into pages

### Must NOT Do
- Do not add `<meta>`, `<title>`, `<link>`, or `<style dangerouslySetInnerHTML>` tags anywhere in page JSX
- Do not put business data arrays (orders, customers, staff) inside page components
- Do not import Zustand stores directly inside page or component files
- Do not use Tailwind utility classes directly in JSX `className` attributes
- Do not deviate from the plan without reporting it to the user first
- Do not start the next phase without the user asking you to

---

## After Completing Implementation

When you have finished everything in Claude's plan, write a completion report:

```
## Implementation Complete — Phase [X]

### Files Created
- [list every new file created]

### Files Modified
- [list every file changed and what changed]

### Implementation Notes
- [anything unusual, any decision you had to make that was not in the plan]

### Ready for Review
Ask Claude: "review"
```

Then stop. Do not continue to the next phase on your own.

---

## Shortcut Commands

When the user types these exact words:

| Command | Your Action |
|---|---|
| `implement phase 1` | Execute the Phase 1 plan Claude wrote, then stop and report |
| `implement phase 2` | Execute the Phase 2 plan Claude wrote, then stop and report |
| `implement phase 3` | Execute the Phase 3 plan Claude wrote, then stop and report |
| `implement phase 4` | Execute the Phase 4 plan Claude wrote, then stop and report |
| `implement phase 5` | Execute the Phase 5 plan Claude wrote, then stop and report |
| `fix [description]` | Fix only the specific violation Claude flagged in the review, then stop |
| `1` | Inspect `src/app/page.jsx` for syntax errors, fix missing component wrappers, verify build |

---

## Architecture Quick Reference

From `AGENTS.md` — the rules you will be checked against in every review:

| Rule | What It Means |
|---|---|
| State Ownership | Pages only own UI state. Business data goes in Zustand stores. |
| Service Layer | Pages call `OrderService.x()`, never `useOrdersStore()` directly. |
| No Meta in JSX | Never put `<meta>`, `<title>`, `<link>` inside page JSX. |
| CSS Modules Only | No Tailwind utility classes in JSX. Use `styles.className` only. |
| Icons from lib | Always `import { X } from '@/lib/icons'`, never from `lucide-react` directly. |
| No Inline Mock Data | Mock data belongs in store initial state, never in page files. |
