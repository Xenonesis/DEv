import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const mentorships = await db.mentorship.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            image: true,
            skills: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json(mentorships);
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mentorId, goals } = await req.json();
    const mentorship = await db.mentorship.create({
      data: {
        mentorId,
        menteeId: session.user.id,
        goals,
      },
    });
    return NextResponse.json(mentorship, { status: 201 });
  } catch (error) {
    console.error('Error creating mentorship:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}