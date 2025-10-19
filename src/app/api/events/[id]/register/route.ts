import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { registerForEvent, getEventById } from '@/lib/db-utils';
import { getUserByEmail } from '@/lib/db-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if event exists
    const event = await getEventById(params.id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event._count.participants >= event.maxAttendees) {
      return NextResponse.json(
        { success: false, error: 'Event is full' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const alreadyRegistered = event.participants.some(
      (p: any) => p.userId === user.id
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { success: false, error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Register user for event
    await registerForEvent(params.id, user.id);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}
