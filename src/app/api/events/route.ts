import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent, parseJSON } from '@/lib/db-utils';
import { EventType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Prepare filters
    const filters: any = {};
    
    if (type !== 'all') {
      filters.type = type.toUpperCase() as EventType;
    }
    
    if (search) {
      filters.search = search;
    }
    
    // Get events from database
    const events = await getAllEvents(filters);
    
    // Transform data to match frontend expectations
    const transformedEvents = events.map(event => {
      const eventDate = event.date.toISOString().split('T')[0];
      const startTime = event.date.toTimeString().substring(0, 5);
      const endTime = new Date(event.date.getTime() + event.duration * 60000).toTimeString().substring(0, 5);
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: eventDate,
        startTime: startTime,
        endTime: endTime,
        location: event.location || 'Online',
        mode: event.isOnline ? 'online' as const : 'offline' as const,
        category: event.type,
        type: event.type,
        price: 0,
        currency: 'USD',
        maxAttendees: event.maxAttendees || 100,
        currentAttendees: event._count?.participants || 0,
        tags: event.tags,
        organizer: 'Event Host',
        speakers: [],
        rating: 0,
        views: 0,
        imageUrl: event.imageUrl || undefined,
        featured: false
      };
    });

    // Sort events
    transformedEvents.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.currentAttendees - a.currentAttendees;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: transformedEvents,
      total: transformedEvents.length
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create event in database
    const eventDate = new Date(`${body.date}T${body.startTime || '09:00'}`);
    
    const newEvent = await createEvent({
      title: body.title,
      description: body.description,
      type: body.type?.toUpperCase() as EventType,
      date: eventDate,
      duration: body.duration || 60, // Default 1 hour
      location: body.location,
      isOnline: body.mode === 'online',
      maxAttendees: body.maxAttendees,
      imageUrl: body.imageUrl,
      tags: body.tags
    });

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}