'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users, Trophy, ExternalLink, Heart, Eye, Star, Sparkles, Brain, Zap, Target, Award, TrendingUp, Loader2, Database, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

interface AIChallenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prizePool: number;
  participants: number;
  maxParticipants: number;
  submissions: number;
  tags: string[];
  organizer: string;
  registrationDeadline: string;
  views: number;
  likes: number;
  rating: number;
  imageUrl?: string;
  dataset?: string;
  evaluationMetric?: string;
  status: string;
  featured?: boolean;
}

const fetchAIChallenges = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/ai-challenges?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching AI challenges:', error);
    return [];
  }
};

export default function AIChallengesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [challenges, setChallenges] = useState<AIChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      const data = await fetchAIChallenges({
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        sort: sortBy
      });
      setChallenges(data);
      setLoading(false);
    };

    loadChallenges();
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

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

  const categories = ['all', 'Computer Vision', 'Natural Language Processing', 'Reinforcement Learning', 'Time Series', 'Generative AI', 'Speech Recognition'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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

  const isRegistrationOpen = (deadline: string) => {
    return new Date(deadline) > new Date();
  };

  const featuredChallenges = challenges.filter(c => c.featured);
  const regularChallenges = challenges.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-sm"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Brain className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">AI Challenges</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                & Competitions
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Compete in cutting-edge AI challenges, build innovative models, and win amazing prizes while advancing artificial intelligence.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {challenges.length}+
                </div>
                <div className="text-muted-foreground font-medium">Active Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  ${challenges.reduce((sum, c) => sum + c.prizePool, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground font-medium">Total Prizes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {challenges.reduce((sum, c) => sum + c.participants, 0)}+
                </div>
                <div className="text-muted-foreground font-medium">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={filtersRef}
        id="filters" 
        className="py-8 bg-muted/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-border/50 transition-all duration-1000 ${isVisible.filters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search AI challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-blue-500 transition-colors"
                />
              </div>

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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
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

      {featuredChallenges.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/20 dark:to-purple-950/20 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50">
                <Sparkles size={18} />
                <span className="font-semibold">Featured AI Challenges</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Don't Miss These 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Opportunities</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} router={router} getDifficultyColor={getDifficultyColor} formatDate={formatDate} isRegistrationOpen={isRegistrationOpen} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Challenges</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore all available AI challenges and find the perfect competition for your skills.
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
            {regularChallenges.map((challenge, index) => (
              <ChallengeCard key={challenge.id} challenge={challenge} router={router} getDifficultyColor={getDifficultyColor} formatDate={formatDate} isRegistrationOpen={isRegistrationOpen} index={index} />
            ))}
          </div>
          )}

          {!loading && challenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No AI challenges found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .animate-scale-pulse {
          animation: scale-pulse 3s ease-in-out infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}

function ChallengeCard({ challenge, router, getDifficultyColor, formatDate, isRegistrationOpen, featured = false, index = 0 }: any) {
  return (
    <Card 
      className={`group hover:shadow-xl ${featured ? 'hover:shadow-2xl' : 'hover:scale-[1.02]'} transition-all duration-500 bg-${featured ? 'gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-900/80 dark:to-blue-950/20' : 'white/80 dark:bg-gray-900/80'} backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => router.push(`/ai-challenges/${challenge.id}`)}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-xs font-semibold">
            <Trophy className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getDifficultyColor(challenge.difficulty)} border-0`}>
            {challenge.difficulty}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{challenge.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardTitle className={`${featured ? 'text-xl' : 'text-lg'} line-clamp-2 group-hover:text-blue-600 transition-colors`}>
          {challenge.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{formatDate(challenge.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span className="text-xs truncate max-w-[120px]">{challenge.category}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {challenge.tags.slice(0, featured ? 4 : 3).map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {challenge.tags.length > (featured ? 4 : 3) && (
            <Badge variant="secondary" className="text-xs">
              +{challenge.tags.length - (featured ? 4 : 3)}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">${challenge.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{challenge.participants}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{challenge.submissions}</span>
            </div>
          </div>
        </div>

        {featured && challenge.evaluationMetric && (
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-muted-foreground">Metric: <span className="font-medium text-foreground">{challenge.evaluationMetric}</span></span>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300" 
            disabled={!isRegistrationOpen(challenge.registrationDeadline)}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/ai-challenges/${challenge.id}`);
            }}
          >
            {isRegistrationOpen(challenge.registrationDeadline) ? (featured ? 'Join Challenge' : 'Join') : 'Closed'}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/ai-challenges/${challenge.id}`);
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Reg. deadline: {formatDate(challenge.registrationDeadline)}
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </Card>
  );
}
