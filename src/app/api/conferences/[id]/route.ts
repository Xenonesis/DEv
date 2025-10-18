import { NextRequest, NextResponse } from 'next/server';
import { getConferenceById } from '@/lib/db-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conference = await getConferenceById(params.id);

    if (!conference) {
      return NextResponse.json(
        { success: false, error: 'Conference not found' },
        { status: 404 }
      );
    }

    // Transform data to match frontend expectations
    const conferenceDate = conference.date.toISOString().split('T')[0];
    const startTime = conference.date.toTimeString().substring(0, 5);
    const endTime = new Date(conference.date.getTime() + conference.duration * 60000).toTimeString().substring(0, 5);

    const transformedConference = {
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
      organizer: conference.host?.name || 'Conference Host',
      speakers: [],
      rating: 0,
      views: 0,
      imageUrl: conference.imageUrl || undefined,
      featured: false,
      hostId: conference.hostId,
      registrations: conference.participants?.map((p: any) => ({
        id: p.id,
        user: {
          id: p.user.id,
          name: p.user.name,
          avatar: p.user.image
        }
      })) || [],
      host: conference.host ? {
        id: conference.host.id,
        name: conference.host.name,
        avatar: conference.host.image
      } : null
    };

    return NextResponse.json({
      success: true,
      data: transformedConference
    });
  } catch (error) {
    console.error('Error fetching conference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conference' },
      { status: 500 }
    );
  }
}