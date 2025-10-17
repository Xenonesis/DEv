'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Smartphone, Zap, Trophy, Calendar, Users, Search, ExternalLink, Star, Eye, Heart, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

interface MobileInnovation {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  techStack: string[];
  prize?: string;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl?: string;
  tags: string[];
  difficulty: string;
  host: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    image: string | null;
  };
  participants: number;
  submissions: number;
  featured: boolean;
}

export default function MobileInnovationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [innovations, setInnovations] = useState<MobileInnovation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchInnovations();
  }, [searchTerm, selectedCategory, selectedPlatform, selectedDifficulty, sortBy]);

  const fetchInnovations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      params.append('sort', sortBy);

      const response = await fetch(`/api/mobile-innovation?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInnovations(data.data);
      }
    } catch (error) {
      console.error('Error fetching mobile innovations:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Health', 'Education', 'Finance', 'Social', 'Entertainment', 'Productivity', 'Gaming'];
  const platforms = ['all', 'iOS', 'Android', 'Cross-Platform', 'Web'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isRegistrationOpen = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  const featuredInnovations = innovations.filter(i => i.featured);
  const regularInnovations = innovations.filter(i => !i.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-sm"
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Smartphone className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Mobile</span>
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Innovation Hub
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Discover cutting-edge mobile applications, participate in innovation challenges, and showcase your mobile development skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {innovations.length}+
                </div>
                <div className="text-muted-foreground font-medium">Active Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {innovations.reduce((sum, i) => sum + i.participants, 0)}+
                </div>
                <div className="text-muted-foreground font-medium">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {innovations.reduce((sum, i) => sum + i.submissions, 0)}+
                </div>
                <div className="text-muted-foreground font-medium">Submissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search innovations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
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

              {/* Platform Filter */}
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform === 'all' ? 'All Platforms' : platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
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

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Start Date</SelectItem>
                  <SelectItem value="prize">Prize Amount</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Innovations */}
      {featuredInnovations.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50">
                <Zap size={18} />
                <span className="font-semibold">Featured Challenges</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Don't Miss These 
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Opportunities</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredInnovations.map((innovation) => (
                <Card 
                  key={innovation.id} 
                  className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-900/80 dark:to-blue-950/20 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                  onClick={() => router.push(`/mobile-innovation/${innovation.id}`)}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 text-xs font-semibold">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`${getDifficultyColor(innovation.difficulty)} border-0`}>
                        {innovation.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-cyan-200 text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20">
                        {innovation.platform}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {innovation.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">
                      {innovation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(innovation.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span>{innovation.category}</span>
                      </div>
                    </div>

                    {innovation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {innovation.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {innovation.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{innovation.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {innovation.prize && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-blue-600">{innovation.prize}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{innovation.participants}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{innovation.submissions}</span> submissions
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <img
                        src={innovation.host.avatar || innovation.host.image || '/logo.png'}
                        alt={innovation.host.name || 'Host'}
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Hosted by</p>
                        <p className="text-sm font-medium truncate">{innovation.host.name || 'Anonymous'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                        disabled={!isRegistrationOpen(innovation.endDate)}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/mobile-innovation/${innovation.id}`);
                        }}
                      >
                        {isRegistrationOpen(innovation.endDate) ? 'Register Now' : 'Registration Closed'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/mobile-innovation/${innovation.id}`);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Innovations Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Challenges</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore all available mobile innovation challenges and find the perfect opportunity for your skills.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading challenges...</p>
            </div>
          ) : regularInnovations.length === 0 && featuredInnovations.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full mb-6">
                  <Smartphone className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Challenges Found</h3>
                <p className="text-muted-foreground mb-6">Check back soon for new mobile innovation challenges!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularInnovations.map((innovation, index) => (
                <Card 
                  key={innovation.id} 
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => router.push(`/mobile-innovation/${innovation.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`${getDifficultyColor(innovation.difficulty)} border-0`}>
                        {innovation.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-cyan-200 text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 text-xs">
                        {innovation.platform}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {innovation.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {innovation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(innovation.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span className="text-xs">{innovation.category}</span>
                      </div>
                    </div>

                    {innovation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {innovation.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {innovation.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{innovation.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {innovation.prize && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{innovation.prize}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{innovation.participants}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <img
                        src={innovation.host.avatar || innovation.host.image || '/logo.png'}
                        alt={innovation.host.name || 'Host'}
                        className="w-6 h-6 rounded-full border border-background"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          by {innovation.host.name || 'Anonymous'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300" 
                        disabled={!isRegistrationOpen(innovation.endDate)}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/mobile-innovation/${innovation.id}`);
                        }}
                      >
                        {isRegistrationOpen(innovation.endDate) ? 'Register' : 'Closed'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/mobile-innovation/${innovation.id}`);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom animations */}
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-scale-pulse {
          animation: scale-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
