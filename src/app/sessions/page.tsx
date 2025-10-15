'use client';

import { useState, useEffect } from 'react';
import { Search, Play, Clock, Users, Award, BookOpen, Calendar, Filter, Star, ChevronRight, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';

interface Session {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  type: 'workshop' | 'training' | 'tutorial' | 'course';
  price: number;
  currency: string;
  rating: number;
  enrolledCount: number;
  maxEnrollment: number;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  materials: string[];
  schedule: {
    startDate: string;
    endDate: string;
    sessions: number;
    frequency: string;
  };
  format: 'live' | 'self-paced' | 'hybrid';
  certificate: boolean;
  freePreview: boolean;
  completed: boolean;
  progress?: number;
  imageUrl?: string;
}

// Using real API data instead of mock data
const fetchSessions = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/sessions?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including hooks, state management, and deployment.',
    instructor: 'Sarah Johnson',
    instructorTitle: 'Senior React Developer',
    duration: 1200, // 20 hours
    level: 'beginner',
    category: 'Frontend Development',
    type: 'course',
    price: 89,
    currency: 'USD',
    rating: 4.8,
    enrolledCount: 1234,
    maxEnrollment: 2000,
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks'],
    prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals'],
    learningObjectives: [
      'Build React applications from scratch',
      'Understand React hooks and state management',
      'Implement routing and navigation',
      'Deploy React apps to production'
    ],
    materials: ['Video lectures', 'Code examples', 'Projects', 'Quizzes'],
    schedule: {
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      sessions: 20,
      frequency: '3x per week'
    },
    format: 'self-paced',
    certificate: true,
    freePreview: true,
    completed: false,
    progress: 45,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    instructor: 'Dr. Michael Chen',
    instructorTitle: 'AI Research Scientist',
    duration: 900, // 15 hours
    level: 'intermediate',
    category: 'Artificial Intelligence',
    type: 'workshop',
    price: 0,
    currency: 'USD',
    rating: 4.9,
    enrolledCount: 892,
    maxEnrollment: 1500,
    tags: ['Machine Learning', 'Python', 'Data Science', 'AI'],
    prerequisites: ['Python programming', 'Basic statistics'],
    learningObjectives: [
      'Understand ML algorithms and concepts',
      'Implement ML models in Python',
      'Evaluate model performance',
      'Apply ML to real-world problems'
    ],
    materials: ['Jupyter notebooks', 'Datasets', 'Video tutorials'],
    schedule: {
      startDate: '2024-03-20',
      endDate: '2024-03-27',
      sessions: 5,
      frequency: 'Daily'
    },
    format: 'live',
    certificate: true,
    freePreview: true,
    completed: false,
    progress: 0,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '3',
    title: 'Advanced Cloud Architecture',
    description: 'Design and implement scalable cloud solutions using AWS and modern architecture patterns.',
    instructor: 'David Williams',
    instructorTitle: 'Cloud Solutions Architect',
    duration: 1500, // 25 hours
    level: 'advanced',
    category: 'Cloud Computing',
    type: 'training',
    price: 199,
    currency: 'USD',
    rating: 4.7,
    enrolledCount: 456,
    maxEnrollment: 800,
    tags: ['AWS', 'Cloud Architecture', 'DevOps', 'Scalability'],
    prerequisites: ['Cloud basics', 'Linux fundamentals', 'Networking concepts'],
    learningObjectives: [
      'Design scalable cloud architectures',
      'Implement security best practices',
      'Optimize cloud costs',
      'Build resilient systems'
    ],
    materials: ['Architecture diagrams', 'Hands-on labs', 'Case studies'],
    schedule: {
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      sessions: 10,
      frequency: '2x per week'
    },
    format: 'hybrid',
    certificate: true,
    freePreview: false,
    completed: false,
    progress: 0,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamentals of user interface and user experience design.',
    instructor: 'Emily Rodriguez',
    instructorTitle: 'UX Design Lead',
    duration: 600, // 10 hours
    level: 'beginner',
    category: 'Design',
    type: 'tutorial',
    price: 0,
    currency: 'USD',
    rating: 4.6,
    enrolledCount: 2103,
    maxEnrollment: 5000,
    tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
    prerequisites: ['None'],
    learningObjectives: [
      'Understand design principles',
      'Create user personas',
      'Design wireframes and prototypes',
      'Conduct user research'
    ],
    materials: ['Design templates', 'Video tutorials', 'Practice exercises'],
    schedule: {
      startDate: '2024-03-10',
      endDate: '2024-03-20',
      sessions: 8,
      frequency: 'Daily'
    },
    format: 'self-paced',
    certificate: false,
    freePreview: true,
    completed: true,
    progress: 100,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '5',
    title: 'Python for Data Science',
    description: 'Complete Python programming course focused on data science applications.',
    instructor: 'James Thompson',
    instructorTitle: 'Data Science Engineer',
    duration: 1800, // 30 hours
    level: 'intermediate',
    category: 'Data Science',
    type: 'course',
    price: 129,
    currency: 'USD',
    rating: 4.8,
    enrolledCount: 1567,
    maxEnrollment: 2500,
    tags: ['Python', 'Data Science', 'Pandas', 'NumPy', 'Visualization'],
    prerequisites: ['Basic programming knowledge'],
    learningObjectives: [
      'Master Python for data analysis',
      'Work with Pandas and NumPy',
      'Create data visualizations',
      'Perform statistical analysis'
    ],
    materials: ['Code notebooks', 'Datasets', 'Projects', 'Cheatsheets'],
    schedule: {
      startDate: '2024-03-25',
      endDate: '2024-05-10',
      sessions: 24,
      frequency: '3x per week'
    },
    format: 'self-paced',
    certificate: true,
    freePreview: true,
    completed: false,
    progress: 20,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '6',
    title: 'DevOps Essentials Workshop',
    description: 'Learn DevOps practices, CI/CD pipelines, and infrastructure automation.',
    instructor: 'Robert Martinez',
    instructorTitle: 'DevOps Engineer',
    duration: 720, // 12 hours
    level: 'intermediate',
    category: 'DevOps',
    type: 'workshop',
    price: 49,
    currency: 'USD',
    rating: 4.5,
    enrolledCount: 678,
    maxEnrollment: 1000,
    tags: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Automation'],
    prerequisites: ['Linux basics', 'Git fundamentals'],
    learningObjectives: [
      'Set up CI/CD pipelines',
      'Containerize applications',
      'Manage Kubernetes clusters',
      'Implement monitoring and logging'
    ],
    materials: ['Docker files', 'Kubernetes configs', 'Pipeline scripts'],
    schedule: {
      startDate: '2024-04-05',
      endDate: '2024-04-12',
      sessions: 6,
      frequency: 'Daily'
    },
    format: 'live',
    certificate: true,
    freePreview: false,
    completed: false,
    progress: 0,
    imageUrl: '/api/placeholder/400/250'
  }
];

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Frontend Development', 'Artificial Intelligence', 'Cloud Computing', 'Design', 'Data Science', 'DevOps'];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];
  const types = ['all', 'workshop', 'training', 'tutorial', 'course'];
  const formats = ['all', 'live', 'self-paced', 'hybrid'];
  const priceRanges = ['all', 'free', 'paid', 'premium'];

  // Load sessions data
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      const data = await fetchSessions({
        search: searchTerm,
        difficulty: selectedLevel !== 'all' ? selectedLevel : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        sort: sortBy
      });
      setSessions(data);
      setLoading(false);
    };

    loadSessions();
  }, [searchTerm, selectedLevel, selectedType, sortBy]);

  useEffect(() => {
    let filtered = mockSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || session.level === selectedLevel;
      const matchesType = selectedType === 'all' || session.type === selectedType;
      const matchesFormat = selectedFormat === 'all' || session.format === selectedFormat;
      
      let matchesPrice = true;
      if (selectedPrice === 'free') matchesPrice = session.price === 0;
      else if (selectedPrice === 'paid') matchesPrice = session.price > 0 && session.price < 100;
      else if (selectedPrice === 'premium') matchesPrice = session.price >= 100;
      
      return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesFormat && matchesPrice;
    });

    // Sort sessions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.enrolledCount - a.enrolledCount;
        case 'price':
          return a.price - b.price;
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    setSessions(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, selectedType, selectedFormat, selectedPrice, sortBy]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'workshop': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'training': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'tutorial': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isSessionFull = (session: Session) => {
    return session.enrolledCount >= session.maxEnrollment;
  };

  const getEnrollmentStatus = (session: Session) => {
    if (session.completed) return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    if (session.progress && session.progress > 0) return { text: 'In Progress', color: 'bg-blue-100 text-blue-800' };
    if (isSessionFull(session)) return { text: 'Full', color: 'bg-red-100 text-red-800' };
    return { text: 'Available', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeoFest
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</a>
              <a href="/hackathons" className="text-foreground hover:text-purple-600 transition-colors">Hackathons</a>
              <a href="/events" className="text-foreground hover:text-purple-600 transition-colors">Events</a>
              <a href="/sessions" className="text-foreground hover:text-purple-600 transition-colors font-semibold">Sessions</a>
              <a href="/functionalities" className="text-foreground hover:text-purple-600 transition-colors">Functionalities</a>
              <a href="/ideas" className="text-foreground hover:text-purple-600 transition-colors">Ideas</a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              <span className="block">Learning</span>
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Sessions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Enhance your skills with expert-led workshops, training sessions, and comprehensive courses. Learn at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{sessions.length}+</div>
                <div className="text-muted-foreground">Active Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-muted-foreground">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">8000+</div>
                <div className="text-muted-foreground">Learners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Format Filter */}
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(format => (
                    <SelectItem key={format} value={format}>
                      {format === 'all' ? 'All Formats' : format.charAt(0).toUpperCase() + format.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger>
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid ($1-99)</SelectItem>
                  <SelectItem value="premium">Premium ($100+)</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
              const enrollmentStatus = getEnrollmentStatus(session);
              
              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(session.level)}>
                          {session.level}
                        </Badge>
                        <Badge className={getTypeColor(session.type)}>
                          {session.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{session.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {session.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {session.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{session.instructor}</div>
                        <div className="text-xs text-muted-foreground">{session.instructorTitle}</div>
                      </div>
                    </div>

                    {/* Duration and Format */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {session.format}
                      </Badge>
                    </div>

                    {/* Schedule */}
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(session.schedule.startDate)} - {formatDate(session.schedule.endDate)}</span>
                      </div>
                      <div className="text-xs">
                        {session.schedule.sessions} sessions • {session.schedule.frequency}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {session.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{session.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Progress (for enrolled sessions) */}
                    {session.progress !== undefined && session.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{session.progress}%</span>
                        </div>
                        <Progress value={session.progress} className="h-2" />
                      </div>
                    )}

                    {/* Price and Enrollment */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {session.price === 0 ? 'Free' : `$${session.price}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>{session.enrolledCount}/{session.maxEnrollment}</span>
                      </div>
                    </div>

                    {/* Certificate */}
                    {session.certificate && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Award className="w-4 h-4" />
                        <span>Certificate of Completion</span>
                      </div>
                    )}

                    {/* Enrollment Status */}
                    <div className="flex items-center gap-2">
                      <Badge className={enrollmentStatus.color}>
                        {enrollmentStatus.text}
                      </Badge>
                      {session.freePreview && !session.completed && (
                        <Badge variant="outline" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Free Preview
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {session.completed ? (
                        <Button className="flex-1" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      ) : session.progress && session.progress > 0 ? (
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                      ) : isSessionFull(session) ? (
                        <Button className="flex-1" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Session Full
                        </Button>
                      ) : (
                        <Button className="flex-1">
                          {session.price === 0 ? 'Enroll Now' : 'Purchase Access'}
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">No sessions found matching your criteria.</div>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedType('all');
                setSelectedFormat('all');
                setSelectedPrice('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}