import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tutorial = await db.tutorial.findUnique({
      where: { id: params.id },
      include: {
        host: {
          select: {
            name: true,
            image: true,
          },
        },
        participants: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!tutorial) {
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}