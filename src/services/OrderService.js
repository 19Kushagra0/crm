import { useOrdersStore } from "@/lib/stores/ordersStore";
const OrderService = {
  useActiveOrders: () => useOrdersStore((state) => state.activeOrders),

  useCompletedOrders: () => useOrdersStore((state) => state.completedOrders),

  getActiveOrders: () => useOrdersStore.getState().activeOrders,

  getCompletedOrders: () => useOrdersStore.getState().completedOrders,

  transitionOrder: (orderId, newStatus) => {
    useOrdersStore.getState().transitionOrder(orderId, newStatus);
  },

  serveAndClose: (order) => {
    useOrdersStore.getState().serveAndClose(order);
  },
};
export default OrderService;
