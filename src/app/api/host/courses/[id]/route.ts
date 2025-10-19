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
    const course = await db.course.findUnique({
      where: { id: params.id },
    });

    if (!course || course.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
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
    const { title, description, imageUrl, tags, difficulty } = await req.json();
    const course = await db.course.findUnique({
      where: { id: params.id },
    });

    if (!course || course.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedCourse = await db.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        imageUrl,
        tags,
        difficulty,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}