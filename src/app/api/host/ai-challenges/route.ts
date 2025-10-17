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

    // Get AI challenges created by this host
    const challenges = await db.aIChallenge.findMany({
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

    // Add counts to each challenge
    const challengesWithCount = challenges.map(challenge => ({
      ...challenge,
      participantCount: challenge._count.participants,
      submissionCount: challenge._count.submissions
    }));

    return NextResponse.json({ success: true, data: challengesWithCount });
  } catch (error) {
    console.error('Error fetching AI challenges:', error);
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

    // Create AI challenge
    const challenge = await db.aIChallenge.create({
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
        rules: rules || null,
        status: 'UPCOMING',
        hostId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'AI Challenge created successfully',
      data: challenge
    });
  } catch (error) {
    console.error('Error creating AI challenge:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
