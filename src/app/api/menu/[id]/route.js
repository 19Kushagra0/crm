import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const item = mockDb.menuItems.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const data = await request.json();
    const index = mockDb.menuItems.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    const updatedItem = {
      ...mockDb.menuItems[index],
      ...data
    };
    
    mockDb.menuItems[index] = updatedItem;
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  try {
    const index = mockDb.menuItems.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    mockDb.menuItems.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
