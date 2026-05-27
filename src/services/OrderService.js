import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

const OrderService = {
  // Synchronous getters from Query Cache
  getActiveOrders: () => {
    const data = queryClient.getQueryData(['orders']);
    return data?.activeOrders || [];
  },

  getCompletedOrders: () => {
    const data = queryClient.getQueryData(['orders']);
    return data?.completedOrders || [];
  },

  getRevenueTrend: () => {
    const data = queryClient.getQueryData(['orders']);
    return data?.revenueTrend || [];
  },

  // Query Hooks
  useActiveOrders: () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      },
      select: (data) => data.activeOrders || []
    });
  },

  useCompletedOrders: () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      },
      select: (data) => data.completedOrders || []
    });
  },

  useRevenueTrend: () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      },
      select: (data) => data.revenueTrend || []
    });
  },

  // Actions (can be called inside or outside React)
  transitionOrder: async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Failed to transition order');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    return data;
  },

  addOrder: async (order) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to add order');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    return data;
  },

  createWalkInOrder: async (tableId, partySize, customerId) => {
    const newOrder = {
      table: tableId,
      items: [{ name: `Walk-In (Party of ${partySize})` }],
      status: "incoming",
      createdAt: new Date(),
      price: "$0.00",
      customerId: customerId || undefined
    };
    return OrderService.addOrder(newOrder);
  },

  serveAndClose: async (order) => {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'serveAndClose' })
    });
    if (!res.ok) throw new Error('Failed to serve and close order');
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    return data;
  },

  getTableBill: (tableId) => {
    const active = OrderService.getActiveOrders().filter((o) => o.table === tableId);
    const completed = OrderService.getCompletedOrders().filter((o) => o.table === tableId);
    const allOrders = [...active, ...completed];
    const total = allOrders.reduce((sum, order) => {
      if (!order.price) return sum;
      const numericPrice = parseFloat(order.price.replace(/[^\d.-]/g, '')) || 0;
      return sum + numericPrice;
    }, 0);
    return `₹${total.toFixed(2)}`;
  }
};

export default OrderService;
