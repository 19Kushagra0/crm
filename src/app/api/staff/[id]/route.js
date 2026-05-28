import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebaseAdmin';
import { mockDb } from '@/lib/mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const member = mockDb.staff.find((s) => s.id === numericId || String(s.id) === id);
  if (!member) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PATCH(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);

  // Enforce Authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUserRole = session.user.role; // 'owner' | 'manager' | 'staff'

  try {
    const data = await request.json();
    const index = mockDb.staff.findIndex((s) => s.id === numericId || String(s.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    const targetStaff = mockDb.staff[index];

    // Enforce RBAC
    if (currentUserRole === 'staff') {
      return NextResponse.json({ error: 'Forbidden: Staff cannot modify staff' }, { status: 403 });
    }

    if (targetStaff.category === 'Manager' && currentUserRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Only the Owner can modify managers' }, { status: 403 });
    }

    // Explicit toggleShiftStatus action or general update
    let updatedStaff;
    if (data.action === 'toggleShiftStatus') {
      updatedStaff = {
        ...mockDb.staff[index],
        onShift: !mockDb.staff[index].onShift
      };
    } else {
      updatedStaff = {
        ...mockDb.staff[index],
        ...data
      };
    }

    mockDb.staff[index] = updatedStaff;
    return NextResponse.json(updatedStaff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await delay(500);
  const { id } = await params;
  const numericId = parseInt(id, 10);

  // Enforce Authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUserRole = session.user.role; // 'owner' | 'manager' | 'staff'

  try {
    const index = mockDb.staff.findIndex((s) => s.id === numericId || String(s.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    const deletedStaff = mockDb.staff[index];

    // Enforce RBAC
    if (currentUserRole === 'staff') {
      return NextResponse.json({ error: 'Forbidden: Staff cannot delete staff' }, { status: 403 });
    }

    if (deletedStaff.category === 'Manager' && currentUserRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Only the Owner can delete managers' }, { status: 403 });
    }

    // Delete matching Firestore user doc if it exists
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.where('staffCardId', '==', numericId).get();
    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }
    }

    // Log to operations feed
    if (!mockDb.operationsFeed) {
      mockDb.operationsFeed = [];
    }
    const opId = `OP-${Date.now()}`;
    mockDb.operationsFeed.unshift({
      id: opId,
      type: 'delete',
      message: `Removed staff member: ${deletedStaff.name} (${deletedStaff.role})`,
      timestamp: new Date()
    });

    mockDb.staff.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
