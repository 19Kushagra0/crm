import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.campaigns);
}

export async function POST(request) {
  await delay(500);
  try {
    const data = await request.json();
    
    if (!data.title || !data.type) {
      return NextResponse.json({ error: 'Title and type are required fields' }, { status: 400 });
    }

    const nextId = Math.max(0, ...mockDb.campaigns.map((c) => c.id)) + 1;
    
    const newCampaign = {
      id: nextId,
      title: data.title,
      status: data.status || 'scheduled',
      type: data.type,
      segment: data.segment || 'All Guests',
      segmentMeta: data.segmentMeta || `${data.segment || 'All Guests'} · 100 customers`,
      sent: 0,
      opened: 0,
      openedPct: "0%",
      redeemed: 0,
      redeemedPct: "0%",
      preview: data.preview || '',
      footerText: data.footerText || 'Created today',
      actionLabel: data.status === 'active' || data.status === 'completed' ? 'View Report' : 'Edit Campaign',
      isEmail: data.type.toLowerCase() === 'email',
      ...data
    };
    
    mockDb.campaigns.unshift(newCampaign);
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
