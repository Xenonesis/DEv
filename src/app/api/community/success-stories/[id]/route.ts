import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.successStory.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            avatar: true,
            level: true,
            bio: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Success story not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.successStory.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    const storyWithParsedTags = {
      ...story,
      tags: story.tags ? JSON.parse(story.tags) : [],
    };

    return NextResponse.json(storyWithParsedTags);
  } catch (error) {
    console.error('Error fetching success story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch success story' },
      { status: 500 }
    );
  }
}
