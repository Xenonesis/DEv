import { PrismaClient } from '@prisma/client'
import { HackathonStatus, EventType, SessionType, Difficulty, TeamRole, IdeaStatus, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alex.chen@neofest.com' },
      update: {},
      create: {
        email: 'alex.chen@neofest.com',
        name: 'Alex Chen',
        bio: 'Full-stack developer passionate about AI and web technologies',
        skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Python', 'Machine Learning']),
        level: 15,
        points: 1250,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.kim@neofest.com' },
      update: {},
      create: {
        email: 'sarah.kim@neofest.com',
        name: 'Sarah Kim',
        bio: 'UX/UI designer focused on creating intuitive digital experiences',
        skills: JSON.stringify(['Figma', 'Adobe XD', 'CSS', 'JavaScript', 'User Research']),
        level: 12,
        points: 980,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike.johnson@neofest.com' },
      update: {},
      create: {
        email: 'mike.johnson@neofest.com',
        name: 'Mike Johnson',
        bio: 'DevOps engineer with expertise in cloud infrastructure',
        skills: JSON.stringify(['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform']),
        level: 18,
        points: 1580,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
      }
    }),
    prisma.user.upsert({
      where: { email: 'emma.wilson@neofest.com' },
      update: {},
      create: {
        email: 'emma.wilson@neofest.com',
        name: 'Emma Wilson',
        bio: 'Data scientist specializing in predictive analytics',
        skills: JSON.stringify(['Python', 'R', 'SQL', 'TensorFlow', 'Data Visualization']),
        level: 20,
        points: 2100,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
      }
    })
  ])

  console.log('✅ Created users')

  // Clear existing events and related registrations so hosts start fresh
  await prisma.eventParticipant.deleteMany()
  await prisma.event.deleteMany()

  // No mock hackathons - hosts will create them dynamically

  const hackathons: any[] = []

  console.log('✅ Skipped mock hackathons (hosts will create them)')

  // Create learning sessions
  const sessions = await Promise.all([
    prisma.learningSession.create({
      data: {
        title: 'Introduction to TypeScript',
        description: 'Master the fundamentals of TypeScript programming',
        content: 'This comprehensive course covers TypeScript basics, types, interfaces, generics, and advanced patterns.',
        type: SessionType.VIDEO,
        difficulty: Difficulty.BEGINNER,
        duration: 180,
        instructor: 'Alex Chen',
        videoUrl: 'https://example.com/typescript-intro',
        materials: JSON.stringify(['https://example.com/slides', 'https://example.com/code-examples']),
        tags: JSON.stringify(['TypeScript', 'JavaScript', 'Programming', 'Beginner'])
      }
    }),
    prisma.learningSession.create({
      data: {
        title: 'Advanced React Hooks',
        description: 'Deep dive into custom hooks and advanced patterns',
        content: 'Learn how to create powerful custom hooks and optimize your React applications.',
        type: SessionType.WORKSHOP,
        difficulty: Difficulty.ADVANCED,
        duration: 240,
        instructor: 'Sarah Kim',
        videoUrl: 'https://example.com/react-hooks',
        materials: JSON.stringify(['https://example.com/workshop-files', 'https://example.com/projects']),
        tags: JSON.stringify(['React', 'Hooks', 'Advanced', 'Workshop'])
      }
    }),
    prisma.learningSession.create({
      data: {
        title: 'Cloud Architecture Fundamentals',
        description: 'Understanding cloud computing and architecture patterns',
        content: 'Explore cloud concepts, architecture patterns, and best practices for scalable applications.',
        type: SessionType.TUTORIAL,
        difficulty: Difficulty.INTERMEDIATE,
        duration: 150,
        instructor: 'Mike Johnson',
        videoUrl: 'https://example.com/cloud-architecture',
        materials: JSON.stringify(['https://example.com/diagrams', 'https://example.com/resources']),
        tags: JSON.stringify(['Cloud', 'Architecture', 'AWS', 'DevOps'])
      }
    })
  ])

  console.log('✅ Created learning sessions')

  // Create ideas
  const ideas = await Promise.all([
    prisma.idea.create({
      data: {
        title: 'AI-Powered Code Review Assistant',
        description: 'An intelligent tool that automatically reviews code for bugs, security vulnerabilities, and best practices using machine learning.',
        category: 'AI/ML',
        tags: JSON.stringify(['AI', 'Code Review', 'Automation', 'Developer Tools']),
        status: IdeaStatus.PUBLISHED,
        votes: 45,
        authorId: users[0].id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Sustainable Energy Tracking Platform',
        description: 'A mobile app that helps individuals and businesses track their carbon footprint and suggest ways to reduce energy consumption.',
        category: 'Sustainability',
        tags: JSON.stringify(['Sustainability', 'Environment', 'Mobile App', 'IoT']),
        status: IdeaStatus.PUBLISHED,
        votes: 32,
        authorId: users[1].id
      }
    }),
    prisma.idea.create({
      data: {
        title: 'Virtual Reality Collaboration Space',
        description: 'A VR platform for remote teams to collaborate in virtual meeting rooms with interactive tools and real-time collaboration.',
        category: 'VR/AR',
        tags: JSON.stringify(['VR', 'Collaboration', 'Remote Work', 'Metaverse']),
        status: IdeaStatus.UNDER_REVIEW,
        votes: 28,
        authorId: users[2].id
      }
    })
  ])

  console.log('✅ Created ideas')

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: 'First Steps',
        description: 'Complete your first learning session',
        icon: '🎯',
        points: 10,
        condition: JSON.stringify({ type: 'session_completed', count: 1 })
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Hackathon Hero',
        description: 'Participate in your first hackathon',
        icon: '🏆',
        points: 50,
        condition: JSON.stringify({ type: 'hackathon_participated', count: 1 })
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Idea Innovator',
        description: 'Submit 5 approved ideas',
        icon: '💡',
        points: 100,
        condition: JSON.stringify({ type: 'ideas_approved', count: 5 })
      }
    }),
    prisma.achievement.create({
      data: {
        title: 'Community Leader',
        description: 'Reach level 20',
        icon: '👑',
        points: 200,
        condition: JSON.stringify({ type: 'level_reached', level: 20 })
      }
    })
  ])

  console.log('✅ Created achievements')

  // Create some user achievements
  await Promise.all([
    prisma.userAchievement.create({
      data: {
        userId: users[0].id,
        achievementId: achievements[0].id
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[1].id,
        achievementId: achievements[0].id
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[2].id,
        achievementId: achievements[1].id
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: users[3].id,
        achievementId: achievements[3].id
      }
    })
  ])

  console.log('✅ Created user achievements')

  // No hackathon participants or mock events
  console.log('✅ Skipped hackathon participants and mock events')

  // Enroll users in sessions
  await Promise.all([
    prisma.sessionParticipant.create({
      data: {
        sessionId: sessions[0].id,
        userId: users[0].id,
        progress: 75.5,
        completed: false
      }
    }),
    prisma.sessionParticipant.create({
      data: {
        sessionId: sessions[1].id,
        userId: users[1].id,
        progress: 100.0,
        completed: true,
        completedAt: new Date()
      }
    }),
    prisma.sessionParticipant.create({
      data: {
        sessionId: sessions[2].id,
        userId: users[2].id,
        progress: 30.0,
        completed: false
      }
    })
  ])

  console.log('✅ Enrolled users in sessions')

  console.log('🎉 Database seeding completed successfully!')
  console.log(`
  📊 Summary:
  - Users: ${users.length}
  - Hackathons: 0 (hosts will create them)
  - Events: 0 (hosts will create them)
  - Sessions: ${sessions.length}
  - Ideas: ${ideas.length}
  - Achievements: ${achievements.length}
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })