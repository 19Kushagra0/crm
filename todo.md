# DineFlow CRM - UI/UX & Functional Backlog (Pre-Backend)

This document tracks functional gaps and UI issues that need to be resolved before moving to backend integration (DB/API/TanStack).

## 1. Global / Header
- [x] **Omni-Create Dropdown:** Replaced the global "New Order" header button with a scalable, context-aware "Omni-Create" dropdown menu.
- [x] **Notifications:** The notification bell is hidden to clean up the UI.

## 2. Menu Page (`/menu`)
- [ ] **Add Menu Item:** Missing a button/UI to add a new menu item to the catalog.

## 3. Tables & Reservations (`/tables` & `/service`)
- [ ] **Sorting:** The sorting button in reservations/tables is currently non-functional. Wire it up to actually sort the list.
- [x] **New Reservation:** The "New Reservation" button does nothing. Resolved by building context-aware modal forms wired to the reservations Zustand store.

## 4. Kitchen Display System (`/kds`)
- [x] **Contextual Actions:** Removed out-of-context "Create Reward", "New Service", and "Shift Report" buttons from the kitchen display.

## 5. Customers Page (`/customers`)
- [ ] **Avatars:** User profile pictures are present but there is no way to upload them. Solution: Automatically fetch avatars using Gravatar (via email hash) or remove the avatar UI completely.
- [ ] **Pagination:** Add functional pagination to the customers list to handle large datasets.

## 6. Loyalty Page (`/loyalty`)
- [x] **Page Title Bug:** Fixed title checker in Header.jsx to correctly show "Loyalty & Rewards" (instead of Dashboard).
- [x] **Contextual Actions:** Cleaned up the Loyalty view by removing out-of-context "New Service" and "Shift Report" buttons, keeping "Create Reward".
