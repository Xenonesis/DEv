import { NextRequest, NextResponse } from 'next/server';
import { getAllConferences, createConference } from '@/lib/db-utils';
import { ConferenceType } from '@prisma/client';

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
      filters.type = type.toUpperCase() as ConferenceType;
    }
    
    if (search) {
      filters.search = search;
    }
    
    // Get conferences from database
    const conferences = await getAllConferences(filters);
    
    // Transform data to match frontend expectations
    const transformedConferences = conferences.map(conference => {
      const conferenceDate = conference.date.toISOString().split('T')[0];
      const startTime = conference.date.toTimeString().substring(0, 5);
      const endTime = new Date(conference.date.getTime() + conference.duration * 60000).toTimeString().substring(0, 5);
      
      return {
        id: conference.id,
        title: conference.title,
        description: conference.description,
        date: conferenceDate,
        startTime: startTime,
        endTime: endTime,
        location: conference.location || 'Online',
        mode: conference.isOnline ? 'online' as const : 'offline' as const,
        category: conference.type,
        type: conference.type,
        price: 0,
        currency: 'USD',
        maxAttendees: conference.maxAttendees || 100,
        currentAttendees: conference._count?.participants || 0,
        tags: conference.tags,
        organizer: 'Conference Host',
        speakers: [],
        rating: 0,
        views: 0,
        imageUrl: conference.imageUrl || undefined,
        featured: false
      };
    });

    // Sort conferences
    transformedConferences.sort((a, b) => {
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
      data: transformedConferences,
      total: transformedConferences.length
    });
  } catch (error) {
    console.error('Error fetching conferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create conference in database
    const conferenceDate = new Date(`${body.date}T${body.startTime || '09:00'}`);
    
    const newConference = await createConference({
      title: body.title,
      description: body.description,
      type: body.type?.toUpperCase() as ConferenceType,
      date: conferenceDate,
      duration: body.duration || 60, // Default 1 hour
      location: body.location,
      isOnline: body.mode === 'online',
      maxAttendees: body.maxAttendees,
      imageUrl: body.imageUrl,
      tags: body.tags
    });

    return NextResponse.json({
      success: true,
      data: newConference,
      message: 'Conference created successfully'
    });
  } catch (error) {
    console.error('Error creating conference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conference' },
      { status: 500 }
    );
  }
}