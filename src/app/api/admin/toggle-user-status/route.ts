import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    const { userId, isActive } = await request.json();

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json({ success: false, error: 'User ID and status are required' }, { status: 400 });
    }

    // Update user status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isActive }
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}