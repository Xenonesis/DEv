import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    let dateFilter = {};
    const now = new Date();

    if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: weekAgo } };
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: monthAgo } };
    }

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...dateFilter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        avatar: true,
        level: true,
        points: true,
        bio: true,
        skills: true,
        hackathons: {
          select: {
            id: true,
          },
        },
        achievements: {
          select: {
            id: true,
            achievement: {
              select: {
                title: true,
                icon: true,
              },
            },
          },
        },
        teamMemberships: {
          select: {
            team: {
              select: {
                projects: {
                  where: {
                    isWinner: true,
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { points: 'desc' },
        { level: 'desc' },
      ],
      take: limit,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
      bio: user.bio,
      skills: user.skills ? JSON.parse(user.skills) : [],
      hackathonsCount: user.hackathons.length,
      achievementsCount: user.achievements.length,
      winsCount: user.teamMemberships.reduce(
        (acc, tm) => acc + tm.team.projects.filter((p) => p.isWinner).length,
        0
      ),
      topAchievements: user.achievements.slice(0, 3).map((a) => ({
        title: a.achievement.title,
        icon: a.achievement.icon,
      })),
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
