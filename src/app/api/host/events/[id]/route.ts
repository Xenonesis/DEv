import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Verify the event belongs to this host
    if (event.hostId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Check if event exists and belongs to this host
    const existingEvent = await db.event.findUnique({
      where: { id: params.id }
    });

    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.hostId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const {
      title,
      description,
      type,
      date,
      startTime,
      duration,
      location,
      isOnline,
      maxAttendees,
      imageUrl,
      tags
    } = await request.json();

    // Validate required fields
    if (!title || !description || !type || !date || !duration) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, type, date, and duration are required' 
      }, { status: 400 });
    }

    // Combine date and time
    const eventDateTime = startTime 
      ? new Date(`${date}T${startTime}`)
      : new Date(date);

    // Update event
    const updatedEvent = await db.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        type: type.toUpperCase(),
        date: eventDateTime,
        duration: parseInt(duration),
        location: location || null,
        isOnline: isOnline || false,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        imageUrl: imageUrl || null,
        tags: JSON.stringify(tags || [])
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Check if event exists and belongs to this host
    const existingEvent = await db.event.findUnique({
      where: { id: params.id }
    });

    if (!existingEvent) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.hostId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Delete event
    await db.event.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
