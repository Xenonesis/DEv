import { NextRequest, NextResponse } from 'next/server';
import { getAllIdeas, createIdea, parseJSON } from '@/lib/db-utils';
import { IdeaStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sort') || 'votes';
    
    // Prepare filters
    const filters: any = {};
    
    if (status !== 'all') {
      filters.status = status.toUpperCase() as IdeaStatus;
    }
    
    if (category !== 'all') {
      filters.category = category;
    }
    
    if (search) {
      filters.search = search;
    }
    
    // Get ideas from database
    const ideas = await getAllIdeas(filters);
    
    // Transform data to match frontend expectations
    const transformedIdeas = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      tags: parseJSON<string[]>(idea.tags),
      status: idea.status.toLowerCase(),
      votes: idea.votes,
      author: idea.author?.name || 'Anonymous',
      authorId: idea.authorId,
      createdAt: idea.createdAt.toISOString(),
      updatedAt: idea.updatedAt.toISOString(),
      comments: idea.comments?.length || 0
    }));

    // Sort ideas
    transformedIdeas.sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'comments':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    return NextResponse.json({
      success: true,
      data: transformedIdeas,
      total: transformedIdeas.length
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create idea in database
    const newIdea = await createIdea({
      title: body.title,
      description: body.description,
      category: body.category,
      authorId: body.authorId, // This should come from authentication
      tags: body.tags,
      status: body.status?.toUpperCase() as IdeaStatus || 'DRAFT'
    });

    return NextResponse.json({
      success: true,
      data: newIdea,
      message: 'Idea created successfully'
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}