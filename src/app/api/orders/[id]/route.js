import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const order = [...mockDb.activeOrders, ...mockDb.completedOrders].find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const data = await request.json();
    
    // Handle serve and close action
    if (data.action === 'serveAndClose') {
      const index = mockDb.activeOrders.findIndex((o) => o.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Active order not found' }, { status: 404 });
      }
      
      const order = mockDb.activeOrders[index];
      mockDb.activeOrders.splice(index, 1);
      
      const completedOrder = {
        id: order.id,
        table: order.table,
        price: order.price,
        customerId: order.customerId
      };
      
      mockDb.completedOrders.unshift(completedOrder);
      
      // Update customer stats directly in mock db
      if (order.customerId) {
        const priceStr = order.price || "$0.00";
        const numericPrice = parseFloat(priceStr.replace(/[^\d.-]/g, '')) || 0;
        
        const customer = mockDb.customers.find(c => c.id === order.customerId);
        if (customer) {
          customer.totalSpend = (customer.totalSpend || 0) + numericPrice;
          customer.visits = (customer.visits || 0) + 1;
          customer.lastVisit = new Date();
        }
      }
      
      return NextResponse.json(completedOrder);
    }
    
    // Regular update (like status transition)
    const activeIndex = mockDb.activeOrders.findIndex((o) => o.id === id);
    if (activeIndex !== -1) {
      if (data.createdAt) {
        data.createdAt = new Date(data.createdAt);
      }
      const updatedOrder = {
        ...mockDb.activeOrders[activeIndex],
        ...data
      };
      mockDb.activeOrders[activeIndex] = updatedOrder;
      return NextResponse.json(updatedOrder);
    }
    
    const completedIndex = mockDb.completedOrders.findIndex((o) => o.id === id);
    if (completedIndex !== -1) {
      const updatedOrder = {
        ...mockDb.completedOrders[completedIndex],
        ...data
      };
      mockDb.completedOrders[completedIndex] = updatedOrder;
      return NextResponse.json(updatedOrder);
    }
    
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
