import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const stories = await prisma.successStory.findMany({
      where: featured ? { isFeatured: true } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            avatar: true,
            level: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
      ],
    });

    const storiesWithParsedTags = stories.map((story) => ({
      ...story,
      tags: story.tags ? JSON.parse(story.tags) : [],
    }));

    return NextResponse.json(storiesWithParsedTags);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch success stories' },
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
    const { title, content, excerpt, imageUrl, hackathonId, projectId, tags } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const story = await prisma.successStory.create({
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        hackathonId,
        projectId,
        tags: tags ? JSON.stringify(tags) : null,
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
            level: true,
          },
        },
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Error creating success story:', error);
    return NextResponse.json(
      { error: 'Failed to create success story' },
      { status: 500 }
    );
  }
}
