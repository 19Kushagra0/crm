import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(300);
  return NextResponse.json({
    rewards: mockDb.rewards || [],
    redemptionLog: mockDb.redemptionLog || []
  });
}
