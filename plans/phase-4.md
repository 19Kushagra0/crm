# Phase 4 Implementation Plan

## Objective
Fix dynamic values across the UI surfaces by connecting the global `Header.jsx` subtitles to the Zustand stores via the Service layer. Additionally, purge all remaining static timer strings in the UI and ensure order timers are genuinely computed from the canonical `createdAt` timestamps.

## Files to Modify

### 1. `src/services/CustomerService.js`
- **Required change:** Export a custom React hook for the customers list.
- **Must contain:** Add `useCustomers: () => useCustomersStore(state => state.customers),` to the `CustomerService` object.

### 2. `src/components/Header.jsx`
- **Current problem:** Subtitles for pages like `/orders`, `/tables`, and `/customers` use hardcoded strings (e.g., `"14 active orders"`, `"9 of 14 tables occupied"`).
- **Required change:**
  - Add `"use client";` to the top of the file since it will now consume React hooks.
  - Import `OrderService`, `TablesService`, and `CustomerService`.
  - Add hook calls: 
    - `const activeOrders = OrderService.useActiveOrders();`
    - `const tables = TablesService.useTables();`
    - `const customers = CustomerService.useCustomers();`
  - Update the `subtitle` generation block:
    - **`/service` & `/dashboard`**: Use today's dynamic date: `new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })`.
    - **`/orders`**: `${activeOrders.length} active orders`.
    - **`/customers`**: `${customers.length} guests`.
    - **`/tables`**: `${tables.filter(t => t.status === 'occupied').length} of ${tables.length} tables occupied`.
    - **`/kds`**: `Dinner Service · ${activeOrders.length} tickets open`.

### 3. `src/app/(crm)/service/page.jsx`
- **Current problem:** Uses fallback static strings for timers (e.g., `o.createdAt ? getMinutesAgo(o.createdAt) : '5m ago'`).
- **Required change:**
  - Remove all ternary fallbacks for the timer.
  - Simply use `{getMinutesAgo(o.createdAt)}`.

### 4. `src/app/(crm)/dashboard/page.jsx`
- **Current problem:** The "Live Orders" pipeline section uses hardcoded static order cards with hardcoded timer strings (`"12m"`, `"24m"`, `"2m"`).
- **Required change:**
  - Delete the hardcoded order cards inside the Incoming, Preparing, and Ready columns.
  - Add a `getMinutesAgo` helper function at the top (copy from `/orders/page.jsx`).
  - Map over `activeOrders.filter(o => o.status === 'incoming')` (and `preparing`, `ready`) to render the `styles.orderCard` items dynamically.
  - Display the true computed timer using `getMinutesAgo(o.createdAt)`.
  - Use `o.id`, `o.table`, and `o.items.map(i => i.name).join(', ')` for the card details to match the canonical model.

## Implementation Order
1. Update `src/services/CustomerService.js` to expose the `useCustomers` hook.
2. Update `src/components/Header.jsx` to be a client component and compute subtitles dynamically.
3. Update `src/app/(crm)/service/page.jsx` to remove fallback static timers.
4. Update `src/app/(crm)/dashboard/page.jsx` to map live orders in the pipeline section and compute their timers.

## Architecture Rules to Enforce
- **Rule 2 (Service Layer):** `Header.jsx` must call `OrderService.useActiveOrders()`, never `useOrdersStore` directly.
- **Rule 6 (No Hardcoded Business Data):** Remove the hardcoded dashboard orders and static timer strings. All data must originate from the stores.

## Verification Checklist
- [ ] `CustomerService` exports `useCustomers`.
- [ ] `Header.jsx` has `"use client";` and dynamic subtitles accurately reflect store data.
- [ ] `/service` page no longer uses `'5m ago'` or `'10m ago'` string fallbacks.
- [ ] `/dashboard` page renders the Live Orders pipeline dynamically based on `activeOrders`.
- [ ] `npm run build` runs successfully with zero errors.
