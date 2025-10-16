import { NextRequest, NextResponse } from 'next/server';
import { getHackathonById, updateHackathon, deleteHackathon, registerForHackathon, getUserByEmail } from '@/lib/db-utils';
import { HackathonStatus, Difficulty, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = await getHackathonById(params.id);
    
    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hackathon' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the hackathon to check ownership
    const hackathon = await getHackathonById(params.id);
    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Check if user is the host or admin
    if (hackathon.hostId !== user.id && user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Only the host or admin can update this hackathon' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Update hackathon
    const updatedHackathon = await updateHackathon(params.id, {
      title: body.title,
      description: body.description,
      theme: body.theme,
      prize: body.prize,
      maxParticipants: body.maxParticipants,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      difficulty: body.difficulty?.toUpperCase() as Difficulty,
      imageUrl: body.imageUrl,
      tags: body.tags,
      status: body.status?.toUpperCase() as HackathonStatus
    });

    return NextResponse.json({
      success: true,
      data: updatedHackathon,
      message: 'Hackathon updated successfully'
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hackathon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the hackathon to check ownership
    const hackathon = await getHackathonById(params.id);
    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Check if user is the host or admin
    if (hackathon.hostId !== user.id && user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Only the host or admin can delete this hackathon' },
        { status: 403 }
      );
    }

    await deleteHackathon(params.id);

    return NextResponse.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hackathon' },
      { status: 500 }
    );
  }
}

// POST to register for hackathon
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get hackathon to check if user is the host
    const hackathon = await getHackathonById(params.id);
    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Prevent host from registering for their own hackathon
    if (hackathon.hostId === user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot register for your own hackathon' },
        { status: 403 }
      );
    }

    // Register user for hackathon
    await registerForHackathon(params.id, user.id);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for hackathon'
    });
  } catch (error: any) {
    console.error('Error registering for hackathon:', error);
    
    // Check if already registered
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Already registered for this hackathon' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to register for hackathon' },
      { status: 500 }
    );
  }
}
