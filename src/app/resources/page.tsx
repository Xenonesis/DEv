"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Link as LinkIcon, Filter, ChevronLeft, ChevronRight, Plus, Sparkles, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  tags: string | null;
  type: string;
  host: {
    name: string | null;
    image: string | null;
  };
  featured: boolean;
}

// Fetch resources from real API
const fetchResources = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/resources?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
};

export default function ResourcesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);

  // Load resources data
  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      const data = await fetchResources({
        search: searchTerm,
        type: selectedType !== 'all' ? selectedType : undefined,
        sort: sortBy
      });
      setResources(data);
      setLoading(false);
    };

    loadResources();
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

  const types = ['all', 'ARTICLE', 'VIDEO', 'TOOL', 'BOOK', 'PAPER'];

  const getTypeColor = (type: string) => {
    const upperType = type?.toUpperCase();
    switch (upperType) {
      case 'ARTICLE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'VIDEO': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TOOL': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'BOOK': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'PAPER': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const featuredResources = resources.filter(r => r.featured);
  const regularResources = resources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-yellow-50 via-background to-orange-50 dark:from-yellow-950/20 dark:via-background dark:to-orange-950/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-sm"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <LinkIcon className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Curated</span>
              <span className="block bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Resources
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              A collection of hand-picked resources to help you on your learning journey.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {resources.length}+
                </div>
                <div className="text-muted-foreground font-medium">Resources Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {types.length - 1}
                </div>
                <div className="text-muted-foreground font-medium">Resource Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-muted-foreground font-medium">Free & Open</div>
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
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 border-border/50 focus:border-yellow-500 transition-colors">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-yellow-500 transition-colors">
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

      {/* All Resources Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All 
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Resources</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse our collection of helpful resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card 
                key={resource.id} 
                className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(resource.url, '_blank')}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getTypeColor(resource.type)} border-0`}>
                      {resource.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {resource.tags && JSON.parse(resource.tags).slice(0, 3).map((tag:string, index:number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags && JSON.parse(resource.tags).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{JSON.parse(resource.tags).length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end">
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
                    >
                      View Resource
                    </Button>
                  </div>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>

          {resources.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No resources found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
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