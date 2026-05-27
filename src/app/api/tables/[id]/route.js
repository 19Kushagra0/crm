import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const table = mockDb.tables.find((t) => t.id === id);
  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }
  return NextResponse.json(table);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const data = await request.json();
    const index = mockDb.tables.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    
    // Merge the updates into the table
    const updatedTable = {
      ...mockDb.tables[index],
      ...data
    };
    
    // Explicitly handle clearing fields if they are sent as null (like currentCustomerId or reservedAt)
    if (data.currentCustomerId === null) {
      delete updatedTable.currentCustomerId;
    }
    if (data.reservedAt === null) {
      delete updatedTable.reservedAt;
    }
    
    mockDb.tables[index] = updatedTable;
    return NextResponse.json(updatedTable);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const index = mockDb.tables.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    mockDb.tables.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
