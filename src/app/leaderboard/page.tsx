'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top performers in the community</p>
        </div>

        <div className="flex justify-center mb-8">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">All Time</SelectItem>
              <SelectItem value="month" className="text-white">This Month</SelectItem>
              <SelectItem value="week" className="text-white">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No data available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 mt-8">
                  <CardContent className="pt-6 text-center">
                    <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <img
                      src={leaderboard[1].avatar || leaderboard[1].image || '/logo.png'}
                      alt={leaderboard[1].name || 'User'}
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-gray-400"
                    />
                    <h3 className="text-lg font-bold text-white mb-1">{leaderboard[1].name}</h3>
                    <Badge className="bg-gray-400 mb-2">2nd Place</Badge>
                    <div className="text-2xl font-bold text-white mb-1">{leaderboard[1].points.toLocaleString()}</div>
                    <p className="text-sm text-gray-400">points</p>
                  </CardContent>
                </Card>

                {/* 1st Place */}
                <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-600">
                  <CardContent className="pt-6 text-center">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                    <img
                      src={leaderboard[0].avatar || leaderboard[0].image || '/logo.png'}
                      alt={leaderboard[0].name || 'User'}
                      className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-500"
                    />
                    <h3 className="text-xl font-bold text-white mb-1">{leaderboard[0].name}</h3>
                    <Badge className="bg-yellow-500 mb-2">1st Place</Badge>
                    <div className="text-3xl font-bold text-white mb-1">{leaderboard[0].points.toLocaleString()}</div>
                    <p className="text-sm text-gray-300">points</p>
                  </CardContent>
                </Card>

                {/* 3rd Place */}
                <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-600 mt-8">
                  <CardContent className="pt-6 text-center">
                    <Medal className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                    <img
                      src={leaderboard[2].avatar || leaderboard[2].image || '/logo.png'}
                      alt={leaderboard[2].name || 'User'}
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-orange-600"
                    />
                    <h3 className="text-lg font-bold text-white mb-1">{leaderboard[2].name}</h3>
                    <Badge className="bg-orange-600 mb-2">3rd Place</Badge>
                    <div className="text-2xl font-bold text-white mb-1">{leaderboard[2].points.toLocaleString()}</div>
                    <p className="text-sm text-gray-400">points</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Rest of Leaderboard */}
            <div className="space-y-3">
              {leaderboard.slice(3).map((user) => (
                <Card key={user.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16">
                        {getRankIcon(user.rank)}
                      </div>

                      <img
                        src={user.avatar || user.image || '/logo.png'}
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-gray-600">
                            <Zap className="w-3 h-3 mr-1" />
                            Lv {user.level}
                          </Badge>
                          {user.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-gray-600">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-white">
                          {user.points.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-400">points</p>
                      </div>

                      <div className="flex gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-purple-400">{user.hackathonsCount}</div>
                          <p className="text-xs text-gray-500">Hackathons</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-yellow-400">{user.winsCount}</div>
                          <p className="text-xs text-gray-500">Wins</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-400">{user.achievementsCount}</div>
                          <p className="text-xs text-gray-500">Achievements</p>
                        </div>
                      </div>
                    </div>

                    {user.topAchievements.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                        <Award className="w-4 h-4 text-gray-400" />
                        <div className="flex gap-2">
                          {user.topAchievements.map((achievement, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-gray-600">
                              {achievement.icon} {achievement.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
