import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const tutorials = await db.tutorial.findMany({
      include: {
        host: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, imageUrl, videoUrl, tags, difficulty } = await req.json();
    const tutorial = await db.tutorial.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        tags,
        difficulty,
        hostId: session.user.id,
      },
    });
    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}