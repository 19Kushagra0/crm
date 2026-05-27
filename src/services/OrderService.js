import { useOrdersStore } from "@/lib/stores/ordersStore";
import CustomerService from "@/services/CustomerService";

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

  createWalkInOrder: (tableId, partySize, customerId) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: tableId,
      items: [{ name: `Walk-In (Party of ${partySize})` }],
      status: "incoming",
      createdAt: new Date(),
      price: "$0.00",
      customerId: customerId || undefined
    };
    useOrdersStore.getState().addOrder(newOrder);
  },

  serveAndClose: (order) => {
    useOrdersStore.getState().serveAndClose(order);
    
    if (order.customerId) {
      const priceStr = order.price || "$0.00";
      const numericPrice = parseFloat(priceStr.replace(/[^\d.-]/g, '')) || 0;
      
      const customers = CustomerService.getCustomers();
      const customer = customers.find(c => c.id === order.customerId);
      if (customer) {
        const newSpend = (customer.totalSpend || 0) + numericPrice;
        CustomerService.updateCustomer(customer.id, { totalSpend: newSpend });
        CustomerService.recordVisit(customer.id);
      }
    }
  },

  getTableBill: (tableId) => {
    return useOrdersStore.getState().getTableBill(tableId);
  }
};
export default OrderService;
