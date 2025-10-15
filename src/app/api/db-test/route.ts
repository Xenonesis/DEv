import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  getAllHackathons, 
  getAllEvents, 
  getAllSessions, 
  getAllIdeas,
  getDashboardStats,
  getUserById
} from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection and queries...')
    
    // Test basic database connection
    await db.$connect()
    console.log('✅ Database connected successfully')
    
    // Test user count
    const userCount = await db.user.count()
    console.log(`👥 Found ${userCount} users in database`)
    
    // Test queries with sample data
    const [hackathons, events, sessions, ideas] = await Promise.all([
      getAllHackathons(),
      getAllEvents(),
      getAllSessions(),
      getAllIdeas()
    ])
    
    console.log(`🏆 Found ${hackathons.length} hackathons`)
    console.log(`📅 Found ${events.length} events`)
    console.log(`📚 Found ${sessions.length} sessions`)
    console.log(`💡 Found ${ideas.length} ideas`)
    
    // Get dashboard stats for first user
    if (userCount > 0) {
      const firstUser = await db.user.findFirst()
      if (firstUser) {
        const dashboardStats = await getDashboardStats(firstUser.id)
        console.log(`📊 Dashboard stats for ${firstUser.name}:`, dashboardStats.stats)
      }
    }
    
    // Test a complex query with relations
    const hackathonWithDetails = await db.hackathon.findFirst({
      include: {
        participants: {
          include: {
            user: true
          }
        },
        projects: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (hackathonWithDetails) {
      console.log(`🎯 Sample hackathon: ${hackathonWithDetails.title}`)
      console.log(`   Participants: ${hackathonWithDetails.participants.length}`)
      console.log(`   Projects: ${hackathonWithDetails.projects.length}`)
    }
    
    await db.$disconnect()
    console.log('✅ Database test completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and queries working perfectly!',
      data: {
        userCount,
        hackathons: hackathons.length,
        events: events.length,
        sessions: sessions.length,
        ideas: ideas.length,
        sampleData: {
          hackathons: hackathons.slice(0, 2).map(h => ({
            id: h.id,
            title: h.title,
            status: h.status,
            participantCount: h._count?.participants || 0
          })),
          events: events.slice(0, 2).map(e => ({
            id: e.id,
            title: e.title,
            type: e.type,
            date: e.date,
            participantCount: e._count?.participants || 0
          })),
          sessions: sessions.slice(0, 2).map(s => ({
            id: s.id,
            title: s.title,
            type: s.type,
            difficulty: s.difficulty,
            participantCount: s._count?.participants || 0
          })),
          ideas: ideas.slice(0, 2).map(i => ({
            id: i.id,
            title: i.title,
            category: i.category,
            votes: i.votes,
            author: i.author.name
          }))
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    await db.$disconnect()
    
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}