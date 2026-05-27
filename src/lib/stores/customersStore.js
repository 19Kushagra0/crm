import { create } from 'zustand';

// Business data migrated to API routes and TanStack Query.
// Kept for type/export compatibility.
export const useCustomersStore = create(() => ({
  customers: []
}));
