import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');

    const teams = await prisma.team.findMany({
      where: hackathonId ? { hackathonId } : {},
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                avatar: true,
                level: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            isWinner: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, hackathonId, maxMembers } = body;

    if (!name || !hackathonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        hackathonId,
        maxMembers: maxMembers || 4,
      },
    });

    // Add creator as team leader
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: 'LEADER',
      },
    });

    const teamWithMembers = await prisma.team.findUnique({
      where: { id: team.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                avatar: true,
                level: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(teamWithMembers, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
