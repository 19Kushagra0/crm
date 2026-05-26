# Phase 3 Implementation Plan

## Objective
Connect the Orders, Service, KDS, and Dashboard pages to the Zustand stores via the Service Layer so that business data is reactive and centralized, removing local mock arrays for these domains.

## Files to Modify

### 1. `src/services/OrderService.js`
- **Current problem:** Only exposes standard getter functions, which don't trigger React re-renders when the Zustand store updates.
- **Required change:** Export custom React hooks that map to the store's state. 
- **Must contain:** Add `useActiveOrders: () => useOrdersStore(state => state.activeOrders),` and `useCompletedOrders: () => useOrdersStore(state => state.completedOrders),` to the `OrderService` object.

### 2. `src/services/TablesService.js`
- **Current problem:** Needs a reactive hook for the Dashboard KPI.
- **Required change:** Add `useTables: () => useTablesStore(state => state.tables),` to the `TablesService` object.

### 3. `src/app/(crm)/orders/page.jsx`
- **Current problem:** Uses `useState` with inline `initialActiveOrders` and `initialCompletedOrders`.
- **Required change:** 
  - Delete `initialActiveOrders` and `initialCompletedOrders` arrays.
  - Delete `useState` for active and completed orders.
  - Call `const activeOrders = OrderService.useActiveOrders();` and `const completedOrders = OrderService.useCompletedOrders();`.
  - Replace `transitionOrder` and `serveAndCloseOrder` local functions to directly call `OrderService.transitionOrder` and `OrderService.serveAndClose`.
- **Constraint:** Do not touch the UI/JSX classes. Simply connect the existing UI to the reactive store data.

### 4. `src/app/(crm)/service/page.jsx`
- **Current problem:** Uses local `initialOrders` array that has a different shape than the canonical `Order` model.
- **Required change:**
  - Import `OrderService`.
  - Replace `orders` state with `const orders = OrderService.useActiveOrders();`.
  - Leave `reservations` local state alone (it is not part of this phase).
  - Update the `cycleOrderStatus` function to use `OrderService.transitionOrder(orderId, nextStatus)`. (Map 'incoming' -> 'preparing', 'preparing' -> 'ready', 'ready' -> serve/close).
  - **JSX Updates:** Since the canonical Order uses `id`, `table`, `items` instead of `title`/`subtitle`, update the map rendering in the JSX:
    - Replace `{o.title}` with `{o.items[0]?.name}`
    - Replace `{o.id}` in the badge with `{o.table}` (the canonical order table)
    - Replace `{o.time}` with a placeholder string `"5m ago"` (we will fix timers properly in Phase 4).

### 5. `src/app/(crm)/kds/page.jsx`
- **Current problem:** Uses a custom `initialTickets` array with properties like `isUrgent`, `duration`, `num`, and items with a `station`.
- **Required change:**
  - Import `OrderService`.
  - Replace `tickets` state with `const tickets = OrderService.useActiveOrders();`.
  - Update `handleStartTicket` to call `OrderService.transitionOrder(ticketId, 'preparing')`.
  - Update `handleBumpTicket` to call `OrderService.transitionOrder(ticketId, 'ready')`.
  - **JSX Updates:** The KDS needs to map canonical Orders into the UI:
    - Replace `t.num` with `t.id.replace('ORD-', '')`
    - Use `t.table` for the table badge.
    - Since canonical items don't have `qty` and `station` separated out, map over `t.items` and use `item.name` for both name and quantity. Hardcode the station tag to `"KITCHEN"` to prevent breaking the UI.

### 6. `src/app/(crm)/dashboard/page.jsx`
- **Current problem:** Server component with hardcoded KPI numbers.
- **Required change:**
  - Add `"use client";` to the top of the file.
  - Import `OrderService` and `TablesService`.
  - Add hooks: `const activeOrders = OrderService.useActiveOrders();` and `const tables = TablesService.useTables();`.
  - Compute active orders count: `{activeOrders.length}`
  - Compute occupied tables: `{tables.filter(t => t.status === 'occupied').length} / {tables.length}`
  - Compute the percentage for the progress bar dynamically: `${(occupied / total) * 100}%`

## Implementation Order
1. Update `src/services/OrderService.js` and `src/services/TablesService.js` to expose hooks.
2. Update `src/app/(crm)/orders/page.jsx`.
3. Update `src/app/(crm)/service/page.jsx`.
4. Update `src/app/(crm)/kds/page.jsx`.
5. Update `src/app/(crm)/dashboard/page.jsx`.

## Architecture Rules to Enforce
- **Rule 1 (State Ownership):** Pages NEVER own business data. All arrays are removed from page files.
- **Rule 2 (Service Layer):** Use `OrderService.useActiveOrders()` instead of importing Zustand stores directly in pages.
- **Rule 6 (No Hardcoded Business Data):** Ensure `initialOrders`, `initialTickets`, and `initialActiveOrders` are completely deleted from their respective page files.

## Verification Checklist
- [ ] `OrderService` and `TablesService` export `useActiveOrders`, `useCompletedOrders`, and `useTables` hooks.
- [ ] `/orders` page no longer contains `initialActiveOrders` or `initialCompletedOrders`.
- [ ] `/service` page maps over `OrderService.useActiveOrders()` and displays `o.items[0].name` instead of `o.title`.
- [ ] `/kds` page renders canonical orders and maps `t.id` instead of `t.num`.
- [ ] `/dashboard` has `"use client";` and calculates live KPI values for Active Orders and Tables Occupied.
- [ ] `npm run build` runs successfully with zero errors.
