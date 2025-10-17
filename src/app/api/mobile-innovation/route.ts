import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { Difficulty, ChallengeStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const platform = searchParams.get('platform') || 'all';
    const difficulty = searchParams.get('difficulty') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category !== 'all') {
      where.category = category;
    }
    
    if (platform !== 'all') {
      where.platform = platform;
    }
    
    if (difficulty !== 'all') {
      where.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    
    if (status !== 'all') {
      where.status = status.toUpperCase() as ChallengeStatus;
    }
    
    // Get mobile innovations from database
    const innovations = await db.mobileInnovation.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            image: true
          }
        },
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
          select: {
            id: true,
            title: true,
            likes: true,
            views: true,
            isWinner: true
          }
        },
        _count: {
          select: {
            participants: true,
            submissions: true
          }
        }
      },
      orderBy: 
        sortBy === 'date' ? { startDate: 'asc' } :
        sortBy === 'prize' ? { prize: 'desc' } :
        sortBy === 'participants' ? { participants: { _count: 'desc' } } :
        { createdAt: 'desc' }
    });

    // Transform data
    const transformedInnovations = innovations.map(innovation => {
      const techStack = innovation.techStack ? JSON.parse(innovation.techStack) : [];
      const tags = innovation.tags ? JSON.parse(innovation.tags) : [];
      
      return {
        id: innovation.id,
        title: innovation.title,
        description: innovation.description,
        category: innovation.category,
        platform: innovation.platform,
        techStack,
        prize: innovation.prize,
        maxParticipants: innovation.maxParticipants,
        startDate: innovation.startDate.toISOString(),
        endDate: innovation.endDate.toISOString(),
        status: innovation.status.toLowerCase(),
        imageUrl: innovation.imageUrl,
        tags,
        requirements: innovation.requirements,
        judgingCriteria: innovation.judgingCriteria,
        difficulty: innovation.difficulty.toLowerCase(),
        host: innovation.host,
        participants: innovation._count.participants,
        submissions: innovation._count.submissions,
        featured: innovation.prize && parseInt(innovation.prize.replace(/[^0-9]/g, '')) > 5000,
        createdAt: innovation.createdAt.toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedInnovations,
      total: transformedInnovations.length
    });
  } catch (error) {
    console.error('Error fetching mobile innovations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mobile innovations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a host
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });
    
    if (!user || (user.role !== 'HOST' && user.role !== 'ADMIN') || !user.isHostApproved || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Only approved hosts can create mobile innovation challenges' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.platform || !body.startDate || !body.endDate || !body.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create mobile innovation in database
    const newInnovation = await db.mobileInnovation.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        platform: body.platform,
        techStack: body.techStack ? JSON.stringify(body.techStack) : null,
        prize: body.prize || null,
        maxParticipants: body.maxParticipants || null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        difficulty: body.difficulty.toUpperCase() as Difficulty,
        status: 'UPCOMING' as ChallengeStatus,
        imageUrl: body.imageUrl || null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        requirements: body.requirements || null,
        judgingCriteria: body.judgingCriteria || null,
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
      data: newInnovation,
      message: 'Mobile innovation challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating mobile innovation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create mobile innovation challenge' },
      { status: 500 }
    );
  }
}
