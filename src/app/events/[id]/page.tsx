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
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Tag,
  User,
  CheckCircle2,
  Sparkles,
  Award,
  Loader2,
  Video,
  MapPin as MapPinIcon,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  category: string;
  type: 'conference' | 'workshop' | 'meetup' | 'webinar' | 'summit';
  price: number;
  currency: string;
  maxAttendees: number;
  currentAttendees: number;
  tags: string[];
  organizer: string;
  speakers: string[];
  rating: number;
  views: number;
  imageUrl?: string;
  featured: boolean;
  hostId: string;
  registrations: Array<{
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

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setEvent(data.data);
        // Check if current user is registered or is the host
        if (session?.user?.email) {
          const userResponse = await fetch('/api/user/profile');
          const userData = await userResponse.json();
          if (userData.user) {
            const registered = data.data.registrations?.some(
              (r: any) => r.user.id === userData.user.id
            );
            setIsRegistered(registered);
            
            // Check if user is the host
            setIsHost(data.data.hostId === userData.user.id);
          }
        }
      } else {
        toast.error('Event not found');
        router.push('/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
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
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully registered for event!');
        setIsRegistered(true);
        fetchEvent(); // Refresh to update attendee count
      } else {
        toast.error(data.error || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const getTypeColor = (type: string) => {
    const upperType = type?.toUpperCase();
    switch (upperType) {
      case 'WORKSHOP':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SEMINAR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'NETWORKING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'COMPETITION':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SOCIAL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'offline':
        return <MapPinIcon className="w-5 h-5 text-purple-600" />;
      case 'hybrid':
        return (
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4 text-purple-600" />
            <MapPinIcon className="w-4 h-4 text-purple-600" />
          </div>
        );
      default:
        return <MapPinIcon className="w-5 h-5 text-purple-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventFull = () => {
    return !!event && event.currentAttendees >= event.maxAttendees;
  };

  const isEventPast = () => {
    return !!event && new Date(event.date) < new Date();
  };

  const handleShare = async () => {
    if (!event) return;

    const shareData = {
      title: event.title,
      text: event.description,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Event shared successfully');
        return;
      }

      if (navigator.clipboard && shareData.url) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Event link copied to clipboard');
        return;
      }

      toast.error('Sharing is not supported on this device');
    } catch (error) {
      console.error('Error sharing event:', error);
      toast.error('Failed to share event');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading event details...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl mb-4">Event not found</p>
            <Button onClick={() => router.push('/events')}>
              Back to Events
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
          <Button
            asChild
            variant="outline"
            className="inline-flex w-auto items-center gap-2 mb-6 px-4 py-2 text-sm font-medium bg-muted/60 text-foreground hover:bg-muted transition-colors"
          >
            <Link href="/events">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="pt-6">
                  {event.imageUrl && (
                    <div className="relative mb-6 group">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                      {event.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {event.title}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <p className="text-lg font-medium text-muted-foreground">{event.category}</p>
                      </div>
                    </div>
                    <Badge className={`${getTypeColor(event.type)} text-sm px-3 py-1`}>
                      {event.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Date</p>
                        <p className="font-semibold text-sm">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Time</p>
                        <p className="font-semibold text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      {getModeIcon(event.mode)}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Mode</p>
                        <p className="font-semibold text-sm capitalize">{event.mode}</p>
                        {event.mode !== 'online' && (
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg transition-all hover:scale-105 hover:shadow-md">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">Attendees</p>
                        <p className="font-semibold text-sm">
                          {event.currentAttendees} / {event.maxAttendees}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-orange-600 to-yellow-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    About This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Speakers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.speakers.map((speaker, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {speaker}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attendees */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Attendees ({event.currentAttendees})
                  </CardTitle>
                  <CardDescription>
                    People who have registered for this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.registrations && event.registrations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.registrations.map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                          <Avatar>
                            <AvatarImage src={registration.user.avatar} />
                            <AvatarFallback>
                              {registration.user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{registration.user.name}</p>
                            <p className="text-xs text-muted-foreground">Attendee</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No attendees yet. Be the first to register!
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
                  <CardTitle className="text-center">
                    {event.price === 0 ? 'Free Event' : `${event.currency}${event.price}`}
                  </CardTitle>
                  {event.price > 0 && (
                    <CardDescription className="text-center">Registration Fee</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isHost ? (
                    <div className="text-center py-4">
                      <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                      <p className="font-semibold text-purple-600 mb-2">
                        You're the Host
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        You created this event
                      </p>
                      <Link href="/host">
                        <Button variant="outline" className="w-full">
                          Manage Event
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
                        You're all set for this event
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {event.price === 0
                          ? 'Register for free and join this amazing event!'
                          : 'Secure your spot at this event'}
                      </p>
                      <Button
                        onClick={handleRegister}
                        disabled={isRegistering || isEventFull() || isEventPast()}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isRegistering
                          ? 'Registering...'
                          : isEventFull()
                          ? 'Event Full'
                          : isEventPast()
                          ? 'Event Ended'
                          : 'Register Now'}
                      </Button>
                      {(isEventFull() || isEventPast()) && (
                        <p className="text-xs text-center text-muted-foreground">
                          {isEventFull()
                            ? 'This event has reached maximum capacity'
                            : 'This event has already ended'}
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Host Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Organized By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={event.host?.avatar} />
                      <AvatarFallback>
                        {event.organizer?.charAt(0).toUpperCase() || 'O'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{event.organizer}</p>
                      <p className="text-sm text-muted-foreground">Event Organizer</p>
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
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
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
