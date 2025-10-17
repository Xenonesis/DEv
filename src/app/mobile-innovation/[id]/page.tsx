'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Smartphone, Calendar, Users, Trophy, Code, MapPin, Star, 
  ExternalLink, Github, ArrowLeft, Clock, Target, Award,
  CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface MobileInnovation {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  techStack: string[];
  prize?: string;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl?: string;
  tags: string[];
  requirements?: string;
  judgingCriteria?: string;
  difficulty: string;
  host: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    image: string | null;
  };
  participants: number;
  submissions: number;
}

export default function MobileInnovationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [innovation, setInnovation] = useState<MobileInnovation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchInnovation();
    }
  }, [params.id]);

  const fetchInnovation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mobile-innovation/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setInnovation(data.data);
        setIsRegistered(data.isRegistered || false);
      } else {
        toast.error('Innovation not found');
        router.push('/mobile-innovation');
      }
    } catch (error) {
      console.error('Error fetching innovation:', error);
      toast.error('Failed to load innovation details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) {
      toast.error('Please sign in to register');
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/mobile-innovation/${params.id}/register`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered!');
        setIsRegistered(true);
        fetchInnovation();
      } else {
        toast.error(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRegistrationOpen = () => {
    if (!innovation) return false;
    return new Date(innovation.endDate) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading innovation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!innovation) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Innovation Not Found</h2>
            <p className="text-muted-foreground mb-4">The innovation you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/mobile-innovation')}>
              Back to Innovations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/mobile-innovation')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Innovations
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={getDifficultyColor(innovation.difficulty)}>
                      {innovation.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-cyan-200 text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20">
                      {innovation.platform}
                    </Badge>
                    <Badge variant="outline">{innovation.category}</Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {innovation.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {innovation.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {innovation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {innovation.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{innovation.participants}</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold">{innovation.submissions}</div>
                    <div className="text-xs text-muted-foreground">Submissions</div>
                  </CardContent>
                </Card>
                {innovation.prize && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="w-6 h-6 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{innovation.prize}</div>
                      <div className="text-xs text-muted-foreground">Prize</div>
                    </CardContent>
                  </Card>
                )}
                {innovation.maxParticipants && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{innovation.maxParticipants}</div>
                      <div className="text-xs text-muted-foreground">Max Spots</div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="judging">Judging</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {innovation.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            <Code className="w-3 h-3 mr-1" />
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {innovation.requirements || 'No specific requirements listed.'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="judging" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Judging Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {innovation.judgingCriteria || 'Judging criteria will be announced soon.'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start:</span>
                      <span className="font-medium">{formatDate(innovation.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">End:</span>
                      <span className="font-medium">{formatDate(innovation.endDate)}</span>
                    </div>
                  </div>

                  {isRegistered ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">You're registered!</span>
                    </div>
                  ) : isRegistrationOpen() ? (
                    <Button
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Register Now
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Registration Closed</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Host Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Hosted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <img
                      src={innovation.host.avatar || innovation.host.image || '/logo.png'}
                      alt={innovation.host.name || 'Host'}
                      className="w-12 h-12 rounded-full border-2 border-background"
                    />
                    <div>
                      <p className="font-medium">{innovation.host.name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">{innovation.host.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
