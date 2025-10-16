import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    // Validate role
    if (!role || (role !== 'USER' && role !== 'HOST')) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be USER or HOST' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Admins cannot switch to USER or HOST (they stay ADMIN)
    if (user.role === UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Admins cannot switch roles' },
        { status: 403 }
      );
    }

    // Update user role
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        role: role as UserRole,
        // Auto-approve as host when switching to HOST role
        isHostApproved: role === 'HOST' ? true : user.isHostApproved
      }
    });

    return NextResponse.json({
      success: true,
      message: `Role switched to ${role} successfully`,
      data: {
        role: updatedUser.role,
        isHostApproved: updatedUser.isHostApproved
      }
    });
  } catch (error) {
    console.error('Error switching role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to switch role' },
      { status: 500 }
    );
  }
}
