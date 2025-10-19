import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource || resource.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'HOST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, url, imageUrl, tags, type } = await req.json();
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource || resource.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedResource = await db.resource.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
        imageUrl,
        tags,
        type,
      },
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}