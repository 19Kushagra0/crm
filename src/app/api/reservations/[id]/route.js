import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  
  const reservation = mockDb.reservations.find(
    (r) => r.id === numericId || String(r.id) === id
  );
  
  if (!reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  }
  return NextResponse.json(reservation);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  
  try {
    const data = await request.json();
    const index = mockDb.reservations.findIndex(
      (r) => r.id === numericId || String(r.id) === id
    );
    
    if (index === -1) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }
    
    // Merge the updates into the reservation
    const updatedReservation = {
      ...mockDb.reservations[index],
      ...data
    };
    
    // Explicitly handle clearing tableId if it is sent as null
    if (data.tableId === null) {
      delete updatedReservation.tableId;
    }
    
    mockDb.reservations[index] = updatedReservation;
    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  
  try {
    const index = mockDb.reservations.findIndex(
      (r) => r.id === numericId || String(r.id) === id
    );
    
    if (index === -1) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }
    mockDb.reservations.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
