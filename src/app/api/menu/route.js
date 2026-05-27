import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.menuItems);
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    if (!data.name || !data.category || data.price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required fields' }, { status: 400 });
    }

    const nextIdNum = Math.max(0, ...mockDb.menuItems.map(item => {
      const parts = item.id.split('-');
      return parseInt(parts[1], 10) || 0;
    })) + 1;
    
    const newId = `MENU-${nextIdNum.toString().padStart(3, '0')}`;
    
    const newMenuItem = {
      id: newId,
      name: data.name,
      category: data.category,
      description: data.description || '',
      allergens: Array.isArray(data.allergens) ? data.allergens : [],
      price: parseFloat(data.price) || 0,
      isActive: data.isActive !== undefined ? data.isActive : true
    };
    
    mockDb.menuItems.unshift(newMenuItem);
    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
