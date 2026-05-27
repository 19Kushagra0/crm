import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.staff);
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    if (!data.name || !data.role) {
      return NextResponse.json({ error: 'Name and role are required fields' }, { status: 400 });
    }

    const nextId = Math.max(0, ...mockDb.staff.map((s) => s.id)) + 1;
    const initials = data.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'S';

    const newStaff = {
      id: nextId,
      name: data.name,
      initials,
      role: data.role,
      category: data.category || 'Waiter',
      onShift: data.onShift !== undefined ? data.onShift : true,
      orders: 0,
      tables: 0,
      rating: "5.0★",
      tenure: data.tenure || "Joined recently",
      isWaiter: data.isWaiter !== undefined ? data.isWaiter : true,
      isKitchen: data.isKitchen !== undefined ? data.isKitchen : false,
      ...data
    };
    
    mockDb.staff.unshift(newStaff);
    
    // Log to operations feed
    if (!mockDb.operationsFeed) {
      mockDb.operationsFeed = [];
    }
    const opId = `OP-${Date.now()}`;
    mockDb.operationsFeed.unshift({
      id: opId,
      type: 'add',
      message: `Added new staff member: ${newStaff.name} (${newStaff.role})`,
      timestamp: new Date()
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
