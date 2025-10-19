"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  tags: string | null;
  difficulty: string;
  host: {
    name: string | null;
    image: string | null;
  };
  participants: {
    userId: string;
  }[];
  _count: {
    participants: number;
  };
}

const TutorialDetailsPage = ({ params }: { params: { id: string } }) => {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const res = await fetch(`/api/tutorials/${params.id}`);
        const data = await res.json();
        setTutorial(data);
        if (session?.user) {
          setStarted(
            data.participants.some(
              (p: { userId: string }) => p.userId === session.user.id
            )
          );
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [params.id, session]);

  const handleStart = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/tutorials/${params.id}/start`, {
        method: 'POST',
      });
      if (res.ok) {
        setStarted(true);
      }
    } catch (error) {
      console.error('Error starting tutorial:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-96 w-full" />
        <div className="mt-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return <div>Tutorial not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          {tutorial.videoUrl ? (
            <div className="aspect-video">
              <iframe
                src={tutorial.videoUrl}
                title={tutorial.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-t-lg"
              ></iframe>
            </div>
          ) : (
            tutorial.imageUrl && (
              <img
                src={tutorial.imageUrl}
                alt={tutorial.title}
                className="h-96 w-full object-cover rounded-t-lg"
              />
            )
          )}
          <CardTitle className="mt-4 text-4xl font-bold">
            {tutorial.title}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Hosted by {tutorial.host.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tutorial.tags &&
              JSON.parse(tutorial.tags).map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            <Badge>{tutorial.difficulty}</Badge>
          </div>
          <p className="mb-6">{tutorial.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={tutorial.host.image || ''} />
                <AvatarFallback>
                  {tutorial.host.name?.charAt(0) || 'H'}
                </AvatarFallback>
              </Avatar>
              <span className="ml-3 text-lg">{tutorial.host.name}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {tutorial._count.participants} Participants
              </p>
              {session &&
                (started ? (
                  <Button disabled>Started</Button>
                ) : (
                  <Button onClick={handleStart}>Start Tutorial</Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialDetailsPage;