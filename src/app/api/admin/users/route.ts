import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, isActive: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN' || !adminUser.isActive) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    // Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isHostApproved: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}