import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json({
    activeOrders: mockDb.activeOrders,
    completedOrders: mockDb.completedOrders,
    revenueTrend: mockDb.revenueTrend
  });
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    // Generate order ID like ORD-9015
    const existingIds = [...mockDb.activeOrders, ...mockDb.completedOrders]
      .map(o => parseInt(o.id.replace('ORD-', ''), 10))
      .filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 9000;
    const nextId = maxId + 1;
    const id = `ORD-${nextId}`;

    const newOrder = {
      id,
      status: "incoming",
      createdAt: new Date(),
      price: "$0.00",
      ...data
    };
    
    if (newOrder.createdAt) {
      newOrder.createdAt = new Date(newOrder.createdAt);
    }

    mockDb.activeOrders.unshift(newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
