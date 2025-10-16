import { NextRequest, NextResponse } from 'next/server';
import { getAllHackathons, createHackathon, parseJSON } from '@/lib/db-utils';
import { HackathonStatus, Difficulty, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Prepare filters
    const filters: any = {};
    
    if (difficulty !== 'all') {
      filters.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    
    if (status !== 'all') {
      filters.status = status.toUpperCase() as HackathonStatus;
    }
    
    if (search) {
      filters.search = search;
    }
    
    // Get hackathons from database
    const hackathons = await getAllHackathons(filters);
    
    // Transform data to match frontend expectations
    const transformedHackathons = hackathons.map(hackathon => ({
      id: hackathon.id,
      title: hackathon.title,
      description: hackathon.description,
      startDate: hackathon.startDate.toISOString().split('T')[0],
      endDate: hackathon.endDate.toISOString().split('T')[0],
      location: 'Online', // Default for now
      mode: 'online' as const,
      category: hackathon.theme,
      difficulty: hackathon.difficulty.toLowerCase(),
      prizePool: hackathon.prize ? parseInt(hackathon.prize.replace(/[^0-9]/g, '')) || 0 : 0,
      participants: hackathon.participants?.length || 0,
      maxParticipants: hackathon.maxParticipants || 100,
      tags: parseJSON<string[]>(hackathon.tags),
      organizer: 'NeoFest',
      registrationDeadline: hackathon.startDate.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 2000) + 500, // Random for now
      likes: Math.floor(Math.random() * 200) + 20,
      rating: 4.5 + Math.random() * 0.5,
      imageUrl: hackathon.imageUrl || '/api/placeholder/400/250'
    }));

    // Sort hackathons
    transformedHackathons.sort((a, b) => {
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
      data: transformedHackathons,
      total: transformedHackathons.length
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hackathons' },
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
    const { getUserByEmail } = await import('@/lib/db-utils');
    const user = await getUserByEmail(session.user.email);
    
    if (!user || (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)) {
      return NextResponse.json(
        { success: false, error: 'Only hosts can create hackathons' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Create hackathon in database
    const newHackathon = await createHackathon({
      title: body.title,
      description: body.description,
      theme: body.theme || body.category,
      prize: body.prize || body.prizePool?.toString(),
      maxParticipants: body.maxParticipants,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      difficulty: body.difficulty?.toUpperCase() as Difficulty,
      imageUrl: body.imageUrl,
      tags: body.tags,
      hostId: user.id
    });

    return NextResponse.json({
      success: true,
      data: newHackathon,
      message: 'Hackathon created successfully'
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hackathon' },
      { status: 500 }
    );
  }
}