'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, Clock, Users, Trophy, MapPin, ExternalLink, Heart, Eye, Star, Sparkles, Code, Zap, Target, Award, Globe, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

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
  featured?: boolean;
}

// Using real API data instead of mock data
const fetchHackathons = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/hackathons?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return [];
  }
};

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
    featured: true
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
    rating: 4.6
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
    rating: 4.4
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
    rating: 4.7
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
    featured: true
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
    rating: 4.5
  }
];

export default function HackathonsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);

  // Load hackathons data
  useEffect(() => {
    const loadHackathons = async () => {
      setLoading(true);
      const data = await fetchHackathons({
        search: searchTerm,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        sort: sortBy
      });
      setHackathons(data);
      setLoading(false);
    };

    loadHackathons();
  }, [searchTerm, selectedDifficulty, sortBy]);

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

  const categories = ['all', 'Artificial Intelligence', 'Blockchain', 'Mobile Development', 'Cloud Computing', 'Gaming', 'FinTech'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const modes = ['all', 'online', 'offline', 'hybrid'];

  useEffect(() => {
    let filtered = mockHackathons.filter(hackathon => {
      const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || hackathon.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || hackathon.difficulty === selectedDifficulty;
      const matchesMode = selectedMode === 'all' || hackathon.mode === selectedMode;
      
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

    setHackathons(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedMode, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return <Globe className="w-4 h-4" />;
      case 'offline': return <MapPin className="w-4 h-4" />;
      case 'hybrid': return <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><MapPin className="w-3 h-3" /></div>;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isRegistrationOpen = (deadline: string) => {
    return new Date(deadline) > new Date();
  };

  const featuredHackathons = hackathons.filter(h => h.featured);
  const regularHackathons = hackathons.filter(h => !h.featured);

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
              <Code className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Hackathon</span>
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Competitions
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Join exciting hackathons, compete with talented developers, and win amazing prizes while building innovative solutions.
            </p>

            {/* Animated stats */}
            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {hackathons.length}+
                </div>
                <div className="text-muted-foreground font-medium">Active Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  $170K+
                </div>
                <div className="text-muted-foreground font-medium">Total Prizes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  1000+
                </div>
                <div className="text-muted-foreground font-medium">Participants</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search hackathons..."
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

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Start Date</SelectItem>
                  <SelectItem value="prize">Prize Pool</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      {featuredHackathons.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-purple-200/50">
                <Sparkles size={18} />
                <span className="font-semibold">Featured Hackathons</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Don't Miss These 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Opportunities</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredHackathons.map((hackathon) => (
                <Card 
                  key={hackathon.id} 
                  className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-gray-900/80 dark:to-purple-950/20 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                  onClick={() => router.push(`/hackathons/${hackathon.id}`)}
                >
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 text-xs font-semibold">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${getDifficultyColor(hackathon.difficulty)} border-0`}>
                        {hackathon.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{hackathon.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                      {hackathon.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">
                      {hackathon.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Date and Location */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(hackathon.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getModeIcon(hackathon.mode)}
                        <span>{hackathon.mode === 'online' ? 'Online' : hackathon.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {hackathon.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {hackathon.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{hackathon.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-purple-600">${hackathon.prizePool.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{hackathon.participants}/{hackathon.maxParticipants}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{hackathon.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{hackathon.likes}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                        disabled={!isRegistrationOpen(hackathon.registrationDeadline)}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/hackathons/${hackathon.id}`);
                        }}
                      >
                        {isRegistrationOpen(hackathon.registrationDeadline) ? 'Register Now' : 'Registration Closed'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/hackathons/${hackathon.id}`);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Registration Deadline */}
                    <div className="text-xs text-muted-foreground text-center">
                      Registration deadline: {formatDate(hackathon.registrationDeadline)}
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

      {/* All Hackathons Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Hackathons</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore all available hackathons and find the perfect challenge for your skills.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-6 w-20 bg-muted rounded"></div>
                      <div className="h-6 w-12 bg-muted rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularHackathons.map((hackathon, index) => (
              <Card 
                key={hackathon.id} 
                className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/hackathons/${hackathon.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getDifficultyColor(hackathon.difficulty)} border-0`}>
                      {hackathon.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hackathon.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {hackathon.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {hackathon.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Date and Location */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getModeIcon(hackathon.mode)}
                      <span className="text-xs">{hackathon.mode === 'online' ? 'Online' : hackathon.location.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {hackathon.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {hackathon.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hackathon.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">${hackathon.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>{hackathon.participants}/{hackathon.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{hackathon.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{hackathon.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300" 
                      disabled={!isRegistrationOpen(hackathon.registrationDeadline)}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/hackathons/${hackathon.id}`);
                      }}
                    >
                      {isRegistrationOpen(hackathon.registrationDeadline) ? 'Register' : 'Closed'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/hackathons/${hackathon.id}`);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Registration Deadline */}
                  <div className="text-xs text-muted-foreground text-center">
                    Reg. deadline: {formatDate(hackathon.registrationDeadline)}
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>
          )}

          {!loading && hackathons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No hackathons found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedMode('all');
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