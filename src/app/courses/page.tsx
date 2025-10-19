'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  User,
  Globe,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tags: string | null;
  difficulty: string;
  createdAt: string;
  host: {
    name: string | null;
    image: string | null;
  };
  participants: {
    userId: string;
  }[];
}

// Mock data for display when no courses exist
const mockCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more.',
    instructor: 'Sarah Johnson',
    instructorTitle: 'Senior Full Stack Developer',
    image: '/api/placeholder/400/250',
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Web Development',
    rating: 4.8,
    students: 2847,
    price: 99,
    currency: 'USD',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    description: 'Learn the basics of machine learning, data analysis, and AI with Python and TensorFlow.',
    instructor: 'Dr. Michael Chen',
    instructorTitle: 'AI Research Scientist',
    image: '/api/placeholder/400/250',
    duration: '8 weeks',
    level: 'Intermediate',
    category: 'Artificial Intelligence',
    rating: 4.9,
    students: 1923,
    price: 149,
    currency: 'USD',
    tags: ['Python', 'TensorFlow', 'Data Science', 'AI'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native and modern development practices.',
    instructor: 'Alex Rodriguez',
    instructorTitle: 'Mobile Development Lead',
    image: '/api/placeholder/400/250',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'Mobile Development',
    rating: 4.7,
    students: 1456,
    price: 129,
    currency: 'USD',
    tags: ['React Native', 'JavaScript', 'Mobile', 'iOS', 'Android'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services and learn to deploy scalable applications in the cloud.',
    instructor: 'Jennifer Park',
    instructorTitle: 'Cloud Solutions Architect',
    image: '/api/placeholder/400/250',
    duration: '6 weeks',
    level: 'Advanced',
    category: 'Cloud Computing',
    rating: 4.6,
    students: 987,
    price: 179,
    currency: 'USD',
    tags: ['AWS', 'Cloud', 'DevOps', 'Docker', 'Kubernetes'],
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful and user-friendly interfaces with modern design principles and tools.',
    instructor: 'Emma Thompson',
    instructorTitle: 'Senior UX Designer',
    image: '/api/placeholder/400/250',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Design',
    rating: 4.8,
    students: 2156,
    price: 89,
    currency: 'USD',
    tags: ['Figma', 'Design', 'UX', 'UI', 'Prototyping'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 6,
    title: 'Cybersecurity Essentials',
    description: 'Learn to protect systems and data with comprehensive cybersecurity practices and tools.',
    instructor: 'David Kim',
    instructorTitle: 'Security Engineer',
    image: '/api/placeholder/400/250',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'Cybersecurity',
    rating: 4.7,
    students: 1234,
    price: 159,
    currency: 'USD',
    tags: ['Security', 'Networking', 'Ethical Hacking', 'Compliance'],
    color: 'from-indigo-500 to-purple-500'
  }
];

const categories = [
  { id: 'all', name: 'All Courses', icon: BookOpen },
  { id: 'web-development', name: 'Web Development', icon: Globe },
  { id: 'artificial-intelligence', name: 'AI & ML', icon: Zap },
  { id: 'mobile-development', name: 'Mobile Development', icon: Users },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: Award },
  { id: 'design', name: 'Design', icon: Star },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: User }
];

const featuredInstructors = [
  { name: 'Sarah Johnson', title: 'Senior Full Stack Developer', courses: 12, students: 15000 },
  { name: 'Dr. Michael Chen', title: 'AI Research Scientist', courses: 8, students: 12000 },
  { name: 'Alex Rodriguez', title: 'Mobile Development Lead', courses: 6, students: 9000 }
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Use mock data as fallback
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Use mock data if no real courses exist
  const displayCourses = courses.length > 0 ? courses : mockCourses;

  const filteredCourses = displayCourses.filter(course => {
    // Handle both API data and mock data structures
    const isApiData = 'host' in course;
    
    if (isApiData) {
      // API data filtering
      const levelMatch = selectedLevel === 'all' || 
        course.difficulty.toLowerCase() === selectedLevel.toLowerCase();
      const searchMatch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return levelMatch && searchMatch;
    } else {
      // Mock data filtering
      const categoryMatch = selectedCategory === 'all' || 
        course.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
      const levelMatch = selectedLevel === 'all' || 
        course.level.toLowerCase() === selectedLevel.toLowerCase();
      const searchMatch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return categoryMatch && levelMatch && searchMatch;
    }
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const isApiData = 'host' in a;
    
    if (isApiData) {
      // Sort API data by participants count or creation date
      switch (sortBy) {
        case 'popular':
          return b.participants.length - a.participants.length;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    } else {
      // Sort mock data
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Learning Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Master New
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Skills Today
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Learn from industry experts with comprehensive courses designed to advance your career in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Browse Courses
                <ChevronRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-muted-foreground">Expert Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">25K+</div>
              <div className="text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <h4 className="font-semibold mb-3">Search</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <category.icon className="w-4 h-4 mr-2" />
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <h4 className="font-semibold mb-3">Level</h4>
                    <div className="space-y-2">
                      {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <Button
                          key={level}
                          variant={selectedLevel === level.toLowerCase() ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedLevel(level.toLowerCase())}
                        >
                          {level === 'all' ? 'All Levels' : level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Featured Instructors */}
                  <div>
                    <h4 className="font-semibold mb-3">Featured Instructors</h4>
                    <div className="space-y-3">
                      {featuredInstructors.map((instructor) => (
                        <div key={instructor.name} className="p-3 border rounded-lg">
                          <h5 className="font-medium text-sm">{instructor.name}</h5>
                          <p className="text-xs text-muted-foreground">{instructor.title}</p>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{instructor.courses} courses</span>
                            <span>{instructor.students.toLocaleString()} students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {sortedCourses.length} Courses Available
                </h2>
                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                      <CardHeader>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {sortedCourses.map((course) => {
                    const isApiData = 'host' in course;
                    
                    return (
                      <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className={`h-48 bg-gradient-to-br ${isApiData ? 'from-purple-500 to-blue-500' : course.color} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <Badge className="bg-white/20 text-white border-white/30">
                              {isApiData ? course.difficulty : course.category}
                            </Badge>
                            {!isApiData && (
                              <div className="flex items-center bg-white/20 text-white px-2 py-1 rounded text-sm">
                                <Star className="w-4 h-4 mr-1 fill-current" />
                                {course.rating}
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white line-clamp-2">
                              {course.title}
                            </h3>
                          </div>
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {isApiData ? course.host.name || 'Unknown Instructor' : course.instructor}
                            </span>
                          </div>
                          <CardDescription className="text-base line-clamp-3">
                            {course.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {isApiData ? (
                              // API data tags
                              course.tags ? (
                                JSON.parse(course.tags).slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  {course.difficulty}
                                </Badge>
                              )
                            ) : (
                              // Mock data tags
                              <>
                                {course.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {course.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{course.tags.length - 3} more
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              {!isApiData && (
                                <>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {course.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {course.students.toLocaleString()}
                                  </span>
                                </>
                              )}
                              {isApiData && (
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {course.participants.length} enrolled
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {isApiData ? course.difficulty : course.level}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-purple-600">
                              {isApiData ? 'Free' : `$${course.price}`}
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/courses/${course.id}`}>
                                <Play className="w-4 h-4 mr-1" />
                                {isApiData ? 'View Course' : 'Enroll Now'}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
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
              Join thousands of students already advancing their careers with our expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Free Trial
                <Play className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-purple-600">
                View All Courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}