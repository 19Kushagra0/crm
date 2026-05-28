import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  // Check seed authorization
  const secretHeader = request.headers.get('x-seed-secret');
  if (process.env.NODE_ENV === 'production' && secretHeader !== 'super-seed-secret-1234') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role, staffCardId } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'name, email, password, and role are required fields' }, { status: 400 });
    }

    // Check if user already exists
    const usersRef = db.collection('users');
    const existing = await usersRef.where('email', '==', email.toLowerCase().trim()).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = db.collection('users').doc();
    await docRef.set({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role, // 'manager' or 'staff'
      staffCardId: staffCardId || null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: `User ${name} seeded successfully as ${role}.`
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
