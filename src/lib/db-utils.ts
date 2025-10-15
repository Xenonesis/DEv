import { db } from './db'
import type { 
  User, 
  Hackathon, 
  Event, 
  LearningSession, 
  Idea, 
  Achievement,
  HackathonStatus,
  EventType,
  SessionType,
  Difficulty,
  IdeaStatus
} from '@prisma/client'

// Helper functions for JSON fields
export const parseJSON = <T>(jsonString: string | null): T => {
  if (!jsonString) return [] as T
  try {
    return JSON.parse(jsonString)
  } catch {
    return [] as T
  }
}

export const stringifyJSON = (data: any): string => {
  return JSON.stringify(data)
}

// User related functions
export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
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
      ideas: true,
      achievements: {
        include: {
          achievement: true
        }
      }
    }
  })

  if (user) {
    return {
      ...user,
      skills: parseJSON<string[]>(user.skills)
    }
  }
  return null
}

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: { email }
  })
}

export const createUser = async (userData: {
  email: string
  name?: string
  avatar?: string
  bio?: string
  skills?: string[]
}) => {
  return await db.user.create({
    data: {
      ...userData,
      skills: userData.skills ? stringifyJSON(userData.skills) : null
    }
  })
}

// Hackathon related functions
export const getAllHackathons = async (filters?: {
  status?: HackathonStatus
  difficulty?: Difficulty
  search?: string
}) => {
  const where: any = {}
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.difficulty) {
    where.difficulty = filters.difficulty
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { theme: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  const hackathons = await db.hackathon.findMany({
    where,
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          participants: true,
          projects: true
        }
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  })

  return hackathons.map(hackathon => ({
    ...hackathon,
    tags: parseJSON<string[]>(hackathon.tags)
  }))
}

export const createHackathon = async (hackathonData: {
  title: string
  description: string
  theme: string
  prize?: string
  maxParticipants?: number
  startDate: Date
  endDate: Date
  difficulty: Difficulty
  imageUrl?: string
  tags?: string[]
}) => {
  return await db.hackathon.create({
    data: {
      ...hackathonData,
      tags: hackathonData.tags ? stringifyJSON(hackathonData.tags) : null
    }
  })
}

export const getHackathonById = async (id: string) => {
  const hackathon = await db.hackathon.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              level: true,
              points: true
            }
          }
        }
      },
      projects: {
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true
                    }
                  }
                }
              }
            }
          },
          votes: true
        }
      }
    }
  })

  if (hackathon) {
    return {
      ...hackathon,
      tags: parseJSON<string[]>(hackathon.tags)
    }
  }
  return null
}

export const registerForHackathon = async (hackathonId: string, userId: string) => {
  return await db.hackathonParticipant.create({
    data: {
      hackathonId,
      userId
    }
  })
}

// Event related functions
export const getAllEvents = async (filters?: {
  type?: EventType
  isOnline?: boolean
  search?: string
}) => {
  const where: any = {}
  
  if (filters?.type) {
    where.type = filters.type
  }
  
  if (filters?.isOnline !== undefined) {
    where.isOnline = filters.isOnline
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  const events = await db.event.findMany({
    where,
    include: {
      _count: {
        select: {
          participants: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })

  return events.map(event => ({
    ...event,
    tags: parseJSON<string[]>(event.tags)
  }))
}

export const getEventById = async (id: string) => {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  if (event) {
    return {
      ...event,
      tags: parseJSON<string[]>(event.tags)
    }
  }
  return null
}

export const registerForEvent = async (eventId: string, userId: string) => {
  return await db.eventParticipant.create({
    data: {
      eventId,
      userId
    }
  })
}

// Session related functions
export const getAllSessions = async (filters?: {
  type?: SessionType
  difficulty?: Difficulty
  search?: string
}) => {
  const where: any = {}
  
  if (filters?.type) {
    where.type = filters.type
  }
  
  if (filters?.difficulty) {
    where.difficulty = filters.difficulty
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { instructor: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  const sessions = await db.learningSession.findMany({
    where,
    include: {
      _count: {
        select: {
          participants: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return sessions.map(session => ({
    ...session,
    tags: parseJSON<string[]>(session.tags),
    materials: parseJSON<string[]>(session.materials)
  }))
}

export const createSession = async (sessionData: {
  title: string
  description: string
  content: string
  type: SessionType
  difficulty: Difficulty
  duration: number
  instructor: string
  videoUrl?: string
  materials?: string[]
  tags?: string[]
}) => {
  return await db.learningSession.create({
    data: {
      ...sessionData,
      materials: sessionData.materials ? stringifyJSON(sessionData.materials) : null,
      tags: sessionData.tags ? stringifyJSON(sessionData.tags) : null
    }
  })
}

export const createEvent = async (eventData: {
  title: string
  description: string
  type: EventType
  date: Date
  duration: number
  location?: string
  isOnline: boolean
  maxAttendees?: number
  imageUrl?: string
  tags?: string[]
}) => {
  return await db.event.create({
    data: {
      ...eventData,
      tags: eventData.tags ? stringifyJSON(eventData.tags) : null
    }
  })
}

export const getSessionById = async (id: string) => {
  const session = await db.learningSession.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  if (session) {
    return {
      ...session,
      tags: parseJSON<string[]>(session.tags),
      materials: parseJSON<string[]>(session.materials)
    }
  }
  return null
}

export const enrollInSession = async (sessionId: string, userId: string) => {
  return await db.sessionParticipant.create({
    data: {
      sessionId,
      userId
    }
  })
}

export const updateSessionProgress = async (sessionId: string, userId: string, progress: number) => {
  const completed = progress >= 100
  return await db.sessionParticipant.update({
    where: {
      sessionId_userId: {
        sessionId,
        userId
      }
    },
    data: {
      progress,
      completed,
      completedAt: completed ? new Date() : null
    }
  })
}

// Idea related functions
export const getAllIdeas = async (filters?: {
  category?: string
  status?: IdeaStatus
  search?: string
}) => {
  const where: any = {}
  
  if (filters?.category) {
    where.category = filters.category
  }
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  const ideas = await db.idea.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return ideas.map(idea => ({
    ...idea,
    tags: parseJSON<string[]>(idea.tags)
  }))
}

export const getIdeaById = async (id: string) => {
  const idea = await db.idea.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (idea) {
    return {
      ...idea,
      tags: parseJSON<string[]>(idea.tags)
    }
  }
  return null
}

export const createIdea = async (ideaData: {
  title: string
  description: string
  category: string
  tags?: string[]
  authorId: string
}) => {
  return await db.idea.create({
    data: {
      ...ideaData,
      tags: ideaData.tags ? stringifyJSON(ideaData.tags) : null
    }
  })
}

export const voteForIdea = async (ideaId: string, userId: string) => {
  // First check if user has already voted
  const existingVote = await db.vote.findFirst({
    where: {
      userId,
      project: {
        ideas: {
          some: {
            id: ideaId
          }
        }
      }
    }
  })

  if (existingVote) {
    throw new Error('User has already voted for this idea')
  }

  // Increment vote count
  await db.idea.update({
    where: { id: ideaId },
    data: {
      votes: {
        increment: 1
      }
    }
  })

  return true
}

// Achievement related functions
export const getAllAchievements = async () => {
  return await db.achievement.findMany({
    orderBy: {
      points: 'desc'
    }
  })
}

export const getUserAchievements = async (userId: string) => {
  return await db.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true
    },
    orderBy: {
      unlockedAt: 'desc'
    }
  })
}

export const unlockAchievement = async (userId: string, achievementId: string) => {
  // Check if already unlocked
  const existing = await db.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId
      }
    }
  })

  if (existing) {
    return existing
  }

  // Get achievement to award points
  const achievement = await db.achievement.findUnique({
    where: { id: achievementId }
  })

  if (!achievement) {
    throw new Error('Achievement not found')
  }

  // Unlock achievement and award points
  const [userAchievement] = await Promise.all([
    db.userAchievement.create({
      data: {
        userId,
        achievementId
      }
    }),
    db.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: achievement.points
        }
      }
    })
  ])

  return userAchievement
}

// Dashboard statistics
export const getDashboardStats = async (userId: string) => {
  const [
    user,
    hackathonCount,
    eventCount,
    sessionCount,
    ideaCount,
    achievementCount
  ] = await Promise.all([
    getUserById(userId),
    db.hackathonParticipant.count({
      where: { userId }
    }),
    db.eventParticipant.count({
      where: { userId }
    }),
    db.sessionParticipant.count({
      where: { userId }
    }),
    db.idea.count({
      where: { authorId: userId }
    }),
    db.userAchievement.count({
      where: { userId }
    })
  ])

  return {
    user,
    stats: {
      hackathons: hackathonCount,
      events: eventCount,
      sessions: sessionCount,
      ideas: ideaCount,
      achievements: achievementCount
    }
  }
}