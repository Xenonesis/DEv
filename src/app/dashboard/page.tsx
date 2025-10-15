'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy, Calendar, Clock, Users, Target, TrendingUp, Award, BookOpen, Star, ChevronRight, Activity, BarChart3, Medal, Flag, Sparkles, Zap, Brain, Rocket, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';

interface DashboardStats {
  totalParticipations: number;
  totalWins: number;
  totalPrizes: number;
  upcomingEvents: number;
  completedSessions: number;
  skillsLearned: number;
  ranking: number;
  points: number;
}

interface Activity {
  id: string;
  type: 'hackathon' | 'event' | 'session';
  title: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'won' | 'participated';
  date: string;
  points?: number;
  prize?: number;
  progress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
}

interface Skill {
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  projects: number;
}

const mockDashboardStats: DashboardStats = {
  totalParticipations: 12,
  totalWins: 3,
  totalPrizes: 8500,
  upcomingEvents: 4,
  completedSessions: 8,
  skillsLearned: 15,
  ranking: 42,
  points: 2450
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'hackathon',
    title: 'AI Innovation Challenge 2024',
    status: 'won',
    date: '2024-03-10',
    points: 500,
    prize: 5000
  },
  {
    id: '2',
    type: 'event',
    title: 'Tech Innovation Summit 2024',
    status: 'upcoming',
    date: '2024-03-20',
    points: 100
  },
  {
    id: '3',
    type: 'session',
    title: 'Complete React Development Bootcamp',
    status: 'ongoing',
    date: '2024-03-15',
    progress: 45,
    points: 200
  },
  {
    id: '4',
    type: 'hackathon',
    title: 'Web3 Hackathon',
    status: 'participated',
    date: '2024-03-05',
    points: 150
  },
  {
    id: '5',
    type: 'session',
    title: 'Machine Learning Fundamentals',
    status: 'completed',
    date: '2024-02-28',
    points: 300
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Win',
    description: 'Win your first hackathon',
    icon: '🏆',
    unlocked: true,
    unlockedDate: '2024-03-10',
    progress: 1,
    maxProgress: 1
  },
  {
    id: '2',
    title: 'Hackathon Enthusiast',
    description: 'Participate in 5 hackathons',
    icon: '💻',
    unlocked: true,
    unlockedDate: '2024-03-05',
    progress: 5,
    maxProgress: 5
  },
  {
    id: '3',
    title: 'Learning Machine',
    description: 'Complete 10 sessions',
    icon: '📚',
    unlocked: false,
    progress: 8,
    maxProgress: 10
  },
  {
    id: '4',
    title: 'Rising Star',
    description: 'Reach top 50 in rankings',
    icon: '⭐',
    unlocked: true,
    unlockedDate: '2024-03-12',
    progress: 42,
    maxProgress: 50
  },
  {
    id: '5',
    title: 'Prize Winner',
    description: 'Win $10,000+ in total prizes',
    icon: '💰',
    unlocked: false,
    progress: 8500,
    maxProgress: 10000
  },
  {
    id: '6',
    title: 'Skill Master',
    description: 'Learn 20 different skills',
    icon: '🎯',
    unlocked: false,
    progress: 15,
    maxProgress: 20
  }
];

const mockSkills: Skill[] = [
  { name: 'React', level: 4, experience: 750, maxExperience: 1000, projects: 6 },
  { name: 'Machine Learning', level: 3, experience: 450, maxExperience: 800, projects: 3 },
  { name: 'Cloud Computing', level: 2, experience: 200, maxExperience: 500, projects: 2 },
  { name: 'UI/UX Design', level: 3, experience: 600, maxExperience: 800, projects: 4 },
  { name: 'DevOps', level: 2, experience: 150, maxExperience: 500, projects: 1 }
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const contentRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, statsRef.current, contentRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'upcoming': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'participated': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hackathon': return <Trophy className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'session': return <BookOpen className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'text-purple-600';
    if (level >= 3) return 'text-blue-600';
    if (level >= 2) return 'text-green-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 blur-sm"
              style={{
                width: Math.random() * 150 + 50 + 'px',
                height: Math.random() * 150 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex flex-col lg:flex-row items-center justify-between transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-purple-200/50">
                <Rocket className="animate-pulse" size={18} />
                <span className="font-semibold">Welcome Back!</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Competition 
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                  Dashboard
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
                Track your progress, achievements, and upcoming competitions. Your journey to tech excellence starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center">
                    View Competitions
                    <ChevronRight className="ml-2" size={20} />
                  </span>
                </Button>
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors">
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-3 animate-scale-pulse shadow-xl">
                  <Medal className="text-white" size={32} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  #{stats.ranking}
                </div>
                <div className="text-muted-foreground font-medium">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-3 animate-scale-pulse shadow-xl">
                  <Zap className="text-white" size={32} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {stats.points}
                </div>
                <div className="text-muted-foreground font-medium">Total Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Grid */}
      <section 
        ref={statsRef}
        id="stats" 
        className="py-12 bg-muted/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.3s' }}>
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Participations</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.totalParticipations}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Wins</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.totalWins}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Prize Money</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                      ${stats.totalPrizes.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Skills Learned</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.skillsLearned}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section 
        ref={contentRef}
        id="content" 
        className="py-12 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300">
                Activities
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300">
                Skills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group/item"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                              {getTypeIcon(activity.type)}
                            </div>
                            <div>
                              <div className="font-medium text-sm group-hover/item:text-purple-600 transition-colors">
                                {activity.title}
                              </div>
                              <div className="text-xs text-muted-foreground">{formatDate(activity.date)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(activity.status)} border-0`}>
                              {activity.status}
                            </Badge>
                            {activity.points && (
                              <div className="text-sm font-medium text-purple-600">+{activity.points}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.filter(a => a.status === 'upcoming').slice(0, 5).map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group/item"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                              {getTypeIcon(activity.type)}
                            </div>
                            <div>
                              <div className="font-medium text-sm group-hover/item:text-purple-600 transition-colors">
                                {activity.title}
                              </div>
                              <div className="text-xs text-muted-foreground">{formatDate(activity.date)}</div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="hover:bg-purple-50 hover:border-purple-300 transition-colors"
                          >
                            View
                          </Button>
                        </div>
                      ))}
                      {activities.filter(a => a.status === 'upcoming').length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          No upcoming events
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Overview */}
              <Card className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Hackathon Progress</span>
                        <span className="text-purple-600 font-semibold">3/5 Goals</span>
                      </div>
                      <Progress value={60} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Learning Progress</span>
                        <span className="text-blue-600 font-semibold">8/10 Sessions</span>
                      </div>
                      <Progress value={80} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Achievement Progress</span>
                        <span className="text-green-600 font-semibold">4/6 Unlocked</span>
                      </div>
                      <Progress value={67} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    All Activities
                  </CardTitle>
                  <CardDescription>Your complete competition and learning history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group/item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                            {getTypeIcon(activity.type)}
                          </div>
                          <div>
                            <div className="font-medium group-hover/item:text-purple-600 transition-colors">
                              {activity.title}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(activity.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(activity.status)} border-0`}>
                            {activity.status}
                          </Badge>
                          {activity.points && (
                            <div className="text-sm font-medium text-purple-600">+{activity.points} pts</div>
                          )}
                          {activity.prize && (
                            <div className="text-sm font-medium text-green-600">${activity.prize}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={achievement.id} 
                    className={`group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative ${
                      achievement.unlocked ? '' : 'opacity-75'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                          Unlocked
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className={`text-4xl mb-2 ${achievement.unlocked ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                      {achievement.unlockedDate && (
                        <div className="text-xs text-muted-foreground text-center mt-2">
                          Unlocked on {formatDate(achievement.unlockedDate)}
                        </div>
                      )}
                    </CardContent>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <Card 
                    key={skill.name} 
                    className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                          {skill.name}
                        </CardTitle>
                        <div className={`text-2xl font-bold ${getLevelColor(skill.level)}`}>
                          Lv.{skill.level}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Experience</span>
                            <span>{skill.experience}/{skill.maxExperience} XP</span>
                          </div>
                          <Progress 
                            value={(skill.experience / skill.maxExperience) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Projects</span>
                          <span className="font-medium">{skill.projects}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(120deg); 
          }
          66% { 
            transform: translateY(10px) rotate(240deg); 
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}