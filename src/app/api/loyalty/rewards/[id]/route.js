import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function DELETE(request, { params }) {
  await delay(300);
  try {
    const { id } = await params;
    const rewardIndex = mockDb.rewards.findIndex(r => r.id === id);
    if (rewardIndex === -1) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    const removedReward = mockDb.rewards.splice(rewardIndex, 1)[0];

    // Log to operations feed
    if (!mockDb.operationsFeed) mockDb.operationsFeed = [];
    mockDb.operationsFeed.unshift({
      id: `OP-${Date.now()}`,
      type: 'delete',
      message: `Deleted loyalty reward: ${removedReward.name}`,
      timestamp: new Date()
    });

    return NextResponse.json({ message: 'Reward deleted successfully', reward: removedReward });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
