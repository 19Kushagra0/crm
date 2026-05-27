import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.customers);
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    // Generate new ID based on the max numeric ID existing in the list to avoid duplicate keys
    const existingIds = mockDb.customers
      .map(c => parseInt(c.id.replace('CUST-', ''), 10))
      .filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const nextId = maxId + 1;
    const id = `CUST-${nextId.toString().padStart(3, '0')}`;

    const newCustomer = {
      id,
      visits: 0,
      totalSpend: 0,
      lastVisit: new Date(),
      ...data
    };
    mockDb.customers.unshift(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
