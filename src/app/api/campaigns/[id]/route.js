import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const campaign = mockDb.campaigns.find((c) => c.id === numericId || String(c.id) === id);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }
  return NextResponse.json(campaign);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  try {
    const data = await request.json();
    const index = mockDb.campaigns.findIndex((c) => c.id === numericId || String(c.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    const updatedCampaign = {
      ...mockDb.campaigns[index],
      ...data
    };
    
    mockDb.campaigns[index] = updatedCampaign;
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  try {
    const index = mockDb.campaigns.findIndex((c) => c.id === numericId || String(c.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    mockDb.campaigns.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
