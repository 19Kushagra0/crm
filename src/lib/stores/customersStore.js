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
