import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  await delay(300);
  try {
    const data = await request.json();
    if (!data.name || !data.pointCost) {
      return NextResponse.json({ error: 'Name and Point Cost are required' }, { status: 400 });
    }

    const nextId = `RWD-${(Math.max(...mockDb.rewards.map(r => parseInt(r.id.split('-')[1]) || 0)) + 1).toString().padStart(3, '0')}`;
    
    const newReward = {
      id: nextId,
      name: data.name,
      pointCost: parseInt(data.pointCost),
      description: data.description || ''
    };

    mockDb.rewards.push(newReward);

    // Also log to operations feed
    if (!mockDb.operationsFeed) mockDb.operationsFeed = [];
    mockDb.operationsFeed.unshift({
      id: `OP-${Date.now()}`,
      type: 'add',
      message: `Created new loyalty reward: ${newReward.name} (${newReward.pointCost} pts)`,
      timestamp: new Date()
    });

    return NextResponse.json(newReward, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
