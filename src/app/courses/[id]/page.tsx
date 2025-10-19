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
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Calendar,
  Award,
  Target,
  Globe,
  Share2,
  Heart,
  MessageCircle,
  Download,
  User
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

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

  const handleEnrollClick = async () => {
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
        toast.success('Successfully enrolled in the course!');
        // Refresh course data to update participant count
        const updatedRes = await fetch(`/api/courses/${params.id}`);
        const updatedData = await updatedRes.json();
        setCourse(updatedData);
      } else {
        toast.error('Failed to enroll in the course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('An error occurred while enrolling');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NeoFest
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</Link>
                <Link href="/courses" className="text-purple-600 font-medium">Courses</Link>
                <ThemeToggle />
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NeoFest
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</Link>
                <Link href="/courses" className="text-purple-600 font-medium">Courses</Link>
                <ThemeToggle />
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
              <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/courses">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const parsedTags = course.tags ? JSON.parse(course.tags) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeoFest
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</Link>
              <Link href="/functionalities" className="text-foreground hover:text-purple-600 transition-colors">Functionalities</Link>
              <Link href="/ideas" className="text-foreground hover:text-purple-600 transition-colors">Ideas</Link>
              <Link href="/courses" className="text-purple-600 font-medium">Courses</Link>
              <Link href="/#about" className="text-foreground hover:text-purple-600 transition-colors">About</Link>
              <Link href="/#contact" className="text-foreground hover:text-purple-600 transition-colors">Contact</Link>
              <ThemeToggle />
              <Button>Get Started</Button>
            </div>

            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/courses" className="inline-flex items-center text-purple-600 hover:text-purple-500 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </div>

          {/* Course Hero */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {course.difficulty}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {parsedTags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Instructor Info */}
                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.host.image || ''} />
                    <AvatarFallback>
                      {course.host.name?.charAt(0) || 'H'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Instructor</p>
                    <p className="text-muted-foreground">{course.host.name || 'Unknown Instructor'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-center">Free Course</CardTitle>
                  <CardDescription className="text-center">
                    Start learning immediately
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        Students
                      </span>
                      <span className="font-semibold">{course.participants.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Award className="w-4 h-4 mr-2" />
                        Level
                      </span>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                      </span>
                      <span className="font-semibold">English</span>
                    </div>
                  </div>

                  <Separator />

                  {session ? (
                    enrolled ? (
                      <div className="space-y-3">
                        <Button disabled className="w-full" size="lg">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enrolled
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleEnrollClick} className="w-full" size="lg">
                        <Play className="w-4 h-4 mr-2" />
                        Enroll Now - Free
                      </Button>
                    )
                  ) : (
                    <Button onClick={() => router.push('/auth/signin')} className="w-full" size="lg">
                      <User className="w-4 h-4 mr-2" />
                      Sign In to Enroll
                    </Button>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About This Course */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    About This Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedTags.map((tag: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{tag}</span>
                      </div>
                    ))}
                    {parsedTags.length === 0 && (
                      <p className="text-muted-foreground">Course curriculum details will be available soon.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Course Content
                  </CardTitle>
                  <CardDescription>
                    Comprehensive curriculum designed for practical learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Introduction & Setup</h4>
                        <Badge variant="secondary">Free Preview</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get started with the course fundamentals and environment setup.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>15 minutes</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Core Concepts</h4>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Deep dive into the main topics and practical applications.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>2 hours</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Hands-on Projects</h4>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Build real-world projects to reinforce your learning.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>3 hours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Students</span>
                    <span className="font-semibold">{course.participants.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Course Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="font-semibold">Recently</span>
                  </div>
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meet Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={course.host.image || ''} />
                      <AvatarFallback className="text-lg">
                        {course.host.name?.charAt(0) || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{course.host.name || 'Unknown Instructor'}</h4>
                      <p className="text-sm text-muted-foreground">Course Instructor</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Experienced professional with expertise in the field. Passionate about teaching and helping students succeed.
                  </p>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>

              {/* Related Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Advanced Topics</h5>
                    <p className="text-xs text-muted-foreground">Continue your learning journey</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium text-sm mb-1">Practical Applications</h5>
                    <p className="text-xs text-muted-foreground">Apply your knowledge</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <BookOpen className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already advancing their careers with expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                !enrolled ? (
                  <Button size="lg" variant="secondary" className="text-lg" onClick={handleEnrollClick}>
                    <Play className="ml-2" size={20} />
                    Enroll in This Course
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" className="text-lg">
                    <CheckCircle className="ml-2" size={20} />
                    Continue Learning
                  </Button>
                )
              ) : (
                <Button size="lg" variant="secondary" className="text-lg" onClick={() => router.push('/auth/signin')}>
                  <User className="ml-2" size={20} />
                  Sign In to Get Started
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <Link href="/courses">
                  Browse All Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;