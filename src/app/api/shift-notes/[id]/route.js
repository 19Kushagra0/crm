import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(200);
  const { id } = await params;
  if (!mockDb.shiftNotes) {
    mockDb.shiftNotes = [];
  }
  const note = mockDb.shiftNotes.find(n => n.id === id || String(n.id) === String(id));
  if (!note) {
    return NextResponse.json({ error: 'Shift note not found' }, { status: 404 });
  }
  return NextResponse.json(note);
}

export async function DELETE(request, { params }) {
  await delay(200);
  const { id } = await params;
  if (!mockDb.shiftNotes) {
    mockDb.shiftNotes = [];
  }
  const index = mockDb.shiftNotes.findIndex(n => n.id === id || String(n.id) === String(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Shift note not found' }, { status: 404 });
  }
  const deleted = mockDb.shiftNotes.splice(index, 1)[0];
  return NextResponse.json(deleted);
}
