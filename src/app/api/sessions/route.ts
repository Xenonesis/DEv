import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const level = searchParams.get('level') || 'all';
    const type = searchParams.get('type') || 'all';
    const format = searchParams.get('format') || 'all';
    const price = searchParams.get('price') || 'all';
    const sortBy = searchParams.get('sort') || 'rating';
    
    // Filter sessions
    let filtered = mockSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(search.toLowerCase()) ||
                           session.description.toLowerCase().includes(search.toLowerCase()) ||
                           session.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
                           session.instructor.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || session.category === category;
      const matchesLevel = level === 'all' || session.level === level;
      const matchesType = type === 'all' || session.type === type;
      const matchesFormat = format === 'all' || session.format === format;
      
      let matchesPrice = true;
      if (price === 'free') matchesPrice = session.price === 0;
      else if (price === 'paid') matchesPrice = session.price > 0 && session.price < 100;
      else if (price === 'premium') matchesPrice = session.price >= 100;
      
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

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Here you would typically save to a database
    const newSession = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newSession,
      message: 'Session created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}