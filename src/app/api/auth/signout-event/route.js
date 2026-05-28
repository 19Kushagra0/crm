import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { mockDb } from '@/lib/mockData';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user;
  if (user && user.staffCardId !== undefined && user.staffCardId !== null) {
    const staffCardId = parseInt(user.staffCardId, 10);
    const staffIndex = mockDb.staff.findIndex(s => s.id === staffCardId);
    if (staffIndex !== -1) {
      mockDb.staff[staffIndex].onShift = false;
    }

    // Log the clocked-off event to the Operations Feed
    if (!mockDb.operationsFeed) {
      mockDb.operationsFeed = [];
    }
    const opId = `OP-${Date.now()}`;
    mockDb.operationsFeed.unshift({
      id: opId,
      type: 'delete', // 'delete' type shows a red action in Operations Feed indicating clock out
      message: `${user.name} clocked off shift`,
      timestamp: new Date()
    });
  }

  return NextResponse.json({ success: true });
}
