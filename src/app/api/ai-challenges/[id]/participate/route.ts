import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(
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
      select: { id: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: 'User not found or inactive' }, { status: 404 });
    }

    const challengeId = params.id;

    // Check if challenge exists
    const challenge = await db.aIChallenge.findUnique({
      where: { id: challengeId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }

    // Check if registration is still open
    if (new Date() > challenge.startDate) {
      return NextResponse.json({ success: false, error: 'Registration has closed' }, { status: 400 });
    }

    // Check if max participants reached
    if (challenge.maxParticipants && challenge._count.participants >= challenge.maxParticipants) {
      return NextResponse.json({ success: false, error: 'Challenge is full' }, { status: 400 });
    }

    // Check if already registered
    const existingParticipant = await db.aIChallengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId: user.id
        }
      }
    });

    if (existingParticipant) {
      return NextResponse.json({ success: false, error: 'Already registered' }, { status: 400 });
    }

    // Register user for challenge
    await db.aIChallengeParticipant.create({
      data: {
        challengeId,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully registered for AI challenge' 
    });
  } catch (error) {
    console.error('Error registering for AI challenge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
