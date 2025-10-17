'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Trophy, Code, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';

export default function WebContestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(`/api/web-contests?id=${params.id}`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setContest(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching contest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [params.id]);

  const handleRegister = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/web-contests/${params.id}/participate`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        alert('Successfully registered for the contest!');
        window.location.reload();
      } else {
        alert(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register for contest');
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

  if (!contest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Contest not found</h1>
          <Button onClick={() => router.push('/web-contests')}>
            Back to Contests
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
          onClick={() => router.push('/web-contests')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contests
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {contest.difficulty}
                  </Badge>
                  {contest.featured && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl mb-2">{contest.title}</CardTitle>
                <CardDescription className="text-base">{contest.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {contest.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date</div>
                      <div className="font-medium">{new Date(contest.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">End Date</div>
                      <div className="font-medium">{new Date(contest.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Theme</div>
                      <div className="font-medium">{contest.theme}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-medium">Web Development</div>
                    </div>
                  </div>
                </div>

                {contest.requirements && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold">Requirements</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{contest.requirements}</p>
                  </div>
                )}

                {contest.judgingCriteria && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold">Judging Criteria</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{contest.judgingCriteria}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contest Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">Prize Pool</span>
                  </div>
                  <span className="font-bold text-lg text-purple-600">${contest.prizePool.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <span className="font-medium">{contest.participants}/{contest.maxParticipants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-pink-500" />
                    <span className="text-sm">Submissions</span>
                  </div>
                  <span className="font-medium">{contest.submissions}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleRegister}
                  disabled={registering || new Date() > new Date(contest.registrationDeadline)}
                >
                  {registering ? 'Registering...' : new Date() > new Date(contest.registrationDeadline) ? 'Registration Closed' : 'Join Contest'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Deadline: {new Date(contest.registrationDeadline).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{contest.organizer}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
