import { NextRequest, NextResponse } from 'next/server';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prizePool: number;
  participants: number;
  maxParticipants: number;
  tags: string[];
  organizer: string;
  registrationDeadline: string;
  views: number;
  likes: number;
  rating: number;
  imageUrl?: string;
}

const mockHackathons: Hackathon[] = [
  {
    id: '1',
    title: 'AI Innovation Challenge 2024',
    description: 'Build cutting-edge AI solutions to solve real-world problems. Join us for 48 hours of intense coding and innovation.',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    location: 'San Francisco, CA',
    mode: 'hybrid',
    category: 'Artificial Intelligence',
    difficulty: 'advanced',
    prizePool: 50000,
    participants: 234,
    maxParticipants: 500,
    tags: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP'],
    organizer: 'TechCorp Solutions',
    registrationDeadline: '2024-03-10',
    views: 1520,
    likes: 89,
    rating: 4.8,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '2',
    title: 'Web3 Hackathon',
    description: 'Create decentralized applications using blockchain technology. Win prizes and get funding for your project.',
    startDate: '2024-03-20',
    endDate: '2024-03-22',
    location: 'Online',
    mode: 'online',
    category: 'Blockchain',
    difficulty: 'intermediate',
    prizePool: 30000,
    participants: 156,
    maxParticipants: 300,
    tags: ['Ethereum', 'Smart Contracts', 'DeFi', 'NFT'],
    organizer: 'CryptoLabs',
    registrationDeadline: '2024-03-18',
    views: 980,
    likes: 67,
    rating: 4.6,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '3',
    title: 'Mobile App Marathon',
    description: 'Design and develop innovative mobile applications. Focus on UI/UX and functionality.',
    startDate: '2024-03-25',
    endDate: '2024-03-26',
    location: 'New York, NY',
    mode: 'offline',
    category: 'Mobile Development',
    difficulty: 'beginner',
    prizePool: 15000,
    participants: 89,
    maxParticipants: 200,
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    organizer: 'MobileDev Inc',
    registrationDeadline: '2024-03-23',
    views: 650,
    likes: 45,
    rating: 4.4,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '4',
    title: 'Cloud Native Challenge',
    description: 'Build scalable cloud-native applications using modern DevOps practices and containerization.',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    location: 'Seattle, WA',
    mode: 'hybrid',
    category: 'Cloud Computing',
    difficulty: 'intermediate',
    prizePool: 25000,
    participants: 178,
    maxParticipants: 400,
    tags: ['Kubernetes', 'Docker', 'AWS', 'Microservices'],
    organizer: 'CloudTech Solutions',
    registrationDeadline: '2024-03-28',
    views: 1120,
    likes: 78,
    rating: 4.7,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '5',
    title: 'Game Jam Weekend',
    description: 'Create amazing games in 48 hours. Any engine, any theme, just pure creativity.',
    startDate: '2024-04-05',
    endDate: '2024-04-07',
    location: 'Online',
    mode: 'online',
    category: 'Gaming',
    difficulty: 'beginner',
    prizePool: 10000,
    participants: 312,
    maxParticipants: 1000,
    tags: ['Unity', 'Unreal Engine', 'WebGL', 'Mobile Games'],
    organizer: 'GameDev Community',
    registrationDeadline: '2024-04-03',
    views: 1890,
    likes: 156,
    rating: 4.9,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '6',
    title: 'FinTech Innovation Hack',
    description: 'Revolutionize financial services with technology. Build solutions for banking, payments, and investing.',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    location: 'London, UK',
    mode: 'offline',
    category: 'FinTech',
    difficulty: 'advanced',
    prizePool: 40000,
    participants: 145,
    maxParticipants: 250,
    tags: ['Banking', 'Payments', 'Blockchain', 'AI'],
    organizer: 'FinanceTech Hub',
    registrationDeadline: '2024-04-08',
    views: 1340,
    likes: 92,
    rating: 4.5,
    imageUrl: '/api/placeholder/400/250'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const difficulty = searchParams.get('difficulty') || 'all';
    const mode = searchParams.get('mode') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Filter hackathons
    let filtered = mockHackathons.filter(hackathon => {
      const matchesSearch = hackathon.title.toLowerCase().includes(search.toLowerCase()) ||
                           hackathon.description.toLowerCase().includes(search.toLowerCase()) ||
                           hackathon.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'all' || hackathon.category === category;
      const matchesDifficulty = difficulty === 'all' || hackathon.difficulty === difficulty;
      const matchesMode = mode === 'all' || hackathon.mode === mode;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesMode;
    });

    // Sort hackathons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'prize':
          return b.prizePool - a.prizePool;
        case 'participants':
          return b.participants - a.participants;
        case 'rating':
          return b.rating - a.rating;
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
      { success: false, error: 'Failed to fetch hackathons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Here you would typically save to a database
    // For now, we'll just return a success response
    const newHackathon = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newHackathon,
      message: 'Hackathon created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create hackathon' },
      { status: 500 }
    );
  }
}