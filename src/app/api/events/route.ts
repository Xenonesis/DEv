import { NextRequest, NextResponse } from 'next/server';

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
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for a day of insights into the latest technology trends and innovations.',
    date: '2024-03-20',
    startTime: '09:00',
    endTime: '18:00',
    location: 'San Francisco Convention Center',
    mode: 'offline',
    category: 'Technology',
    type: 'summit',
    price: 299,
    currency: 'USD',
    maxAttendees: 500,
    currentAttendees: 423,
    tags: ['AI', 'Cloud', 'Innovation', 'Leadership'],
    organizer: 'TechLeaders Inc',
    speakers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    rating: 4.8,
    views: 2340,
    featured: true,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '2',
    title: 'React Advanced Workshop',
    description: 'Deep dive into advanced React concepts including hooks, performance optimization, and best practices.',
    date: '2024-03-22',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Online',
    mode: 'online',
    category: 'Development',
    type: 'workshop',
    price: 49,
    currency: 'USD',
    maxAttendees: 100,
    currentAttendees: 78,
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    organizer: 'React Masters',
    speakers: ['Sarah Wilson'],
    rating: 4.9,
    views: 1560,
    featured: false,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '3',
    title: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in AI and ML with leading researchers and practitioners.',
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '19:00',
    location: 'New York, NY',
    mode: 'hybrid',
    category: 'Artificial Intelligence',
    type: 'conference',
    price: 199,
    currency: 'USD',
    maxAttendees: 300,
    currentAttendees: 267,
    tags: ['Machine Learning', 'Deep Learning', 'AI Ethics', 'Computer Vision'],
    organizer: 'AI Research Hub',
    speakers: ['Dr. Emily Chen', 'Prof. Robert Lee', 'Lisa Anderson'],
    rating: 4.7,
    views: 1890,
    featured: true,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '4',
    title: 'DevOps Best Practices Webinar',
    description: 'Learn essential DevOps practices and tools for modern software development.',
    date: '2024-03-28',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Online',
    mode: 'online',
    category: 'DevOps',
    type: 'webinar',
    price: 0,
    currency: 'USD',
    maxAttendees: 1000,
    currentAttendees: 534,
    tags: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes'],
    organizer: 'DevOps Community',
    speakers: ['Tom Harris'],
    rating: 4.5,
    views: 980,
    featured: false,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '5',
    title: 'Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors and industry experts.',
    date: '2024-04-02',
    startTime: '18:00',
    endTime: '21:00',
    location: 'Austin, TX',
    mode: 'offline',
    category: 'Startup',
    type: 'meetup',
    price: 25,
    currency: 'USD',
    maxAttendees: 200,
    currentAttendees: 156,
    tags: ['Startup', 'Pitching', 'Investment', 'Networking'],
    organizer: 'Startup Hub',
    speakers: ['Various Founders'],
    rating: 4.6,
    views: 1230,
    featured: false,
    imageUrl: '/api/placeholder/400/250'
  },
  {
    id: '6',
    title: 'Cloud Architecture Masterclass',
    description: 'Master cloud architecture patterns and best practices for scalable applications.',
    date: '2024-04-05',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Online',
    mode: 'online',
    category: 'Cloud Computing',
    type: 'workshop',
    price: 89,
    currency: 'USD',
    maxAttendees: 150,
    currentAttendees: 98,
    tags: ['Cloud', 'AWS', 'Azure', 'Architecture'],
    organizer: 'Cloud Experts',
    speakers: ['David Brown', 'Jennifer White'],
    rating: 4.8,
    views: 1450,
    featured: true,
    imageUrl: '/api/placeholder/400/250'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const type = searchParams.get('type') || 'all';
    const mode = searchParams.get('mode') || 'all';
    const price = searchParams.get('price') || 'all';
    const sortBy = searchParams.get('sort') || 'date';
    
    // Filter events
    let filtered = mockEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                           event.description.toLowerCase().includes(search.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'all' || event.category === category;
      const matchesType = type === 'all' || event.type === type;
      const matchesMode = mode === 'all' || event.mode === mode;
      
      let matchesPrice = true;
      if (price === 'free') matchesPrice = event.price === 0;
      else if (price === 'paid') matchesPrice = event.price > 0 && event.price < 100;
      else if (price === 'premium') matchesPrice = event.price >= 100;
      
      return matchesSearch && matchesCategory && matchesType && matchesMode && matchesPrice;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.currentAttendees - a.currentAttendees;
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
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Here you would typically save to a database
    const newEvent = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}