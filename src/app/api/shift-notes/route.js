import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(300);
  return NextResponse.json(mockDb.shiftNotes || []);
}

export async function POST(request) {
  await delay(300);
  try {
    const data = await request.json();
    if (!data.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const newNote = {
      id: `NOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date(),
      content: data.content,
      author: data.author || 'Manager'
    };

    if (!mockDb.shiftNotes) {
      mockDb.shiftNotes = [];
    }
    mockDb.shiftNotes.unshift(newNote);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
