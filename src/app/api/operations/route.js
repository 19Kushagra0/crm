import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(200);
  const sortedFeed = [...(mockDb.operationsFeed || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  return NextResponse.json(sortedFeed);
}
