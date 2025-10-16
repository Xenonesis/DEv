import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/lib/db'

// GET - Fetch user profile with stats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user with all related data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        hackathons: {
          include: {
            hackathon: true
          }
        },
        events: {
          include: {
            event: true
          }
        },
        learningSessions: {
          include: {
            session: true
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        },
        teamMemberships: {
          include: {
            team: true
          }
        },
        ideas: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate stats
    const stats = {
      hackathonsJoined: user.hackathons.length,
      eventsAttended: user.events.length,
      sessionsCompleted: user.learningSessions.filter(s => s.completed).length,
      totalSessions: user.learningSessions.length,
      ideasPosted: user.ideas.length,
      teamsJoined: user.teamMemberships.length,
      achievementsUnlocked: user.achievements.length
    }

    // Parse skills if stored as JSON string
    let skills = []
    if (user.skills) {
      try {
        skills = JSON.parse(user.skills)
      } catch {
        skills = []
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        image: user.image,
        bio: user.bio,
        skills,
        level: user.level,
        points: user.points,
        role: user.role,
        isHostApproved: user.isHostApproved,
        createdAt: user.createdAt
      },
      stats,
      achievements: user.achievements.map(ua => ({
        id: ua.achievement.id,
        title: ua.achievement.title,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        points: ua.achievement.points,
        unlockedAt: ua.unlockedAt
      })),
      recentActivity: {
        hackathons: user.hackathons.slice(0, 5).map(hp => ({
          id: hp.hackathon.id,
          title: hp.hackathon.title,
          status: hp.hackathon.status,
          registeredAt: hp.registeredAt
        })),
        events: user.events.slice(0, 5).map(ep => ({
          id: ep.event.id,
          title: ep.event.title,
          date: ep.event.date,
          registeredAt: ep.registeredAt
        })),
        sessions: user.learningSessions.slice(0, 5).map(sp => ({
          id: sp.session.id,
          title: sp.session.title,
          progress: sp.progress,
          completed: sp.completed
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, bio, skills, avatar } = body

    // Validate input
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (bio !== undefined) updateData.bio = bio.trim()
    if (avatar !== undefined) updateData.avatar = avatar
    if (skills !== undefined) {
      // Store skills as JSON string
      updateData.skills = JSON.stringify(skills)
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: updateData
    })

    // Parse skills for response
    let parsedSkills = []
    if (updatedUser.skills) {
      try {
        parsedSkills = JSON.parse(updatedUser.skills)
      } catch {
        parsedSkills = []
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        image: updatedUser.image,
        bio: updatedUser.bio,
        skills: parsedSkills,
        level: updatedUser.level,
        points: updatedUser.points
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
