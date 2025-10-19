import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(mentorships);
  } catch (error) {
    console.error('Error fetching host mentorships:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}