import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approved host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Get events created by this host
    const events = await db.event.findMany({
      where: { hostId: user.id },
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
          },
          orderBy: {
            registeredAt: 'desc'
          }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add participant count to each event
    const eventsWithCount = events.map(event => ({
      ...event,
      participantCount: event._count.participants
    }));

    return NextResponse.json({ success: true, data: eventsWithCount });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approved host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
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

    // Create event
    const event = await db.event.create({
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
        tags: JSON.stringify(tags || []),
        hostId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
