import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const course = await db.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const existingParticipant = await db.courseParticipant.findUnique({
      where: {
        courseId_userId: {
          courseId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Already enrolled in the course' },
        { status: 400 }
      );
    }

    await db.courseParticipant.create({
      data: {
        courseId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}