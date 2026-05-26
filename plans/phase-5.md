# Phase 5 Implementation Plan

## Objective
Fill the remaining functional gaps by completing the `/tables` floor map and `/loyalty` pages with real dynamic data. Finally, introduce loading states and error boundaries to ensure smooth user experiences.

## Files to Modify

### 1. `src/app/(crm)/tables/page.jsx`
- **Required changes:**
  - Add `"use client";` to convert it to a client component.
  - Import `TablesService` from `@/services/TablesService`.
  - Fetch tables using `const tables = TablesService.useTables();`.
  - Replace the hardcoded DOM elements for tables (`T-1`, `T-2`, etc.) with mapped loops over the `tables` array filtered by `zone` (`WINDOW`, `CENTER`, `BAR`, `PRIVATE`).
  - Render the correct CSS module classes (e.g., `styles.tableCardRectAvailable`, `styles.tableCardRoundOccupied`) dynamically based on the table's `status` and `zone`.
  - Add an `onClick` handler to cycle the table's status using `TablesService.setTableStatus()`.

### 2. `src/app/(crm)/loyalty/page.jsx`
- **Required changes:**
  - Add `"use client";` to convert it to a client component.
  - Import `CustomerService` from `@/services/CustomerService`.
  - Fetch customers using `const customers = CustomerService.useCustomers();`.
  - Compute the total points issued, points redeemed, and other metrics based on `customers` data (e.g., deriving stats from `totalSpend` and `tier`).
  - Calculate counts for each `tier` (`Standard`, `VIP`, `Platinum`) and replace the hardcoded tier counts in the Tier Overview section. (Map Bronze -> Standard, Silver -> VIP, Gold -> Platinum).

### 3. `src/app/(crm)/loading.jsx` (New File)
- **Required changes:**
  - Create a new file for the loading boundary.
  - Implement a simple and elegant loading spinner or skeleton using Next.js conventions to show while routes transition.

### 4. `src/app/(crm)/error.jsx` (New File)
- **Required changes:**
  - Create a new file for the error boundary.
  - Must include `"use client";` at the top.
  - Render an error message and a retry button using `reset()` provided by Next.js.

## Implementation Order
1. Update `/tables/page.jsx` to render the dynamic floor map.
2. Update `/loyalty/page.jsx` to reflect real customer tier metrics.
3. Create `loading.jsx` and `error.jsx` in the `src/app/(crm)` directory.

## Architecture Rules to Enforce
- **Rule 1 & 2 (State Ownership & Service Layer):** Pages will strictly consume `TablesService` and `CustomerService`, not the Zustand stores directly.
- **Rule 4 (CSS Modules Only):** No inline Tailwind utility classes.
- **Rule 6 (No Hardcoded Business Data):** Ensure all table definitions and customer tiers flow purely from state.

## Verification Checklist
- [ ] `/tables` accurately maps the interactive floor map based on the `tablesStore`.
- [ ] `/loyalty` computes and displays accurate metrics and tier counts derived from the `customersStore`.
- [ ] `loading.jsx` exists and functions during route transitions.
- [ ] `error.jsx` exists and handles render failures gracefully.
- [ ] `npm run build` succeeds without any errors.
