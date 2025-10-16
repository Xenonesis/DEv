import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
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

    // Get hackathons created by this host
    const hackathons = await db.hackathon.findMany({
      where: { hostId: user.id },
      include: {
        participants: true,
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add participant count to each hackathon
    const hackathonsWithCount = hackathons.map(hackathon => ({
      ...hackathon,
      participantCount: hackathon._count.participants
    }));

    return NextResponse.json({ success: true, data: hackathonsWithCount });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    // Create hackathon
    const hackathon = await db.hackathon.create({
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
        status: 'UPCOMING',
        hostId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Hackathon created successfully',
      data: hackathon
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}