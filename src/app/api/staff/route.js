import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebaseAdmin';
import { mockDb } from '@/lib/mockData';
import bcrypt from 'bcryptjs';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);
  return NextResponse.json(mockDb.staff);
}

export async function POST(request) {
  await delay(500);
  
  // 1. Enforce Authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const currentUserRole = session.user.role; // 'owner' | 'manager' | 'staff'
  
  try {
    const data = await request.json();

    if (!data.name || !data.role || !data.email || !data.password) {
      return NextResponse.json({ error: 'Name, Role, Email, and Password are required fields' }, { status: 400 });
    }

    const category = data.category || 'Waiter';

    // 2. Enforce Tiered RBAC
    if (currentUserRole === 'staff') {
      return NextResponse.json({ error: 'Forbidden: Staff members are read-only' }, { status: 403 });
    }

    if (category === 'Manager' && currentUserRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Only the Owner can create managers' }, { status: 403 });
    }

    // 3. Create Staff Card in mockDb
    const nextId = Math.max(0, ...mockDb.staff.map((s) => s.id)) + 1;
    const initials = data.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'S';

    const newStaff = {
      id: nextId,
      name: data.name,
      initials,
      role: data.role,
      category: category,
      onShift: false, // Start as off shift until they log in!
      orders: 0,
      tables: 0,
      rating: "5.0★",
      tenure: data.tenure || "Joined recently",
      isWaiter: category === 'Waiter',
      isKitchen: category === 'Kitchen',
    };

    // 4. Create Firestore User Doc
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usersCollection = db.collection('users');
    
    // Check email uniqueness in Firestore
    const existing = await usersCollection.where('email', '==', data.email.toLowerCase().trim()).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'A user account with this email already exists' }, { status: 400 });
    }

    const userDocRef = usersCollection.doc();
    await userDocRef.set({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      role: category === 'Manager' ? 'manager' : 'staff',
      staffCardId: nextId,
      createdAt: new Date(),
    });

    // Save to mockDb
    mockDb.staff.unshift(newStaff);

    // 5. Log to operations feed
    if (!mockDb.operationsFeed) {
      mockDb.operationsFeed = [];
    }
    const opId = `OP-${Date.now()}`;
    mockDb.operationsFeed.unshift({
      id: opId,
      type: 'add',
      message: `Added new staff member: ${newStaff.name} (${newStaff.role})`,
      timestamp: new Date()
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
