import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial || tutorial.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.tutorial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, imageUrl, videoUrl, tags, difficulty } = await req.json();
    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial || tutorial.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedTutorial = await db.tutorial.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        tags,
        difficulty,
      },
    });

    return NextResponse.json(updatedTutorial);
  } catch (error) {
    console.error('Error updating tutorial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}