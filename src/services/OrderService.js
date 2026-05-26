import { useOrdersStore } from "@/lib/stores/ordersStore";
const OrderService = {

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
