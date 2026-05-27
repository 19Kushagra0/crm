import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.reservations);
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    if (!data.guest || !data.time) {
      return NextResponse.json({ error: 'Guest and time are required fields' }, { status: 400 });
    }

    const nextId = Math.max(0, ...mockDb.reservations.map((r) => r.id)) + 1;
    
    const newReservation = {
      id: nextId,
      guest: data.guest,
      details: data.details || 'Party of 2',
      time: data.time,
      status: data.status || 'PENDING',
      tableId: data.tableId || null
    };
    
    mockDb.reservations.push(newReservation);
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
