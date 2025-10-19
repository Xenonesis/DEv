import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
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
    });

    if (!tutorial || tutorial.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Tutorial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tutorial });
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial || tutorial.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.tutorial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial || tutorial.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updatedTutorial = await db.tutorial.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        tags: JSON.stringify(tags),
        difficulty,
      },
    });

    return NextResponse.json({ success: true, data: updatedTutorial });
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}