'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Trophy, Brain, Target, Database, BarChart3, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';

export default function AIChallengeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/ai-challenges?id=${params.id}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setChallenge(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [params.id]);

  const handleRegister = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/ai-challenges/${params.id}/participate`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Successfully registered for the challenge!');
        window.location.reload();
      } else {
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for challenge');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
          <Button onClick={() => router.push('/ai-challenges')}>
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/ai-challenges')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {challenge.difficulty}
                  </Badge>
                  {challenge.featured && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl mb-2">{challenge.title}</CardTitle>
                <CardDescription className="text-base">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="font-medium">{new Date(challenge.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">End Date</div>
                      <div className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-medium">{challenge.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Metric</div>
                      <div className="font-medium">{challenge.evaluationMetric || 'TBD'}</div>
                    </div>
                  </div>
                </div>

                {challenge.dataset && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">Dataset</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.dataset}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Prize Pool</span>
                  </div>
                  <span className="font-bold text-lg text-blue-600">${challenge.prizePool.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <span className="font-medium">{challenge.participants}/{challenge.maxParticipants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">Submissions</span>
                  </div>
                  <span className="font-medium">{challenge.submissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-medium">{challenge.rating.toFixed(1)} ⭐</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleRegister}
                  disabled={registering || new Date() > new Date(challenge.registrationDeadline)}
                >
                  {registering ? 'Registering...' : new Date() > new Date(challenge.registrationDeadline) ? 'Registration Closed' : 'Join Challenge'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Deadline: {new Date(challenge.registrationDeadline).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{challenge.organizer}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
