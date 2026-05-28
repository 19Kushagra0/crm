import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  await delay(300);
  try {
    const data = await request.json();
    if (!data.customerId || !data.customerName) {
      return NextResponse.json({ error: 'customerId and customerName are required' }, { status: 400 });
    }

    // Find the customer and verify
    const customer = mockDb.customers.find(c => c.id === data.customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Log to operations feed
    if (!mockDb.operationsFeed) mockDb.operationsFeed = [];
    mockDb.operationsFeed.unshift({
      id: `OP-${Date.now()}`,
      type: 'info',
      message: `Sent automated re-engagement campaign to at-risk guest: ${data.customerName}`,
      timestamp: new Date()
    });

    return NextResponse.json({ message: 'Re-engagement message logged successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
