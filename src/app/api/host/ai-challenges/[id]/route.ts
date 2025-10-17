import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

// GET single AI challenge
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

    const challenge = await db.aIChallenge.findFirst({
      where: { 
        id: params.id,
        hostId: user.id // Ensure host can only access their own challenges
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

    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error fetching AI challenge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT (Update) AI challenge
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

    // Verify the challenge belongs to this host
    const existingChallenge = await db.aIChallenge.findFirst({
      where: { 
        id: params.id,
        hostId: user.id
      }
    });

    if (!existingChallenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found or access denied' }, { status: 404 });
    }

    const {
      title,
      description,
      category,
      prize,
      maxParticipants,
      startDate,
      endDate,
      difficulty,
      tags,
      dataset,
      evaluationMetric,
      rules
    } = await request.json();

    // Validate required fields
    if (!title || !description || !category || !startDate || !endDate || !difficulty) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, category, start date, end date, and difficulty are required' 
      }, { status: 400 });
    }

    // Update AI challenge
    const updatedChallenge = await db.aIChallenge.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        prize: prize || null,
        maxParticipants: maxParticipants || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        difficulty,
        tags: JSON.stringify(tags || []),
        dataset: dataset || null,
        evaluationMetric: evaluationMetric || null,
        rules: rules || null
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'AI Challenge updated successfully',
      data: updatedChallenge
    });
  } catch (error) {
    console.error('Error updating AI challenge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE AI challenge
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

    // Verify the challenge belongs to this host
    const existingChallenge = await db.aIChallenge.findFirst({
      where: { 
        id: params.id,
        hostId: user.id
      }
    });

    if (!existingChallenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found or access denied' }, { status: 404 });
    }

    // Delete the AI challenge (cascade will handle participants and submissions)
    await db.aIChallenge.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'AI Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting AI challenge:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete AI challenge. Please try again.' 
    }, { status: 500 });
  }
}
