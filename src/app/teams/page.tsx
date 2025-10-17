'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Crown, Trophy, Plus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    avatar: string | null;
    level: number;
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  maxMembers: number;
  hackathonId: string;
  members: TeamMember[];
  projects: {
    id: string;
    title: string;
    isWinner: boolean;
  }[];
  createdAt: string;
}

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hackathonId: '',
    maxMembers: 4,
  });

  useEffect(() => {
    fetchTeams();
    fetchHackathons();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/community/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackathons = async () => {
    try {
      const response = await fetch('/api/hackathons');
      const data = await response.json();
      // Handle different response formats
      if (data.success && Array.isArray(data.data)) {
        setHackathons(data.data);
      } else if (Array.isArray(data)) {
        setHackathons(data);
      } else {
        setHackathons([]);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      setHackathons([]);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/community/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ name: '', description: '', hackathonId: '', maxMembers: 4 });
        fetchTeams();
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/community/teams/${teamId}/join`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchTeams();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const isUserInTeam = (team: Team) => {
    if (!session?.user?.email) return false;
    return team.members.some((m) => m.user.email === session.user.email);
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
              <Users className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Hackathon
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teams
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find talented teammates or create your own team for upcoming hackathons. Collaborate, compete, and win together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Create New Team</DialogTitle>
                      <DialogDescription>
                        Form a team for an upcoming hackathon and invite talented members
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Team Name</label>
                        <Input
                          placeholder="Enter team name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe your team's goals and what you're looking for..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Hackathon</label>
                        <Select
                          value={formData.hackathonId}
                          onValueChange={(value) => setFormData({ ...formData, hackathonId: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a hackathon" />
                          </SelectTrigger>
                          <SelectContent>
                            {hackathons.map((hackathon) => (
                              <SelectItem key={hackathon.id} value={hackathon.id}>
                                {hackathon.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Maximum Members</label>
                        <Input
                          type="number"
                          placeholder="Max team size"
                          value={formData.maxMembers}
                          onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                          className="h-11"
                          min="2"
                          max="10"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Create Team
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              {!session && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                >
                  Sign In to Create Team
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mb-6">
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Teams Yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to create a team and start collaborating!</p>
                {session && (
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Team
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Available <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Teams</span>
                </h2>
                <p className="text-muted-foreground">Join an existing team or create your own</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const leader = team.members.find((m) => m.role === 'LEADER');
              const isFull = team.members.length >= team.maxMembers;
              const userInTeam = isUserInTeam(team);
              const hasWins = team.projects.some((p) => p.isWinner);

              return (
                <Card 
                  key={team.id} 
                  className="group hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                            {team.name}
                          </CardTitle>
                          {hasWins && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                              <Trophy className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs font-medium text-yellow-600">Winner</span>
                            </div>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {team.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${isFull ? 'border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20' : 'border-green-200 text-green-600 bg-green-50 dark:bg-green-900/20'}`}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {team.members.length}/{team.maxMembers} Members
                      </Badge>
                      {isFull && (
                        <Badge className="bg-red-500 hover:bg-red-600">Team Full</Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    {/* Team Members */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Team Members</p>
                      <div className="space-y-2">
                        {team.members.map((member) => (
                          <div 
                            key={member.id} 
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="relative">
                              <img
                                src={member.user.avatar || member.user.image || '/logo.png'}
                                alt={member.user.name || 'User'}
                                className="w-8 h-8 rounded-full border-2 border-background"
                              />
                              {member.role === 'LEADER' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Crown className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{member.user.name}</p>
                              <p className="text-xs text-muted-foreground">Level {member.user.level}</p>
                            </div>
                            {member.role === 'LEADER' && (
                              <Badge variant="secondary" className="text-xs">
                                Leader
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {session && !userInTeam && !isFull && (
                      <Button
                        onClick={() => handleJoinTeam(team.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Team
                      </Button>
                    )}

                    {userInTeam && (
                      <div className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">You're in this team</span>
                      </div>
                    )}
                    
                    {!session && (
                      <Button
                        variant="outline"
                        className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                        disabled
                      >
                        Sign in to join
                      </Button>
                    )}
                  </CardContent>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Card>
              );
                })}
              </div>
            </>
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
