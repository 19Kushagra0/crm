import { create } from 'zustand';

const initialStaff = [
  {
    id: 1,
    name: "Elena Rostova",
    initials: "ER",
    role: "Head Waiter",
    category: "Waiter",
    onShift: true,
    orders: 14,
    tables: 4,
    rating: "4.8★",
    tenure: "Since March 2024",
    isWaiter: true,
  },
  {
    id: 2,
    name: "Marcus Kim",
    initials: "MK",
    role: "Sommelier",
    category: "Waiter",
    onShift: false,
    orders: 0,
    tables: 0,
    rating: "4.9★",
    tenure: "Since Jan 2023",
    isWaiter: true,
  },
  {
    id: 3,
    name: "Thomas Chen",
    initials: "TC",
    role: "Sous Chef",
    category: "Kitchen",
    onShift: true,
    orders: 42,
    tables: "12m",
    rating: "98%",
    tenure: "Since Aug 2022",
    isKitchen: true,
    customLabels: {
      ordersLabel: "Tickets",
      tablesLabel: "Prep Time",
      ratingLabel: "Quality"
    }
  }
];

export const useStaffStore = create((set) => ({
  staff: initialStaff,

  addStaff: (member) =>
    set((state) => ({
      staff: [member, ...state.staff]
    })),

  updateStaff: (id, updates) =>
    set((state) => ({
      staff: state.staff.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      )
    })),

  deleteStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id)
    })),

  toggleShiftStatus: (id) =>
    set((state) => ({
      staff: state.staff.map((s) =>
        s.id === id ? { ...s, onShift: !s.onShift } : s
      )
    }))
}));
