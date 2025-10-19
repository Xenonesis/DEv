import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { registerForConference, getConferenceById } from '@/lib/db-utils';
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

    // Check if conference exists
    const conference = await getConferenceById(params.id);
    if (!conference) {
      return NextResponse.json(
        { success: false, error: 'Conference not found' },
        { status: 404 }
      );
    }

    // Check if conference is full
    if (conference.maxAttendees && conference._count.participants >= conference.maxAttendees) {
      return NextResponse.json(
        { success: false, error: 'Conference is full' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const alreadyRegistered = conference.participants.some(
      (p: any) => p.userId === user.id
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { success: false, error: 'Already registered for this conference' },
        { status: 400 }
      );
    }

    // Register user for conference
    await registerForConference(params.id, user.id);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for conference'
    });
  } catch (error) {
    console.error('Error registering for conference:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register for conference' },
      { status: 500 }
    );
  }
}