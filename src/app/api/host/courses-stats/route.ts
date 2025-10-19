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

    // Get all courses for this host
    const courses = await db.course.findMany({
      where: { hostId: user.id },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    // Calculate stats
    const totalParticipants = courses.reduce((sum, course) => sum + course._count.participants, 0);

    const stats = {
      totalCourses: courses.length,
      totalParticipants
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}