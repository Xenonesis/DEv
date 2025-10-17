'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  avatar: string | null;
  level: number;
  points: number;
  bio: string | null;
  skills: string[];
  hackathonsCount: number;
  achievementsCount: number;
  winsCount: number;
  topAchievements: {
    title: string;
    icon: string;
  }[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/community/leaderboard?timeframe=${timeframe}`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-orange-600" />;
    return <span className="text-2xl font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 blur-sm"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-xl">
              <Trophy className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Global
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Top performers in the community. Compete, learn, and climb the ranks!
            </p>
            <div className="flex justify-center">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[240px] h-11 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mb-6">
                  <Trophy className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Data Available</h3>
                <p className="text-muted-foreground">Check back later for leaderboard rankings!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* 2nd Place */}
                  <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-0 overflow-hidden relative md:mt-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300/20 to-transparent"></div>
                    <CardContent className="pt-8 text-center relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full mb-4 shadow-lg">
                        <Medal className="w-8 h-8 text-white" />
                      </div>
                      <img
                        src={leaderboard[1].avatar || leaderboard[1].image || '/logo.png'}
                        alt={leaderboard[1].name || 'User'}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-400 shadow-xl"
                      />
                      <h3 className="text-xl font-bold text-foreground mb-2">{leaderboard[1].name}</h3>
                      <Badge className="bg-slate-500 hover:bg-slate-600 mb-3 text-white">2nd Place</Badge>
                      <div className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent mb-1">
                        {leaderboard[1].points.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">points</p>
                    </CardContent>
                  </Card>

                  {/* 1st Place */}
                  <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 border-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                    <CardContent className="pt-8 text-center relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mb-4 shadow-2xl animate-pulse">
                        <Trophy className="w-10 h-10 text-white" />
                      </div>
                      <img
                        src={leaderboard[0].avatar || leaderboard[0].image || '/logo.png'}
                        alt={leaderboard[0].name || 'User'}
                        className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-yellow-500 shadow-2xl"
                      />
                      <h3 className="text-2xl font-bold text-foreground mb-2">{leaderboard[0].name}</h3>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 mb-3 text-white text-sm">🏆 Champion</Badge>
                      <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-1">
                        {leaderboard[0].points.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">points</p>
                    </CardContent>
                  </Card>

                  {/* 3rd Place */}
                  <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 border-0 overflow-hidden relative md:mt-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 to-transparent"></div>
                    <CardContent className="pt-8 text-center relative z-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 shadow-lg">
                        <Medal className="w-8 h-8 text-white" />
                      </div>
                      <img
                        src={leaderboard[2].avatar || leaderboard[2].image || '/logo.png'}
                        alt={leaderboard[2].name || 'User'}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-500 shadow-xl"
                      />
                      <h3 className="text-xl font-bold text-foreground mb-2">{leaderboard[2].name}</h3>
                      <Badge className="bg-orange-500 hover:bg-orange-600 mb-3 text-white">3rd Place</Badge>
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-1">
                        {leaderboard[2].points.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">points</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Rest of Leaderboard */}
              <div className="space-y-4">
                {leaderboard.slice(3).map((user, index) => (
                  <Card 
                    key={user.id} 
                    className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="py-5 relative z-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          {getRankIcon(user.rank)}
                        </div>

                        <img
                          src={user.avatar || user.image || '/logo.png'}
                          alt={user.name || 'User'}
                          className="w-14 h-14 rounded-full border-2 border-background shadow-lg"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors">{user.name}</h3>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Lv {user.level}
                            </Badge>
                            {user.skills.slice(0, 2).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 sm:gap-8">
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Points</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              {user.points.toLocaleString()}
                            </div>
                          </div>

                          <div className="hidden md:flex gap-6">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-purple-600">{user.hackathonsCount}</div>
                              <p className="text-xs text-muted-foreground">Hackathons</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-yellow-600">{user.winsCount}</div>
                              <p className="text-xs text-muted-foreground">Wins</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{user.achievementsCount}</div>
                              <p className="text-xs text-muted-foreground">Achievements</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {user.topAchievements.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                          <Award className="w-4 h-4 text-purple-600" />
                          <div className="flex gap-2 flex-wrap">
                            {user.topAchievements.map((achievement, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {achievement.icon} {achievement.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom animations */}
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
