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
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User account not active' },
        { status: 403 }
      );
    }

    // Get innovation
    const innovation = await db.mobileInnovation.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!innovation) {
      return NextResponse.json(
        { success: false, error: 'Innovation not found' },
        { status: 404 }
      );
    }

    // Check if registration is still open
    if (new Date(innovation.endDate) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Registration has closed' },
        { status: 400 }
      );
    }

    // Check if max participants reached
    if (innovation.maxParticipants && innovation._count.participants >= innovation.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Maximum participants reached' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingRegistration = await db.mobileInnovationParticipant.findUnique({
      where: {
        innovationId_userId: {
          innovationId: params.id,
          userId: user.id
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'Already registered' },
        { status: 400 }
      );
    }

    // Register participant
    await db.mobileInnovationParticipant.create({
      data: {
        innovationId: params.id,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for the innovation challenge'
    });
  } catch (error) {
    console.error('Error registering for mobile innovation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register' },
      { status: 500 }
    );
  }
}
