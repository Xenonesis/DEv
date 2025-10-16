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

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: 'User not found or inactive' }, { status: 404 });
    }

    // Check if user is host and approved
    const isHost = user.role === 'HOST' && user.isHostApproved;
    const needsApproval = user.role === 'HOST' && !user.isHostApproved;

    return NextResponse.json({ 
      success: true, 
      isHost,
      needsApproval,
      userId: user.id 
    });
  } catch (error) {
    console.error('Error checking host access:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}