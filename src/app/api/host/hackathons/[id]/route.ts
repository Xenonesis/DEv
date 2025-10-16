import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const {
      title,
      description,
      theme,
      prize,
      maxParticipants,
      startDate,
      endDate,
      difficulty,
      tags
    } = await request.json();

    // Validate required fields
    if (!title || !description || !theme || !startDate || !endDate || !difficulty) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, theme, start date, end date, and difficulty are required' 
      }, { status: 400 });
    }

    // Update hackathon
    const hackathon = await db.hackathon.update({
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
        tags: JSON.stringify(tags || [])
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Hackathon updated successfully',
      data: hackathon
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Delete hackathon
    await db.hackathon.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}