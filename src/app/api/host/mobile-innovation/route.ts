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

    // Get mobile innovations created by this host
    const innovations = await db.mobileInnovation.findMany({
      where: { hostId: user.id },
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
          },
          orderBy: {
            registeredAt: 'desc'
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
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: { 
            participants: true,
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data
    const transformedInnovations = innovations.map(innovation => ({
      ...innovation,
      techStack: innovation.techStack ? JSON.parse(innovation.techStack) : [],
      tags: innovation.tags ? JSON.parse(innovation.tags) : [],
      participantCount: innovation._count.participants,
      submissionCount: innovation._count.submissions
    }));

    return NextResponse.json({ success: true, data: transformedInnovations });
  } catch (error) {
    console.error('Error fetching host mobile innovations:', error);
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

    // Validate required fields
    if (!title || !description || !category || !platform || !startDate || !endDate || !difficulty) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, category, platform, start date, end date, and difficulty are required' 
      }, { status: 400 });
    }

    // Create mobile innovation
    const innovation = await db.mobileInnovation.create({
      data: {
        title,
        description,
        category,
        platform,
        techStack: techStack ? JSON.stringify(techStack) : null,
        prize: prize || null,
        maxParticipants: maxParticipants || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        difficulty,
        tags: tags ? JSON.stringify(tags) : null,
        requirements: requirements || null,
        judgingCriteria: judgingCriteria || null,
        imageUrl: imageUrl || null,
        status: 'UPCOMING',
        hostId: user.id
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
      message: 'Mobile innovation challenge created successfully',
      data: innovation
    });
  } catch (error) {
    console.error('Error creating mobile innovation:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
