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

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
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

const CourseDetailsPage = ({ params }: { params: { id: string } }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${params.id}`);
        const data = await res.json();
        setCourse(data);
        if (session?.user) {
          setEnrolled(
            data.participants.some(
              (p: { userId: string }) => p.userId === session.user.id
            )
          );
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id, session]);

  const handleEnroll = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/courses/${params.id}/enroll`, {
        method: 'POST',
      });
      if (res.ok) {
        setEnrolled(true);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
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

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-96 w-full object-cover rounded-t-lg"
            />
          )}
          <CardTitle className="mt-4 text-4xl font-bold">
            {course.title}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Hosted by {course.host.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags &&
              JSON.parse(course.tags).map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            <Badge>{course.difficulty}</Badge>
          </div>
          <p className="mb-6">{course.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={course.host.image || ''} />
                <AvatarFallback>
                  {course.host.name?.charAt(0) || 'H'}
                </AvatarFallback>
              </Avatar>
              <span className="ml-3 text-lg">{course.host.name}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {course._count.participants} Participants
              </p>
              {session &&
                (enrolled ? (
                  <Button disabled>Enrolled</Button>
                ) : (
                  <Button onClick={handleEnroll}>Enroll Now</Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailsPage;