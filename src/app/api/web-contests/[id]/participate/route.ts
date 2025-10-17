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

    const contestId = params.id;

    // Check if contest exists
    const contest = await db.webContest.findUnique({
      where: { id: contestId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    // Check if registration is still open
    if (new Date() > contest.startDate) {
      return NextResponse.json({ success: false, error: 'Registration has closed' }, { status: 400 });
    }

    // Check if max participants reached
    if (contest.maxParticipants && contest._count.participants >= contest.maxParticipants) {
      return NextResponse.json({ success: false, error: 'Contest is full' }, { status: 400 });
    }

    // Check if already registered
    const existingParticipant = await db.webContestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: user.id
        }
      }
    });

    if (existingParticipant) {
      return NextResponse.json({ success: false, error: 'Already registered' }, { status: 400 });
    }

    // Register user for contest
    await db.webContestParticipant.create({
      data: {
        contestId,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for web contest'
    });
  } catch (error) {
    console.error('Error registering for web contest:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
