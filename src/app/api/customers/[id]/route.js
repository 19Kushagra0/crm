import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const customer = mockDb.customers.find((c) => c.id === id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const data = await request.json();
    const index = mockDb.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (data.lastVisit) {
      data.lastVisit = new Date(data.lastVisit);
    }

    const updatedCustomer = {
      ...mockDb.customers[index],
      ...data
    };
    mockDb.customers[index] = updatedCustomer;
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  const index = mockDb.customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  mockDb.customers.splice(index, 1);
  return NextResponse.json({ success: true });
}
