import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseJSON } from '@/lib/db-utils';
import { ChallengeStatus, Difficulty, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || 'all';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Prepare filters
    const filters: any = {
      where: {}
    };
    
    if (difficulty !== 'all') {
      filters.where.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    
    if (status !== 'all') {
      filters.where.status = status.toUpperCase() as ChallengeStatus;
    }
    
    if (category !== 'all') {
      filters.where.category = category;
    }
    
    if (search) {
      filters.where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Get AI challenges from database
    const challenges = await db.aIChallenge.findMany({
      ...filters,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
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
        _count: {
          select: { 
            participants: true,
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Transform data to match frontend expectations
    const transformedChallenges = challenges.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.startDate.toISOString().split('T')[0],
      endDate: challenge.endDate.toISOString().split('T')[0],
      category: challenge.category,
      difficulty: challenge.difficulty.toLowerCase(),
      prizePool: challenge.prize ? parseInt(challenge.prize.replace(/[^0-9]/g, '')) || 0 : 0,
      participants: challenge._count.participants,
      maxParticipants: challenge.maxParticipants || 100,
      submissions: challenge._count.submissions,
      tags: parseJSON<string[]>(challenge.tags),
      organizer: challenge.host.name || 'Anonymous',
      registrationDeadline: challenge.startDate.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 2000) + 500, // Random for now
      likes: Math.floor(Math.random() * 200) + 20,
      rating: 4.5 + Math.random() * 0.5,
      imageUrl: challenge.imageUrl || '/api/placeholder/400/250',
      dataset: challenge.dataset,
      evaluationMetric: challenge.evaluationMetric,
      status: challenge.status.toLowerCase(),
      featured: challenge.prize && parseInt(challenge.prize.replace(/[^0-9]/g, '')) > 10000
    }));

    // Sort challenges
    transformedChallenges.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'prize':
          return b.prizePool - a.prizePool;
        case 'participants':
          return b.participants - a.participants;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: transformedChallenges,
      total: transformedChallenges.length
    });
  } catch (error) {
    console.error('Error fetching AI challenges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI challenges' },
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
    
    if (!user || (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)) {
      return NextResponse.json(
        { success: false, error: 'Only hosts can create AI challenges' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.startDate || !body.endDate || !body.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, category, start date, end date, and difficulty are required' },
        { status: 400 }
      );
    }

    // Create AI challenge in database
    const newChallenge = await db.aIChallenge.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        prize: body.prize || body.prizePool?.toString(),
        maxParticipants: body.maxParticipants,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        difficulty: body.difficulty?.toUpperCase() as Difficulty,
        imageUrl: body.imageUrl,
        tags: JSON.stringify(body.tags || []),
        dataset: body.dataset,
        evaluationMetric: body.evaluationMetric,
        rules: body.rules,
        status: ChallengeStatus.UPCOMING,
        hostId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: newChallenge,
      message: 'AI Challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating AI challenge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create AI challenge' },
      { status: 500 }
    );
  }
}
