import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    const mentorships = await db.mentorship.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        mentee: {
          select: {
            name: true,
            image: true,
          },
        },
        sessions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ success: true, data: mentorships });
  } catch (error) {
    console.error('Error fetching host mentorships:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}