# DineFlow CRM — Universal AI Agent Rules
# Read this file before doing ANYTHING in this project.

---

## Project Overview

**DineFlow** is a Michelin-service restaurant CRM and operations suite.
Built with: **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **CSS Modules**, **Zustand** (to be implemented).

---

## CRITICAL — Next.js Version Warning

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know from your training data.
This version has breaking changes — APIs, conventions, and file structure may all differ.
Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices. Do NOT assume patterns from Next.js 12/13/14 still apply.
<!-- END:nextjs-agent-rules -->

---

## Project File Structure

```
src/
├── app/
│   ├── layout.js              ← Root layout. Fonts and global metadata live here only.
│   ├── globals.css            ← Global styles, font imports. Do NOT duplicate fonts in pages.
│   └── (crm)/
│       ├── layout.jsx         ← CRM shell: Sidebar + Header. Owns UI state only (sidebarOpen).
│       ├── dashboard/page.jsx
│       ├── orders/page.jsx
│       ├── service/page.jsx
│       ├── kds/page.jsx
│       ├── tables/page.jsx
│       ├── menu/page.jsx
│       ├── customers/page.jsx
│       ├── staff/page.jsx
│       ├── campaigns/page.jsx
│       └── loyalty/page.jsx
├── components/
│   ├── Header.jsx
│   └── Sidebar.jsx
├── lib/
│   ├── icons.jsx              ← All icon imports live here only. Never import icons directly from lucide.
│   └── stores/                ← Zustand stores (to be created in Phase 2)
│       ├── ordersStore.js
│       ├── customersStore.js
│       └── tablesStore.js
├── services/                  ← Service layer (to be created in Phase 2)
│   ├── OrderService.js
│   ├── CustomerService.js
│   └── TablesService.js
└── style/
    └── *.module.css           ← One CSS module per page. Never add Tailwind utility classes in JSX.
```

---

## Architecture Rules — ENFORCE THESE WITHOUT EXCEPTION

### Rule 1: State Ownership
- **Pages own ONLY UI state**: `isModalOpen`, `activeFilter`, `activeTab`, `selectedItem`
- **Pages NEVER own business data**: orders array, customers array, staff list, reservations list
- **Business data lives in Zustand stores only**

### Rule 2: Service Layer is Mandatory
- Components and pages NEVER import from Zustand stores directly
- Components and pages ALWAYS call service functions: `OrderService.transitionOrder(id, status)`
- Service functions are the ONLY layer that touches stores
- This rule exists so that when the backend is added, only service files change — not pages

### Rule 3: No Duplicate Font or Style Imports
- Google Fonts are imported ONCE in `src/app/globals.css`
- Material Symbols icon stylesheet is imported ONCE in `src/app/globals.css`
- NEVER add `<link>`, `<meta>`, `<title>`, or `<style dangerouslySetInnerHTML>` inside page JSX
- Page metadata uses Next.js `export const metadata = {}` only

### Rule 4: CSS Modules Only in JSX
- Use `className={styles.componentName}` from the page's module file
- NEVER write Tailwind utility classes directly in JSX (e.g. `className="flex gap-4 p-2"`)
- Tailwind is used only inside CSS module files via `@apply` if needed

### Rule 5: Icons
- ALL icon imports come from `@/lib/icons`
- NEVER import directly from `lucide-react` or any other icon library inside a page or component

### Rule 6: No Hardcoded Business Data in Pages or Components
- Page files must not contain mock data arrays inline
- Mock data lives in the Zustand store initial state only
- Header subtitles (`"14 active orders"`) must derive from store values, not static strings

---

## Data Models (Lock These In — Do Not Change Shape Without Updating Stores)

### Order
```js
{
  id: "ORD-9012",           // string
  table: "T-12",            // string
  items: [{ name: string, meta?: string }],
  status: "incoming" | "preparing" | "ready",
  createdAt: Date,          // real timestamp — NOT a static string like "18m ago"
  price: "$64.00",          // string
  isDelayed?: boolean,
  customerId?: string       // optional — associated customer ID (Phase 1b)
}
```

### Customer
```js
{
  id: string,
  name: string,
  email: string,
  phone: string,
  tier: "Standard" | "VIP" | "Platinum",
  visits: number,
  lastVisit: Date,
  totalSpend: number
}
```

### Table
```js
{
  id: "T-1",
  zone: "WINDOW" | "CENTER" | "PRIVATE" | "BAR",
  seats: number,
  status: "available" | "occupied" | "reserved" | "cleaning",
  reservedAt?: string,      // time string e.g. "19:30"
  currentCustomerId?: string, // optional — associated customer ID currently seated (Phase 1b)

  // Spatial Canvas extension fields (Phase 7a)
  x: number,                // canvas x position (px)
  y: number,                // canvas y position (px)
  width: number,            // shape width (px)
  height: number,           // shape height (px)
  rotation: number,         // degrees
  shape: "rect" | "round" | "bar", // visual shape type
  floorId: string           // associated floor ID
}
```

### Floor
```js
{
  id: string,               // e.g. "floor-1"
  name: string,             // e.g. "Main Dining"
  order: number,            // display order sequence
  canvasWidth: number,      // width (px)
  canvasHeight: number      // height (px)
}
```

### Reservation
```js
{
  id: number,
  guest: string,
  details: string,
  time: string,
  status: "PENDING" | "CONFIRMED" | "SEATED" | "LATER",
  tableId?: string          // associated table ID for the interactive timeline
}
```

---

## Roles by AI Tool

### Gemini 3.5 Flash (High) — IMPLEMENTER
- Read this file (AGENTS.md) before every task
- Receive a written implementation plan from Gemini 3.1 Pro (High)
- Execute the plan exactly as written — file by file, step by step
- Do not deviate from the plan without flagging it first
- After completing implementation, stop and report what was done

### Gemini 3.1 Pro (High) — PLANNER and REVIEWER
- See CLAUDE.md (Instructions for Planner/Reviewer) for full role instructions

---

## Known Problems to Fix (Prioritized)

### Phase 1 — Foundation (No Dependencies)
- [x] Remove raw `<meta>`, `<title>`, `<link>` tags from page JSX (done in commit 581d867)
- [ ] Fix root layout metadata: title is still "Create Next App" in `src/app/layout.js`
- [ ] Lock in data model shapes for Order, Customer, Table, Reservation

### Phase 2 — Global State
- [ ] Install Zustand
- [ ] Create `src/lib/stores/ordersStore.js` with mock data and actions
- [ ] Create `src/lib/stores/customersStore.js` with mock data and actions
- [ ] Create `src/lib/stores/tablesStore.js` with mock data and actions
- [ ] Create `src/services/OrderService.js`
- [ ] Create `src/services/CustomerService.js`
- [ ] Create `src/services/TablesService.js`

### Phase 3 — Connect Pages
- [ ] Connect `/orders` page to ordersStore via OrderService (replace local useState)
- [ ] Connect `/service` page to ordersStore via OrderService (replace local useState)
- [ ] Connect `/kds` page to ordersStore via OrderService
- [ ] Connect `/dashboard` page — KPI values derive from stores

### Phase 4 — Surfaces
- [ ] Fix Header.jsx — all subtitle strings derive from store values, not static strings
- [ ] Fix order timers — computed from `createdAt` timestamp, not static string labels

### Phase 5 — Fill Gaps
- [ ] Make `/tables` floor map interactive using tablesStore
- [ ] Build `/loyalty` page with real state and layout
- [ ] Add loading states and error boundaries
