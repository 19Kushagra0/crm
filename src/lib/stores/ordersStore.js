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
