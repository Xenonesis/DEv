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
    const resources = await db.resource.findMany({
      where: {
        hostId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching host resources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}