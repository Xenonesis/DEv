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
      select: { id: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: 'User not found or inactive' }, { status: 404 });
    }

    const isAdmin = user.role === 'ADMIN';

    return NextResponse.json({ 
      success: true, 
      isAdmin,
      userId: user.id 
    });
  } catch (error) {
    console.error('Error checking admin access:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}