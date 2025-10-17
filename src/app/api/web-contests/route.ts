import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { Difficulty } from '@prisma/client';

// Helper function to safely parse JSON
function parseJSON<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const theme = searchParams.get('theme');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'date';

    const filters: any = { where: {} };

    if (theme && theme !== 'all') {
      filters.where.theme = theme;
    }

    if (difficulty && difficulty !== 'all') {
      filters.where.difficulty = difficulty.toUpperCase();
    }

    if (status && status !== 'all') {
      filters.where.status = status.toUpperCase();
    }

    if (search) {
      filters.where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { theme: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get web contests from database
    const contests = await db.webContest.findMany({
      where: filters.where,
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
      orderBy: sort === 'prize' ? { prize: 'desc' } : { createdAt: 'desc' }
    });

    // Transform data to match frontend expectations
    const transformedContests = contests.map(contest => ({
      id: contest.id,
      title: contest.title,
      description: contest.description,
      startDate: contest.startDate.toISOString().split('T')[0],
      endDate: contest.endDate.toISOString().split('T')[0],
      theme: contest.theme,
      difficulty: contest.difficulty.toLowerCase(),
      prizePool: contest.prize ? parseInt(contest.prize.replace(/[^0-9]/g, '')) || 0 : 0,
      participants: contest._count.participants,
      maxParticipants: contest.maxParticipants || 100,
      submissions: contest._count.submissions,
      tags: parseJSON<string[]>(contest.tags) || [],
      organizer: contest.host.name || 'Anonymous',
      registrationDeadline: contest.startDate.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 500) + 50,
      rating: (Math.random() * 2 + 3).toFixed(1),
      imageUrl: contest.imageUrl,
      requirements: contest.requirements,
      judgingCriteria: contest.judgingCriteria,
      status: contest.status,
      featured: contest.prize && parseInt(contest.prize.replace(/[^0-9]/g, '')) > 5000
    }));

    return NextResponse.json({
      success: true,
      data: transformedContests,
      total: transformedContests.length
    });
  } catch (error) {
    console.error('Error fetching web contests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approved host or admin
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isHostApproved: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: 'User not found or inactive' }, { status: 404 });
    }

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Host or admin privileges required' }, { status: 403 });
    }

    if (user.role === 'HOST' && !user.isHostApproved) {
      return NextResponse.json({ success: false, error: 'Host approval pending' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.theme || !body.startDate || !body.endDate || !body.difficulty) {
      return NextResponse.json(
        { success: false, error: 'Title, description, theme, start date, end date, and difficulty are required' },
        { status: 400 }
      );
    }

    // Create web contest in database
    const newContest = await db.webContest.create({
      data: {
        title: body.title,
        description: body.description,
        theme: body.theme,
        prize: body.prize || body.prizePool?.toString(),
        maxParticipants: body.maxParticipants,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        difficulty: body.difficulty?.toUpperCase() as Difficulty,
        imageUrl: body.imageUrl,
        tags: JSON.stringify(body.tags || []),
        requirements: body.requirements,
        judgingCriteria: body.judgingCriteria,
        submissionUrl: body.submissionUrl,
        status: 'UPCOMING',
        hostId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Web contest created successfully',
      data: newContest
    });
  } catch (error) {
    console.error('Error creating web contest:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
