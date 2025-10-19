import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is a host
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'HOST') {
      return NextResponse.json({ success: false, error: 'Host privileges required' }, { status: 403 });
    }

    // Get mentorship statistics
    const [totalRequests, activeMentorships, completedMentorships, totalSessions] = await Promise.all([
      db.mentorship.count({
        where: { mentorId: session.user.id }
      }),
      db.mentorship.count({
        where: {
          mentorId: session.user.id,
          status: 'ACTIVE'
        }
      }),
      db.mentorship.count({
        where: {
          mentorId: session.user.id,
          status: 'COMPLETED'
        }
      }),
      db.mentorshipSession.count({
        where: {
          userId: session.user.id
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRequests,
        activeMentorships,
        completedMentorships,
        totalSessions
      }
    });
  } catch (error) {
    console.error('Error fetching mentorship stats:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}