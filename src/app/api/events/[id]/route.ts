import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/lib/db-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEventById(params.id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend expectations
    const eventDate = event.date.toISOString().split('T')[0];
    const startTime = event.date.toTimeString().substring(0, 5);
    const endTime = new Date(event.date.getTime() + event.duration * 60000).toTimeString().substring(0, 5);

    const transformedEvent = {
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
      organizer: event.host?.name || 'Event Host',
      speakers: [],
      rating: 0,
      views: 0,
      imageUrl: event.imageUrl || undefined,
      featured: false,
      hostId: event.hostId,
      registrations: event.participants?.map((p: any) => ({
        id: p.id,
        user: {
          id: p.user.id,
          name: p.user.name,
          avatar: p.user.image
        }
      })) || [],
      host: event.host ? {
        id: event.host.id,
        name: event.host.name,
        avatar: event.host.image
      } : null
    };

    return NextResponse.json({
      success: true,
      data: transformedEvent
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
