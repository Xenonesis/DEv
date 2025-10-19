"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Filter, ChevronLeft, ChevronRight, Plus, Sparkles, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Mentor {
  id: string;
  name: string | null;
  image: string | null;
  skills: string | null;
  bio: string | null;
  featured: boolean;
}

// Fetch mentors from real API
const fetchMentors = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await fetch(`/api/mentors?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
};

export default function MentorshipPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [goals, setGoals] = useState('');
  const { data: session } = useSession();

  // Load mentors data
  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true);
      const data = await fetchMentors({
        search: searchTerm,
        skill: selectedSkill !== 'all' ? selectedSkill : undefined,
        sort: sortBy
      });
      setMentors(data);
      setLoading(false);
    };

    loadMentors();
  }, [searchTerm, selectedSkill, sortBy]);

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

  const allSkills = mentors.reduce((acc: string[], mentor) => {
    if (mentor.skills) {
      const skills = JSON.parse(mentor.skills);
      skills.forEach((skill: string) => {
        if (!acc.includes(skill)) {
          acc.push(skill);
        }
      });
    }
    return acc;
  }, []);

  const handleApply = async () => {
    if (!session || !selectedMentor) return;

    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          goals,
        }),
      });

      if (res.ok) {
        // Handle success (e.g., show a toast, close the dialog)
        setSelectedMentor(null);
        setGoals('');
      }
    } catch (error) {
      console.error('Error applying for mentorship:', error);
    }
  };
  
  const featuredMentors = mentors.filter(m => m.featured);
  const regularMentors = mentors.filter(m => !m.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="pt-20 pb-16 bg-gradient-to-br from-pink-50 via-background to-rose-50 dark:from-pink-950/20 dark:via-background dark:to-rose-950/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-pink-400/10 to-rose-400/10 blur-sm"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl mb-8 animate-scale-pulse shadow-2xl">
              <Users className="text-white" size={40} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="block">Grow with</span>
              <span className="block bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent bg-size-200 animate-gradient-shift">
                Mentorship
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              Connect with experienced mentors to guide you on your career path.
            </p>

            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  {mentors.length}+
                </div>
                <div className="text-muted-foreground font-medium">Available Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-muted-foreground font-medium">Areas of Expertise</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-muted-foreground font-medium">Successful Mentees</div>
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
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/50 focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Skill Filter */}
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="h-12 border-border/50 focus:border-pink-500 transition-colors">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-border/50 focus:border-pink-500 transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* All Mentors Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our 
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> Mentors</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Find the right mentor to help you achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor, index) => (
              <Card 
                key={mentor.id} 
                className="group hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={mentor.image || ''} />
                    <AvatarFallback>{mentor.name?.charAt(0) || 'M'}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {mentor.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {mentor.bio}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {mentor.skills && JSON.parse(mentor.skills).slice(0, 3).map((skill:string, index:number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.skills && JSON.parse(mentor.skills).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{JSON.parse(mentor.skills).length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action */}
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        setSelectedMentor(mentor);
                      } else {
                        setSelectedMentor(null);
                        setGoals('');
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-300"
                      >
                        Request Mentorship
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply for mentorship with {selectedMentor?.name}</DialogTitle>
                        <DialogDescription>
                          Tell us about your goals for this mentorship.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="goals" className="text-right">Goals</Label>
                          <Textarea
                            id="goals"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <Button onClick={handleApply}>Submit Request</Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {mentors.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No mentors found matching your criteria.</div>
              <Button 
                variant="outline" 
                className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('all');
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