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

    // Get all events for this host
    const events = await db.event.findMany({
      where: { hostId: user.id },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    // Calculate stats
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) > now);
    const pastEvents = events.filter(event => new Date(event.date) <= now);
    const totalParticipants = events.reduce((sum, event) => sum + event._count.participants, 0);

    const stats = {
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
      totalParticipants
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
