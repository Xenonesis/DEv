"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Film, Filter, ChevronLeft, ChevronRight, Plus, Sparkles, Award, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

interface Tutorial {
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
  _count: {
    participants: number;
  };
  featured: boolean;
}

// Fetch tutorials from real API
const fetchTutorials = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/tutorials?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }
};

export default function TutorialsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);

  // Load tutorials data
  useEffect(() => {
    const loadTutorials = async () => {
      setLoading(true);
      const data = await fetchTutorials({
        search: searchTerm,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        sort: sortBy
      });
      setTutorials(data);
      setLoading(false);
    };

    loadTutorials();
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

  const difficulties = ['all', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  const getDifficultyColor = (difficulty: string) => {
    const upperDifficulty = difficulty?.toUpperCase();
    switch (upperDifficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ADVANCED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'EXPERT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const featuredTutorials = tutorials.filter(t => t.featured);
  const regularTutorials = tutorials.filter(t => !t.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-sm"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Film className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Step-by-Step</span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Tutorials
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Learn by doing with our project-based tutorials. Master new skills at your own pace.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {tutorials.length}+
                </div>
                <div className="text-muted-foreground font-medium">Tutorials Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-muted-foreground font-medium">Technologies Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  20,000+
                </div>
                <div className="text-muted-foreground font-medium">Projects Started</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-12 border-border/50 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}
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
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* All Tutorials Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Tutorials</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our library of tutorials and start building your next project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card 
                key={tutorial.id} 
                className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/tutorials/${tutorial.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getDifficultyColor(tutorial.difficulty)} border-0`}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {tutorial.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tutorial.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags && JSON.parse(tutorial.tags).slice(0, 3).map((tag:string, index:number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tutorial.tags && JSON.parse(tutorial.tags).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{JSON.parse(tutorial.tags).length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Participants and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{tutorial._count.participants} Learners</span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
                    >
                      Start Tutorial
                    </Button>
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>

          {tutorials.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No tutorials found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
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