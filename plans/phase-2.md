# Phase 2 Implementation Plan — Global State Foundation

**Written by:** Gemini (Planner for this phase)  
**Executed by:** Gemini (Implementer)  
**Reviewed by:** Claude (Reviewer)

---

## Objective

Install Zustand and build the global state layer: three stores and three service files.  
No pages are connected in this phase — that is Phase 3's job.  
After Phase 2, the stores and services exist and are self-contained. Pages still run off local `useState`.

---

## Context Before Starting

- Zustand is **not installed** — `package.json` has no zustand dependency.
- `src/lib/` currently contains only `icons.jsx`. The `stores/` subdirectory does not exist yet.
- `src/services/` does not exist yet.
- `src/lib/stores/` and `src/services/` must both be created as new directories.
- The locked data model shapes come from `AGENTS.md`. Do not invent new fields.

---

## Step 0 — Install Zustand

Run this command before writing any files:

```bash
npm install zustand
```

Verify it appears in `package.json` dependencies before proceeding.

---

## Files to Create

### 1. `src/lib/stores/ordersStore.js` [NEW]

This store holds the canonical order list for the entire app.  
Mock data must use the **exact** `Order` shape from `AGENTS.md`.

```js
import { create } from 'zustand';

const initialActiveOrders = [
  {
    id: "ORD-9012",
    table: "T-12",
    items: [
      { name: "2x Wagyu Tartare" },
      { name: "1x Scallop Crudo" }
    ],
    status: "incoming",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    price: "$64.00"
  },
  {
    id: "ORD-9013",
    table: "Bar-2",
    items: [
      { name: "1x Truffle Fries" },
      { name: "2x Negroni" }
    ],
    status: "incoming",
    createdAt: new Date(Date.now() - 4 * 60 * 1000),
    price: "$48.00"
  },
  {
    id: "ORD-8998",
    table: "T-4",
    items: [
      { name: "1x Tomahawk Ribeye", meta: "Med Rare" },
      { name: "2x Lobster Mac" },
      { name: "1x Grilled Asparagus" }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
    price: "$215.00",
    isDelayed: true
  },
  {
    id: "ORD-9005",
    table: "T-8",
    items: [
      { name: "2x Duck Breast" },
      { name: "1x Pommes Purée" }
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    price: "$88.00"
  },
  {
    id: "ORD-8990",
    table: "T-1",
    items: [
      { name: "1x Châteaubriand" },
      { name: "2x Caesar Salad" }
    ],
    status: "ready",
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
    price: "$145.00"
  }
];

const initialCompletedOrders = [
  { id: "ORD-8985", table: "T-6", price: "$320.00" },
  { id: "ORD-8984", table: "Bar-1", price: "$45.00" }
];

export const useOrdersStore = create((set) => ({
  activeOrders: initialActiveOrders,
  completedOrders: initialCompletedOrders,

  transitionOrder: (orderId, newStatus) =>
    set((state) => ({
      activeOrders: state.activeOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    })),

  serveAndClose: (order) =>
    set((state) => ({
      activeOrders: state.activeOrders.filter((o) => o.id !== order.id),
      completedOrders: [
        { id: order.id, table: order.table, price: order.price },
        ...state.completedOrders
      ]
    }))
}));
```

---

### 2. `src/lib/stores/customersStore.js` [NEW]

Holds the canonical customer list. Shape uses `AGENTS.md` Customer model.  
Note: the existing `customers/page.jsx` uses `tier` values like `"Gold"`, `"Silver"`, `"At Risk"` — these do **not** match the locked model (`"Standard" | "VIP" | "Platinum"`). The store uses the locked model. Phase 3 will reconcile the page to use these correct tiers.

```js
import { create } from 'zustand';

const initialCustomers = [
  {
    id: "CUST-001",
    name: "Aisha Rahman",
    email: "aisha.r@example.com",
    phone: "+91 98765 43210",
    tier: "Platinum",
    visits: 42,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalSpend: 124000
  },
  {
    id: "CUST-002",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 99887 76655",
    tier: "VIP",
    visits: 18,
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalSpend: 48000
  },
  {
    id: "CUST-003",
    name: "Maya Nambiar",
    email: "maya.n@example.com",
    phone: "+91 91234 56789",
    tier: "Standard",
    visits: 2,
    lastVisit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    totalSpend: 8500
  },
  {
    id: "CUST-004",
    name: "Priya Desai",
    email: "priya.d@example.com",
    phone: "+91 90000 11111",
    tier: "Standard",
    visits: 1,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSpend: 12000
  },
  {
    id: "CUST-005",
    name: "Rahul Joshi",
    email: "rahul.j@example.com",
    phone: "+91 98888 11111",
    tier: "Standard",
    visits: 5,
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    totalSpend: 15200
  }
];

export const useCustomersStore = create((set) => ({
  customers: initialCustomers,

  addCustomer: (customer) =>
    set((state) => ({
      customers: [customer, ...state.customers]
    })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      )
    }))
}));
```

---

### 3. `src/lib/stores/tablesStore.js` [NEW]

Holds the canonical table list. Shape uses `AGENTS.md` Table model.

```js
import { create } from 'zustand';

const initialTables = [
  { id: "T-1",  zone: "WINDOW",  seats: 2,  status: "available" },
  { id: "T-2",  zone: "WINDOW",  seats: 2,  status: "occupied" },
  { id: "T-3",  zone: "WINDOW",  seats: 4,  status: "occupied" },
  { id: "T-4",  zone: "WINDOW",  seats: 4,  status: "reserved", reservedAt: "19:30" },
  { id: "T-5",  zone: "CENTER",  seats: 4,  status: "available" },
  { id: "T-6",  zone: "CENTER",  seats: 4,  status: "occupied" },
  { id: "T-7",  zone: "CENTER",  seats: 4,  status: "reserved", reservedAt: "20:00" },
  { id: "T-8",  zone: "CENTER",  seats: 6,  status: "occupied" },
  { id: "T-12", zone: "PRIVATE", seats: 8,  status: "available" },
  { id: "T-13", zone: "PRIVATE", seats: 8,  status: "cleaning" },
  { id: "T-14", zone: "PRIVATE", seats: 10, status: "occupied" },
  { id: "B-1",  zone: "BAR",     seats: 2,  status: "occupied" },
  { id: "B-2",  zone: "BAR",     seats: 2,  status: "cleaning" },
  { id: "B-3",  zone: "BAR",     seats: 2,  status: "occupied" }
];

export const useTablesStore = create((set) => ({
  tables: initialTables,

  setTableStatus: (tableId, status, reservedAt) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, status, ...(reservedAt ? { reservedAt } : {}) }
          : t
      )
    }))
}));
```

---

### 4. `src/services/OrderService.js` [NEW]

The ONLY layer that pages and components are allowed to call to interact with orders.

```js
import { useOrdersStore } from '@/lib/stores/ordersStore';

const OrderService = {
  getActiveOrders: () => useOrdersStore.getState().activeOrders,

  getCompletedOrders: () => useOrdersStore.getState().completedOrders,

  transitionOrder: (orderId, newStatus) => {
    useOrdersStore.getState().transitionOrder(orderId, newStatus);
  },

  serveAndClose: (order) => {
    useOrdersStore.getState().serveAndClose(order);
  }
};

export default OrderService;
```

---

### 5. `src/services/CustomerService.js` [NEW]

```js
import { useCustomersStore } from '@/lib/stores/customersStore';

const CustomerService = {
  getCustomers: () => useCustomersStore.getState().customers,

  addCustomer: (customer) => {
    useCustomersStore.getState().addCustomer(customer);
  },

  updateCustomer: (id, updates) => {
    useCustomersStore.getState().updateCustomer(id, updates);
  }
};

export default CustomerService;
```

---

### 6. `src/services/TablesService.js` [NEW]

```js
import { useTablesStore } from '@/lib/stores/tablesStore';

const TablesService = {
  getTables: () => useTablesStore.getState().tables,

  setTableStatus: (tableId, status, reservedAt) => {
    useTablesStore.getState().setTableStatus(tableId, status, reservedAt);
  }
};

export default TablesService;
```

---

## Implementation Order

Execute in this exact sequence. Do not reorder.

1. Run `npm install zustand` — confirm it appears in `package.json`
2. Create `src/lib/stores/ordersStore.js`
3. Create `src/lib/stores/customersStore.js`
4. Create `src/lib/stores/tablesStore.js`
5. Create `src/services/OrderService.js`
6. Create `src/services/CustomerService.js`
7. Create `src/services/TablesService.js`
8. Run `npm run build` to confirm zero TypeScript/compilation errors

---

## Architecture Rules That Apply to This Phase

From `AGENTS.md`:

- **Rule 1 (State Ownership):** These stores are the only place business data lives. Pages still use local `useState` after this phase — that changes in Phase 3.
- **Rule 2 (Service Layer):** Pages will eventually only call `OrderService.x()` — never `useOrdersStore()` directly. The service files must be the only layer that touches the store's `getState()`.
- **Rule 6 (No Hardcoded Business Data in Pages):** The mock data moves to store initial state here. Pages still have their own copies after Phase 2 — Phase 3 removes those.

> **Important data model note:** `customersStore.js` uses the locked tier values (`"Standard" | "VIP" | "Platinum"`) from `AGENTS.md`. The current `customers/page.jsx` uses non-standard tiers (`"Gold"`, `"Silver"`, `"At Risk"`). This conflict is intentional and is recorded here. Phase 3 will align the page to the store's canonical tiers when the page is connected.

---

## Verification Checklist

Gemini must confirm every item before reporting Phase 2 complete:

- [ ] `zustand` appears in `package.json` dependencies (not devDependencies)
- [ ] `src/lib/stores/ordersStore.js` exists and exports `useOrdersStore`
- [ ] `src/lib/stores/customersStore.js` exists and exports `useCustomersStore`
- [ ] `src/lib/stores/tablesStore.js` exists and exports `useTablesStore`
- [ ] `src/services/OrderService.js` exists and exports `OrderService` as default
- [ ] `src/services/CustomerService.js` exists and exports `CustomerService` as default
- [ ] `src/services/TablesService.js` exists and exports `TablesService` as default
- [ ] All store mock data uses the exact field names from the `AGENTS.md` data models
- [ ] No page file was modified in this phase
- [ ] `npm run build` (or `npm run dev`) shows zero errors related to the new files

---

## After Completing Implementation

Gemini should write a completion report in this format:

```
## Implementation Complete — Phase 2

### Files Created
- [list every new file created]

### Files Modified
- [list every file changed and what changed]

### Implementation Notes
- [anything unusual or any decision that was not in the plan]

### Ready for Review
Ask Claude: "review"
```

Then stop. Do not begin Phase 3.
