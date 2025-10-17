import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const forums = await prisma.forum.findMany({
      where: category ? { category: category as any } : {},
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
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const forumsWithCounts = forums.map((forum) => ({
      ...forum,
      replyCount: forum.replies.length,
      replies: undefined,
    }));

    return NextResponse.json(forumsWithCounts);
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        category,
        authorId: user.id,
      },
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
    });

    return NextResponse.json(forum, { status: 201 });
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json(
      { error: 'Failed to create forum' },
      { status: 500 }
    );
  }
}
