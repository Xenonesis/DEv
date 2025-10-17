import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approved host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Check if innovation exists and belongs to this host
    const existingInnovation = await db.mobileInnovation.findUnique({
      where: { id: params.id }
    });

    if (!existingInnovation) {
      return NextResponse.json({ success: false, error: 'Innovation not found' }, { status: 404 });
    }

    if (existingInnovation.hostId !== user.id) {
      return NextResponse.json({ success: false, error: 'Not authorized to edit this innovation' }, { status: 403 });
    }

    const {
      title,
      description,
      category,
      platform,
      techStack,
      prize,
      maxParticipants,
      startDate,
      endDate,
      difficulty,
      tags,
      requirements,
      judgingCriteria,
      imageUrl
    } = await request.json();

    // Update innovation
    const innovation = await db.mobileInnovation.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        platform,
        techStack: techStack ? JSON.stringify(techStack) : existingInnovation.techStack,
        prize: prize || null,
        maxParticipants: maxParticipants || null,
        startDate: startDate ? new Date(startDate) : existingInnovation.startDate,
        endDate: endDate ? new Date(endDate) : existingInnovation.endDate,
        difficulty: difficulty || existingInnovation.difficulty,
        tags: tags ? JSON.stringify(tags) : existingInnovation.tags,
        requirements: requirements || null,
        judgingCriteria: judgingCriteria || null,
        imageUrl: imageUrl || null
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mobile innovation updated successfully',
      data: innovation
    });
  } catch (error) {
    console.error('Error updating mobile innovation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approved host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || user.role !== 'HOST' || !user.isHostApproved || !user.isActive) {
      return NextResponse.json({ success: false, error: 'Host access required' }, { status: 403 });
    }

    // Check if innovation exists and belongs to this host
    const existingInnovation = await db.mobileInnovation.findUnique({
      where: { id: params.id }
    });

    if (!existingInnovation) {
      return NextResponse.json({ success: false, error: 'Innovation not found' }, { status: 404 });
    }

    if (existingInnovation.hostId !== user.id) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this innovation' }, { status: 403 });
    }

    // Delete innovation (cascade will delete participants and submissions)
    await db.mobileInnovation.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mobile innovation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mobile innovation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
