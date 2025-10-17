import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const forum = await prisma.forum.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!forum) {
      return NextResponse.json({ error: 'Forum not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.forum.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(forum);
  } catch (error) {
    console.error('Error fetching forum:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum' },
      { status: 500 }
    );
  }
}
