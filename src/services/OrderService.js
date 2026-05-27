import { useOrdersStore } from "@/lib/stores/ordersStore";
const OrderService = {
  useActiveOrders: () => useOrdersStore((state) => state.activeOrders),

  useCompletedOrders: () => useOrdersStore((state) => state.completedOrders),

  getActiveOrders: () => useOrdersStore.getState().activeOrders,

  getCompletedOrders: () => useOrdersStore.getState().completedOrders,

  transitionOrder: (orderId, newStatus) => {
    useOrdersStore.getState().transitionOrder(orderId, newStatus);
  },

  addOrder: (order) => {
    useOrdersStore.getState().addOrder(order);
  },

  createWalkInOrder: (tableId, partySize) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: tableId,
      items: [{ name: `Walk-In (Party of ${partySize})` }],
      status: "incoming",
      createdAt: new Date(),
      price: "$0.00"
    };
    useOrdersStore.getState().addOrder(newOrder);
  },

  serveAndClose: (order) => {
    useOrdersStore.getState().serveAndClose(order);
  },
};
export default OrderService;
