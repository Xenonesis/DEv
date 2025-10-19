import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'HOST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { title, description, url, imageUrl, tags, type } = await req.json();
      const resource = await db.resource.create({
        data: {
          title,
          description,
          url,
          imageUrl,
          tags: JSON.stringify(tags),
          type,
          hostId: session.user.id,
        },
      });
      return NextResponse.json(resource, { status: 201 });
    } catch (error) {
      console.error('Error creating resource:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  try {
    const resources = await db.resource.findMany({
      where: {
        hostId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching host resources:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}