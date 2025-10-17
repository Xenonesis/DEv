import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

// GET single web contest
export async function GET(
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
      select: { id: true, role: true, isHostApproved: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    const contest = await db.webContest.findFirst({
      where: {
        id: params.id,
        hostId: user.id
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            submissions: true
          }
        }
      }
    });

    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contest });
  } catch (error) {
    console.error('Error fetching web contest:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT (Update) web contest
export async function PUT(
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
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Verify the contest belongs to this host
    const existingContest = await db.webContest.findFirst({
      where: {
        id: params.id,
        hostId: user.id
      }
    });

    if (!existingContest) {
      return NextResponse.json({ success: false, error: 'Contest not found or access denied' }, { status: 404 });
    }

    const {
      title,
      description,
      theme,
      prize,
      maxParticipants,
      startDate,
      endDate,
      difficulty,
      tags,
      requirements,
      judgingCriteria,
      submissionUrl
    } = await request.json();

    // Validate required fields
    if (!title || !description || !theme || !startDate || !endDate || !difficulty) {
      return NextResponse.json({
        success: false,
        error: 'Title, description, theme, start date, end date, and difficulty are required'
      }, { status: 400 });
    }

    // Update web contest
    const updatedContest = await db.webContest.update({
      where: { id: params.id },
      data: {
        title,
        description,
        theme,
        prize: prize || null,
        maxParticipants: maxParticipants || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        difficulty,
        tags: JSON.stringify(tags || []),
        requirements: requirements || null,
        judgingCriteria: judgingCriteria || null,
        submissionUrl: submissionUrl || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Web contest updated successfully',
      data: updatedContest
    });
  } catch (error) {
    console.error('Error updating web contest:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE web contest
export async function DELETE(
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
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Verify the contest belongs to this host
    const existingContest = await db.webContest.findFirst({
      where: {
        id: params.id,
        hostId: user.id
      }
    });

    if (!existingContest) {
      return NextResponse.json({ success: false, error: 'Contest not found or access denied' }, { status: 404 });
    }

    // Delete the web contest (cascade will handle participants and submissions)
    await db.webContest.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Web contest deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting web contest:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete web contest. Please try again.'
    }, { status: 500 });
  }
}
