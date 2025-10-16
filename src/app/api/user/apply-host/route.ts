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

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: 'User not found or inactive' }, { status: 404 });
    }

    if (user.role === 'HOST') {
      if (user.isHostApproved) {
        return NextResponse.json({ success: false, error: 'You are already an approved host' }, { status: 400 });
      } else {
        return NextResponse.json({ success: false, error: 'Your host application is already pending approval' }, { status: 400 });
      }
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admins cannot apply for host access' }, { status: 400 });
    }

    // Update user role to HOST (pending approval)
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        role: 'HOST',
        isHostApproved: false
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Host application submitted successfully. Please wait for admin approval.',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error applying for host access:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}