'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Tag,
  User,
  CheckCircle2,
  Sparkles,
  Award,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  theme: string;
  prize?: string;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl?: string;
  tags: string[];
  difficulty: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    fetchHackathon();
  }, [params.id]);

  const fetchHackathon = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/hackathons/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setHackathon(data.data);
        // Check if current user is registered or is the host
        if (session?.user?.email) {
          const userResponse = await fetch('/api/user/profile');
          const userData = await userResponse.json();
          if (userData.user) {
            const registered = data.data.participants.some(
              (p: any) => p.user.id === userData.user.id
            );
            setIsRegistered(registered);
            
            // Check if user is the host
            setIsHost(data.data.hostId === userData.user.id);
          }
        }
      } else {
        toast.error('Hackathon not found');
        router.push('/hackathons');
      }
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      toast.error('Failed to load hackathon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) {
      toast.error('Please sign in to register');
      router.push('/auth/signin');
      return;
    }

    try {
      setIsRegistering(true);
      const response = await fetch(`/api/hackathons/${params.id}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered for hackathon!');
        setIsRegistered(true);
        fetchHackathon(); // Refresh to update participant count
      } else {
        toast.error(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register for hackathon');
    } finally {
      setIsRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ONGOING':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'EXPERT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading hackathon details...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl mb-4">Hackathon not found</p>
            <Button onClick={() => router.push('/hackathons')}>
              Back to Hackathons
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/hackathons"
            className="inline-flex items-center text-purple-500 hover:text-purple-400 dark:text-purple-400 dark:hover:text-purple-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hackathons
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="pt-6">
                  {hackathon.imageUrl && (
                    <div className="relative mb-6 group">
                      <img
                        src={hackathon.imageUrl}
                        alt={hackathon.title}
                        className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{hackathon.title}</h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <p className="text-lg font-medium text-muted-foreground">{hackathon.theme}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Badge className={`${getStatusColor(hackathon.status)} text-sm px-3 py-1`}>
                        {hackathon.status}
                      </Badge>
                      <Badge className={`${getDifficultyColor(hackathon.difficulty)} text-sm px-3 py-1`}>
                        {hackathon.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {hackathon.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                        <p className="font-semibold text-sm">
                          {new Date(hackathon.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">End Date</p>
                        <p className="font-semibold text-sm">
                          {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Users className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">Participants</p>
                        <p className="font-semibold text-sm">
                          {hackathon.participants.length}
                          {hackathon.maxParticipants && ` / ${hackathon.maxParticipants}`}
                        </p>
                        {hackathon.maxParticipants && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-gradient-to-r from-green-600 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${(hackathon.participants.length / hackathon.maxParticipants) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {hackathon.prize && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Prize</p>
                          <p className="font-semibold text-sm">{hackathon.prize}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    About This Hackathon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {hackathon.description}
                  </p>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Participants ({hackathon.participants.length})
                  </CardTitle>
                  <CardDescription>
                    People who have registered for this hackathon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hackathon.participants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hackathon.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                          <Avatar>
                            <AvatarImage src={participant.user.avatar} />
                            <AvatarFallback>
                              {participant.user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{participant.user.name}</p>
                            <p className="text-xs text-muted-foreground">Participant</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No participants yet. Be the first to register!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="border-0 shadow-lg sticky top-20">
                <CardHeader>
                  <CardTitle className="text-center">Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isHost ? (
                    <div className="text-center py-4">
                      <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                      <p className="font-semibold text-purple-600 mb-2">
                        You're the Host
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        You created this hackathon
                      </p>
                      <Link href="/host">
                        <Button variant="outline" className="w-full">
                          Manage Hackathon
                        </Button>
                      </Link>
                    </div>
                  ) : isRegistered ? (
                    <div className="text-center py-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="font-semibold text-green-600 mb-2">
                        You're Registered!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You're all set for this hackathon
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Join this hackathon and showcase your skills!
                      </p>
                      <Button
                        onClick={handleRegister}
                        disabled={isRegistering || hackathon.status !== 'UPCOMING'}
                        className="w-full"
                      >
                        {isRegistering ? 'Registering...' : 'Register Now'}
                      </Button>
                      {hackathon.status !== 'UPCOMING' && (
                        <p className="text-xs text-center text-muted-foreground">
                          Registration is only available for upcoming hackathons
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Host Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Hosted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={hackathon.host.avatar} />
                      <AvatarFallback>
                        {hackathon.host.name?.charAt(0).toUpperCase() || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{hackathon.host.name}</p>
                      <p className="text-sm text-muted-foreground">Event Host</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Share</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Hackathon
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
