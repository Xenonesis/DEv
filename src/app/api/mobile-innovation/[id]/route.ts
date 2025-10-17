import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Get innovation with host and participant info
    const innovation = await db.mobileInnovation.findUnique({
      where: { id: params.id },
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
        participants: session?.user?.email ? {
          where: {
            user: {
              email: session.user.email
            }
          },
          select: {
            id: true
          }
        } : false,
        _count: {
          select: {
            participants: true,
            submissions: true
          }
        }
      }
    });

    if (!innovation) {
      return NextResponse.json(
        { success: false, error: 'Innovation not found' },
        { status: 404 }
      );
    }

    // Transform data
    const transformedInnovation = {
      id: innovation.id,
      title: innovation.title,
      description: innovation.description,
      category: innovation.category,
      platform: innovation.platform,
      techStack: innovation.techStack ? JSON.parse(innovation.techStack) : [],
      prize: innovation.prize,
      maxParticipants: innovation.maxParticipants,
      startDate: innovation.startDate.toISOString(),
      endDate: innovation.endDate.toISOString(),
      status: innovation.status.toLowerCase(),
      imageUrl: innovation.imageUrl,
      tags: innovation.tags ? JSON.parse(innovation.tags) : [],
      requirements: innovation.requirements,
      judgingCriteria: innovation.judgingCriteria,
      difficulty: innovation.difficulty.toLowerCase(),
      host: innovation.host,
      participants: innovation._count.participants,
      submissions: innovation._count.submissions,
      createdAt: innovation.createdAt.toISOString()
    };

    const isRegistered = session?.user?.email && Array.isArray(innovation.participants) 
      ? innovation.participants.length > 0 
      : false;

    return NextResponse.json({
      success: true,
      data: transformedInnovation,
      isRegistered
    });
  } catch (error) {
    console.error('Error fetching mobile innovation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch innovation' },
      { status: 500 }
    );
  }
}
