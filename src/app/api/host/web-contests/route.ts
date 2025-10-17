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

    // Get web contests created by this host
    const contests = await db.webContest.findMany({
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
            score: 'desc'
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

    // Add counts to each contest
    const contestsWithCount = contests.map(contest => ({
      ...contest,
      participantCount: contest._count.participants,
      submissionCount: contest._count.submissions
    }));

    return NextResponse.json({ success: true, data: contestsWithCount });
  } catch (error) {
    console.error('Error fetching web contests:', error);
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

    // Create web contest
    const contest = await db.webContest.create({
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
        submissionUrl: submissionUrl || null,
        status: 'UPCOMING',
        hostId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Web contest created successfully',
      data: contest
    });
  } catch (error) {
    console.error('Error creating web contest:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
