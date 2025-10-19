import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is a host
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'HOST') {
      return NextResponse.json({ success: false, error: 'Host privileges required' }, { status: 403 });
    }

    const resource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource || resource.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is a host
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'HOST') {
      return NextResponse.json({ success: false, error: 'Host privileges required' }, { status: 403 });
    }

    const resource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource || resource.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is a host
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'HOST') {
      return NextResponse.json({ success: false, error: 'Host privileges required' }, { status: 403 });
    }

    const { title, description, url, imageUrl, tags, type } = await req.json();
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource || resource.hostId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updatedResource = await db.resource.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
        imageUrl,
        tags: JSON.stringify(tags),
        type,
      },
    });

    return NextResponse.json({ success: true, data: updatedResource });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}