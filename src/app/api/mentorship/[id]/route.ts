import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const mentorship = await db.mentorship.findUnique({
      where: { id: params.id },
    });

    if (!mentorship) {
      return NextResponse.json({ error: 'Mentorship not found' }, { status: 404 });
    }

    if (session.user.id !== mentorship.mentorId && session.user.id !== mentorship.menteeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedMentorship = await db.mentorship.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedMentorship);
  } catch (error) {
    console.error('Error updating mentorship:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}