import { PrismaClient } from '@prisma/client'
import { HackathonStatus, EventType, SessionType, Difficulty, TeamRole, IdeaStatus } from '@prisma/client'

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

  // Create hackathons
  const hackathons = await Promise.all([
    prisma.hackathon.create({
      data: {
        title: 'AI Innovation Challenge 2024',
        description: 'Build innovative AI solutions to solve real-world problems',
        theme: 'Artificial Intelligence',
        prize: '$10,000 + Tech Package',
        maxParticipants: 100,
        startDate: new Date('2024-03-15T09:00:00Z'),
        endDate: new Date('2024-03-17T18:00:00Z'),
        status: HackathonStatus.UPCOMING,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        tags: JSON.stringify(['AI', 'Machine Learning', 'Innovation', 'Competition']),
        difficulty: Difficulty.INTERMEDIATE
      }
    }),
    prisma.hackathon.create({
      data: {
        title: 'Web3 & Blockchain Hackathon',
        description: 'Create decentralized applications for the future of web',
        theme: 'Blockchain Technology',
        prize: '$15,000 + Investment Opportunity',
        maxParticipants: 80,
        startDate: new Date('2024-04-01T10:00:00Z'),
        endDate: new Date('2024-04-03T20:00:00Z'),
        status: HackathonStatus.UPCOMING,
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
        tags: JSON.stringify(['Blockchain', 'Web3', 'DeFi', 'Smart Contracts']),
        difficulty: Difficulty.ADVANCED
      }
    }),
    prisma.hackathon.create({
      data: {
        title: 'Sustainability Tech Challenge',
        description: 'Develop technology solutions for environmental sustainability',
        theme: 'Green Technology',
        prize: '$8,000 + Mentorship Program',
        maxParticipants: 60,
        startDate: new Date('2024-02-20T09:00:00Z'),
        endDate: new Date('2024-02-22T17:00:00Z'),
        status: HackathonStatus.ONGOING,
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        tags: JSON.stringify(['Sustainability', 'Green Tech', 'Environment', 'IoT']),
        difficulty: Difficulty.BEGINNER
      }
    })
  ])

  console.log('✅ Created hackathons')

  // Create events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'React Advanced Patterns Workshop',
        description: 'Learn advanced React patterns and best practices',
        type: EventType.WORKSHOP,
        date: new Date('2024-02-25T14:00:00Z'),
        duration: 120,
        location: 'NeoFest Main Hall',
        isOnline: false,
        maxAttendees: 50,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        tags: JSON.stringify(['React', 'JavaScript', 'Frontend', 'Workshop'])
      }
    }),
    prisma.event.create({
      data: {
        title: 'AI in Industry Seminar',
        description: 'Explore how AI is transforming various industries',
        type: EventType.SEMINAR,
        date: new Date('2024-02-28T16:00:00Z'),
        duration: 90,
        location: 'Online',
        isOnline: true,
        maxAttendees: 200,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        tags: JSON.stringify(['AI', 'Industry', 'Innovation', 'Seminar'])
      }
    }),
    prisma.event.create({
      data: {
        title: 'Developer Networking Night',
        description: 'Connect with fellow developers and tech enthusiasts',
        type: EventType.NETWORKING,
        date: new Date('2024-03-01T18:00:00Z'),
        duration: 180,
        location: 'NeoFest Lounge',
        isOnline: false,
        maxAttendees: 100,
        imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8753a9bb8?w=800&h=400&fit=crop',
        tags: JSON.stringify(['Networking', 'Community', 'Social', 'Developers'])
      }
    })
  ])

  console.log('✅ Created events')

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

  // Register users for hackathons
  await Promise.all([
    prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathons[0].id,
        userId: users[0].id
      }
    }),
    prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathons[0].id,
        userId: users[1].id
      }
    }),
    prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathons[2].id,
        userId: users[2].id
      }
    }),
    prisma.hackathonParticipant.create({
      data: {
        hackathonId: hackathons[2].id,
        userId: users[3].id
      }
    })
  ])

  console.log('✅ Registered users for hackathons')

  // Register users for events
  await Promise.all([
    prisma.eventParticipant.create({
      data: {
        eventId: events[0].id,
        userId: users[0].id
      }
    }),
    prisma.eventParticipant.create({
      data: {
        eventId: events[0].id,
        userId: users[1].id
      }
    }),
    prisma.eventParticipant.create({
      data: {
        eventId: events[1].id,
        userId: users[2].id
      }
    }),
    prisma.eventParticipant.create({
      data: {
        eventId: events[2].id,
        userId: users[3].id
      }
    })
  ])

  console.log('✅ Registered users for events')

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
  - Hackathons: ${hackathons.length}
  - Events: ${events.length}
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