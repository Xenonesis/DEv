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
    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
    });

    if (!tutorial) {
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    const existingParticipant = await db.tutorialParticipant.findUnique({
      where: {
        tutorialId_userId: {
          tutorialId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Already started the tutorial' },
        { status: 400 }
      );
    }

    await db.tutorialParticipant.create({
      data: {
        tutorialId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Started successfully' });
  } catch (error) {
    console.error('Error starting tutorial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}