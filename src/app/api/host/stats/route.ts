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

    // Check if user is approved host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Get stats for this host (for now, we'll get all hackathons)
    // In a real implementation, you'd filter by hostId
    const [totalHackathons, activeHackathons, completedHackathons, totalParticipants] = await Promise.all([
      db.hackathon.count(),
      db.hackathon.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
      db.hackathon.count({ where: { status: 'COMPLETED' } }),
      db.hackathonParticipant.count()
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        totalHackathons,
        activeHackathons,
        completedHackathons,
        totalParticipants
      }
    });
  } catch (error) {
    console.error('Error fetching host stats:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}