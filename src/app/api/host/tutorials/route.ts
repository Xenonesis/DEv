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

    const tutorials = await db.tutorial.findMany({
      where: {
        hostId: session.user.id,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: {
            startedAt: 'desc'
          }
        },
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
    return NextResponse.json({ success: true, data: tutorials });
  } catch (error) {
    console.error('Error fetching host tutorials:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const { title, description, imageUrl, videoUrl, tags, difficulty } = await req.json();
    const tutorial = await db.tutorial.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        tags: JSON.stringify(tags),
        difficulty,
        hostId: session.user.id,
      },
    });
    return NextResponse.json({ success: true, data: tutorial }, { status: 201 });
  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}