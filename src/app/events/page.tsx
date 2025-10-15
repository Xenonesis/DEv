'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Clock, MapPin, Users, Ticket, Star, Filter, ChevronLeft, ChevronRight, Plus, Sparkles, Globe, Video, MapPin as MapPinIcon, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

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

// Using real API data instead of mock data
const fetchEvents = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/events?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

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
    featured: true
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
    featured: false
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
    featured: true
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
    featured: false
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
    featured: false
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
    featured: true
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);

  // Load events data
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchEvents({
        search: searchTerm,
        type: selectedType !== 'all' ? selectedType : undefined,
        sort: sortBy
      });
      setEvents(data);
      setLoading(false);
    };

    loadEvents();
  }, [searchTerm, selectedType, sortBy]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = [heroRef.current, statsRef.current, filtersRef.current];
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const categories = ['all', 'Technology', 'Development', 'Artificial Intelligence', 'DevOps', 'Startup', 'Cloud Computing'];
  const types = ['all', 'conference', 'workshop', 'meetup', 'webinar', 'summit'];
  const modes = ['all', 'online', 'offline', 'hybrid'];
  const priceRanges = ['all', 'free', 'paid', 'premium'];

  useEffect(() => {
    let filtered = mockEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesType = selectedType === 'all' || event.type === selectedType;
      const matchesMode = selectedMode === 'all' || event.mode === selectedMode;
      
      let matchesPrice = true;
      if (selectedPrice === 'free') matchesPrice = event.price === 0;
      else if (selectedPrice === 'paid') matchesPrice = event.price > 0 && event.price < 100;
      else if (selectedPrice === 'premium') matchesPrice = event.price >= 100;
      
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

    setEvents(filtered);
  }, [searchTerm, selectedCategory, selectedType, selectedMode, selectedPrice, sortBy]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'workshop': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'meetup': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'webinar': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'summit': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'offline': return <MapPinIcon className="w-4 h-4" />;
      case 'hybrid': return <div className="flex items-center gap-1"><Video className="w-3 h-3" /><MapPinIcon className="w-3 h-3" /></div>;
      default: return <MapPinIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isEventFull = (event: Event) => {
    return event.currentAttendees >= event.maxAttendees;
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  const featuredEvents = events.filter(e => e.featured);
  const regularEvents = events.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 blur-sm"
              style={{
                width: Math.random() * 150 + 50 + 'px',
                height: Math.random() * 150 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Animated icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Calendar className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Tech Events &</span>
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Conferences
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Discover and join exciting tech events, conferences, and workshops. Connect with industry experts and expand your knowledge.
            </p>

            {/* Animated stats */}
            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {events.length}+
                </div>
                <div className="text-muted-foreground font-medium">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-muted-foreground font-medium">Expert Speakers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  2000+
                </div>
                <div className="text-muted-foreground font-medium">Attendees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section 
        ref={filtersRef}
        id="filters" 
        className="py-8 bg-muted/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-border/50 transition-all duration-1000 ${isVisible.filters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
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

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
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

              {/* Mode Filter */}
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  {modes.map(mode => (
                    <SelectItem key={mode} value={mode}>
                      {mode === 'all' ? 'All Modes' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid ($1-$99)</SelectItem>
                  <SelectItem value="premium">Premium ($100+)</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-purple-200/50">
                <Sparkles size={18} />
                <span className="font-semibold">Featured Events</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Don't Miss These 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Events</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-gray-900/80 dark:to-purple-950/20 backdrop-blur-lg border-0 overflow-hidden relative">
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 text-xs font-semibold">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${getTypeColor(event.type)} border-0`}>
                        {event.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{event.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                    </div>

                    {/* Location and Mode */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {getModeIcon(event.mode)}
                        <span>{event.mode === 'online' ? 'Online' : event.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.currentAttendees}/{event.maxAttendees}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {event.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Speakers */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Speakers:</div>
                      <div className="text-sm font-medium">
                        {event.speakers.slice(0, 2).join(', ')}
                        {event.speakers.length > 2 && ` +${event.speakers.length - 2} more`}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-purple-600">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={isEventFull(event)}
                      >
                        {isEventFull(event) ? 'Sold Out' : 'Register Now'}
                      </Button>
                    </div>
                  </CardContent>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Events</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore all available events and find the perfect opportunity to learn and network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getTypeColor(event.type)} border-0`}>
                      {event.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Date and Time */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                  </div>

                  {/* Location and Mode */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getModeIcon(event.mode)}
                      <span className="text-xs">{event.mode === 'online' ? 'Online' : event.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{event.currentAttendees}/{event.maxAttendees}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-purple-600">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                      disabled={isEventFull(event)}
                    >
                      {isEventFull(event) ? 'Sold Out' : 'Register'}
                    </Button>
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No events found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedMode('all');
                  setSelectedPrice('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(120deg); 
          }
          66% { 
            transform: translateY(10px) rotate(240deg); 
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}