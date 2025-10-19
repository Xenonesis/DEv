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
    const tutorials = await db.tutorial.findMany({
      where: {
        hostId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        createdAt: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching host tutorials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}