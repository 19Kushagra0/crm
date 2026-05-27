import { create } from "zustand";

// Business data migrated to API routes and TanStack Query.
// Kept for compatibility.
export const useStaffStore = create(() => ({
  staff: [],
}));
