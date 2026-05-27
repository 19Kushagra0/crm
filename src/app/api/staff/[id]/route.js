import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const member = mockDb.staff.find((s) => s.id === numericId || String(s.id) === id);
  if (!member) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  try {
    const data = await request.json();
    const index = mockDb.staff.findIndex((s) => s.id === numericId || String(s.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    
    // Explicit toggleShiftStatus action or general update
    let updatedStaff;
    if (data.action === 'toggleShiftStatus') {
      updatedStaff = {
        ...mockDb.staff[index],
        onShift: !mockDb.staff[index].onShift
      };
    } else {
      updatedStaff = {
        ...mockDb.staff[index],
        ...data
      };
    }
    
    mockDb.staff[index] = updatedStaff;
    return NextResponse.json(updatedStaff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  try {
    const index = mockDb.staff.findIndex((s) => s.id === numericId || String(s.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    const deletedStaff = mockDb.staff[index];

    // Log to operations feed
    if (!mockDb.operationsFeed) {
      mockDb.operationsFeed = [];
    }
    const opId = `OP-${Date.now()}`;
    mockDb.operationsFeed.unshift({
      id: opId,
      type: 'delete',
      message: `Removed staff member: ${deletedStaff.name} (${deletedStaff.role})`,
      timestamp: new Date()
    });

    mockDb.staff.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
