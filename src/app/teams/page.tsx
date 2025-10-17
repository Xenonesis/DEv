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
      setHackathons(data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Teams</h1>
            <p className="text-gray-400">Find or create teams for hackathons</p>
          </div>
          {session && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Team</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Form a team for a hackathon
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Team name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Team description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Select
                      value={formData.hackathonId}
                      onValueChange={(value) => setFormData({ ...formData, hackathonId: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select hackathon" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {hackathons.map((hackathon) => (
                          <SelectItem key={hackathon.id} value={hackathon.id} className="text-white">
                            {hackathon.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max members"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                      min="2"
                      max="10"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Team
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading teams...</div>
        ) : teams.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No teams yet</p>
              <p className="text-gray-500 mt-2">Create the first team!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const leader = team.members.find((m) => m.role === 'LEADER');
              const isFull = team.members.length >= team.maxMembers;
              const userInTeam = isUserInTeam(team);
              const hasWins = team.projects.some((p) => p.isWinner);

              return (
                <Card key={team.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                      {hasWins && <Trophy className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <CardDescription className="text-gray-400">
                      {team.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-gray-300 border-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {team.members.length}/{team.maxMembers}
                        </Badge>
                        {isFull && (
                          <Badge className="bg-red-500">Full</Badge>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-2">Team Members:</p>
                        <div className="space-y-2">
                          {team.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                              <img
                                src={member.user.avatar || member.user.image || '/logo.png'}
                                alt={member.user.name || 'User'}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-300">{member.user.name}</span>
                              {member.role === 'LEADER' && (
                                <Crown className="w-3 h-3 text-yellow-500" />
                              )}
                              <Badge variant="outline" className="text-xs border-gray-600">
                                Lv {member.user.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {session && !userInTeam && !isFull && (
                        <Button
                          onClick={() => handleJoinTeam(team.id)}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join Team
                        </Button>
                      )}

                      {userInTeam && (
                        <Badge className="w-full justify-center bg-green-600">
                          You're in this team
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
