'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Trophy, Calendar, BookOpen, Lightbulb, Users, Edit, UserCog } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProfileEditDialog from '@/components/ProfileEditDialog'
import { toast } from 'sonner'

interface ProfileData {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    image?: string
    bio?: string
    skills?: string[]
    level: number
    points: number
    role: string
    isHostApproved: boolean
    createdAt: string
  }
  stats: {
    hackathonsJoined: number
    eventsAttended: number
    sessionsCompleted: number
    totalSessions: number
    ideasPosted: number
    teamsJoined: number
    achievementsUnlocked: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    points: number
    unlockedAt: string
  }>
  recentActivity: {
    hackathons: Array<{
      id: string
      title: string
      status: string
      registeredAt: string
    }>
    events: Array<{
      id: string
      title: string
      date: string
      registeredAt: string
    }>
    sessions: Array<{
      id: string
      title: string
      progress: number
      completed: boolean
    }>
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isSwitchingRole, setIsSwitchingRole] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/profile')

      if (response.status === 401) {
        // User is not authenticated, redirect to signin
        router.push('/auth/signin')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const handleRoleSwitch = async (newRole: 'USER' | 'HOST') => {
    try {
      setIsSwitchingRole(true)
      const response = await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Switched to ${newRole} mode successfully!`)
        // Refresh profile data
        await fetchProfile()
        // Redirect based on role
        if (newRole === 'HOST') {
          router.push('/host')
        }
      } else {
        toast.error(data.error || 'Failed to switch role')
      }
    } catch (error) {
      console.error('Error switching role:', error)
      toast.error('Failed to switch role')
    } finally {
      setIsSwitchingRole(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session || !profileData) {
    return null
  }

  const { user, stats, achievements, recentActivity } = profileData

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || user.image || ''} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>

                  {user.bio && (
                    <p className="text-sm">{user.bio}</p>
                  )}

                  <div className="flex items-center flex-wrap gap-2">
                    <Badge variant="secondary">Level {user.level}</Badge>
                    <Badge variant="outline">{user.points} Points</Badge>
                    {user.role === 'HOST' && <Badge className="bg-purple-600">Host</Badge>}
                    {user.role === 'ADMIN' && <Badge className="bg-red-600">Admin</Badge>}
                  </div>

                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role Switching Card - Only show for non-admin users */}
          {user.role !== 'ADMIN' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="w-5 h-5 mr-2" />
                  Role Settings
                </CardTitle>
                <CardDescription>
                  Switch between Participant and Host modes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose your current role to access different features:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Participant Mode */}
                    <div className={`p-4 border-2 rounded-lg transition-all ${user.role === 'USER'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                        : 'border-border hover:border-purple-300'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">Participant Mode</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Browse and join hackathons
                          </p>
                        </div>
                        {user.role === 'USER' && (
                          <Badge className="bg-purple-600">Active</Badge>
                        )}
                      </div>
                      <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
                        <li>• Browse all hackathons</li>
                        <li>• Register for events</li>
                        <li>• Submit projects</li>
                        <li>• Join teams</li>
                      </ul>
                      {user.role !== 'USER' && (
                        <Button
                          onClick={() => handleRoleSwitch('USER')}
                          disabled={isSwitchingRole}
                          variant="outline"
                          className="w-full"
                        >
                          {isSwitchingRole ? 'Switching...' : 'Switch to Participant'}
                        </Button>
                      )}
                    </div>

                    {/* Host Mode */}
                    <div className={`p-4 border-2 rounded-lg transition-all ${user.role === 'HOST'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                        : 'border-border hover:border-purple-300'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">Host Mode</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create and manage hackathons
                          </p>
                        </div>
                        {user.role === 'HOST' && (
                          <Badge className="bg-purple-600">Active</Badge>
                        )}
                      </div>
                      <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
                        <li>• Create hackathons</li>
                        <li>• Manage participants</li>
                        <li>• Edit event details</li>
                        <li>• View analytics</li>
                      </ul>
                      {user.role !== 'HOST' && (
                        <Button
                          onClick={() => handleRoleSwitch('HOST')}
                          disabled={isSwitchingRole}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          {isSwitchingRole ? 'Switching...' : 'Switch to Host'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {user.role === 'HOST' && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Tip:</strong> As a host, you can access the{' '}
                        <Link href="/host" className="underline font-semibold">
                          Host Dashboard
                        </Link>{' '}
                        to manage your hackathons.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stats.hackathonsJoined}</div>
                  <p className="text-sm text-muted-foreground">Hackathons Joined</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.eventsAttended}</div>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{stats.sessionsCompleted}</div>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-600">{stats.ideasPosted}</div>
                  <p className="text-sm text-muted-foreground">Ideas Posted</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                  <div className="text-2xl font-bold text-indigo-600">{stats.teamsJoined}</div>
                  <p className="text-sm text-muted-foreground">Teams Joined</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{stats.achievementsUnlocked}</div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your badges and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{achievement.points} points</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No achievements yet. Start participating in events to earn badges!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest participation and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentActivity.hackathons.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recent Hackathons</h4>
                  <div className="space-y-2">
                    {recentActivity.hackathons.map((hackathon) => (
                      <div key={hackathon.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{hackathon.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(hackathon.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={hackathon.status === 'ONGOING' ? 'default' : 'secondary'}>
                          {hackathon.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentActivity.events.length > 0 && (
                <>
                  {recentActivity.hackathons.length > 0 && <Separator />}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Events</h4>
                    <div className="space-y-2">
                      {recentActivity.events.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {recentActivity.sessions.length > 0 && (
                <>
                  {(recentActivity.hackathons.length > 0 || recentActivity.events.length > 0) && <Separator />}
                  <div>
                    <h4 className="font-semibold mb-3">Learning Sessions</h4>
                    <div className="space-y-2">
                      {recentActivity.sessions.map((session) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{session.title}</p>
                            {session.completed && <Badge variant="default">Completed</Badge>}
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${session.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{session.progress}% complete</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {recentActivity.hackathons.length === 0 &&
                recentActivity.events.length === 0 &&
                recentActivity.sessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity. Start exploring and participating!</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentData={{
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          skills: user.skills
        }}
        onSuccess={fetchProfile}
      />
    </div>
  )
}