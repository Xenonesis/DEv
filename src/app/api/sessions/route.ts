import { NextRequest, NextResponse } from 'next/server';
import { getAllSessions, createSession, parseJSON } from '@/lib/db-utils';
import { SessionType, Difficulty } from '@prisma/client';

// Using real database data

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || 'all';
    const type = searchParams.get('type') || 'all';
    const sortBy = searchParams.get('sort') || 'rating';
    
    // Prepare filters
    const filters: any = {};
    
    if (difficulty !== 'all') {
      filters.difficulty = difficulty.toUpperCase() as Difficulty;
    }
    
    if (type !== 'all') {
      filters.type = type.toUpperCase() as SessionType;
    }
    
    if (search) {
      filters.search = search;
    }
    
    // Get sessions from database
    const sessions = await getAllSessions(filters);
    
    // Transform data to match frontend expectations
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      instructor: session.instructor,
      instructorTitle: 'Expert Instructor', // Default for now
      duration: session.duration,
      level: session.difficulty.toLowerCase(),
      category: session.type,
      type: session.type.toLowerCase(),
      price: 0, // Default for now
      currency: 'USD',
      rating: 4.5 + Math.random() * 0.5,
      enrolledCount: session.participants?.length || 0,
      maxEnrollment: 100, // Default for now
      tags: parseJSON<string[]>(session.tags),
      prerequisites: [], // Default for now
      learningObjectives: [], // Default for now
      materials: parseJSON<string[]>(session.materials),
      schedule: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sessions: Math.ceil(session.duration / 60),
        frequency: 'Weekly'
      },
      format: 'self-paced' as const,
      certificate: true,
      freePreview: true,
      completed: false,
      progress: Math.floor(Math.random() * 100),
      imageUrl: '/api/placeholder/400/250'
    }));

    // Sort sessions
    transformedSessions.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.enrolledCount - a.enrolledCount;
        case 'price':
          return a.price - b.price;
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: transformedSessions,
      total: transformedSessions.length
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create session in database
    const newSession = await createSession({
      title: body.title,
      description: body.description,
      content: body.content || body.description,
      type: body.type?.toUpperCase() as SessionType,
      difficulty: body.difficulty?.toUpperCase() as Difficulty,
      duration: body.duration || 60,
      instructor: body.instructor,
      videoUrl: body.videoUrl,
      materials: body.materials,
      tags: body.tags
    });

    return NextResponse.json({
      success: true,
      data: newSession,
      message: 'Session created successfully'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}