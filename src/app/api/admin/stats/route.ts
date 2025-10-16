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

    // Get stats
    const [totalUsers, totalHosts, pendingHostRequests, totalHackathons] = await Promise.all([
      db.user.count({ where: { isActive: true } }),
      db.user.count({ where: { role: 'HOST', isHostApproved: true, isActive: true } }),
      db.user.count({ where: { role: 'HOST', isHostApproved: false, isActive: true } }),
      db.hackathon.count()
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        totalUsers,
        totalHosts,
        pendingHostRequests,
        totalHackathons
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}