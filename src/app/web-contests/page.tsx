'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Users, Trophy, ExternalLink, Code, Globe, Palette, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

interface WebContest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
  difficulty: string;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  submissions: number;
  tags: string[];
  organizer: string;
  registrationDeadline: string;
  status: string;
  featured?: boolean;
}

const fetchWebContests = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`/api/web-contests?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching web contests:', error);
    return [];
  }
};

export default function WebContestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [contests, setContests] = useState<WebContest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContests = async () => {
      setLoading(true);
      const data = await fetchWebContests({
        search: searchTerm,
        theme: selectedTheme !== 'all' ? selectedTheme : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        sort: sortBy
      });
      setContests(data);
      setLoading(false);
    };

    loadContests();
  }, [searchTerm, selectedTheme, selectedDifficulty, sortBy]);

  const themes = ['all', 'E-commerce', 'Portfolio', 'Dashboard', 'Landing Page', 'Blog', 'Social Media'];
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

  const featuredContests = contests.filter(c => c.featured);
  const regularContests = contests.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mb-8 shadow-2xl">
              <Code className="text-white" size={40} />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              <span className="block">Web Development</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Contests
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Showcase your web development skills, build amazing projects, and win prizes in exciting competitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {contests.length}+
                </div>
                <div className="text-muted-foreground font-medium">Active Contests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  ${contests.reduce((sum, c) => sum + c.prizePool, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground font-medium">Total Prizes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {contests.reduce((sum, c) => sum + c.participants, 0)}+
                </div>
                <div className="text-muted-foreground font-medium">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search contests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme} value={theme}>
                      {theme === 'all' ? 'All Themes' : theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-12">
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
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Start Date</SelectItem>
                  <SelectItem value="prize">Prize Pool</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contests */}
      {featuredContests.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 text-purple-600 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Trophy size={18} />
                <span className="font-semibold">Featured Contests</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                High-Prize <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Opportunities</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} router={router} getDifficultyColor={getDifficultyColor} formatDate={formatDate} isRegistrationOpen={isRegistrationOpen} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Contests */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Web Contests</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 w-20 bg-muted rounded mb-2"></div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularContests.map((contest, index) => (
                <ContestCard key={contest.id} contest={contest} router={router} getDifficultyColor={getDifficultyColor} formatDate={formatDate} isRegistrationOpen={isRegistrationOpen} index={index} />
              ))}
            </div>
          )}

          {!loading && contests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No web contests found.</div>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedTheme('all'); setSelectedDifficulty('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ContestCard({ contest, router, getDifficultyColor, formatDate, isRegistrationOpen, featured = false, index = 0 }: any) {
  return (
    <Card
      className={`group hover:shadow-xl ${featured ? 'hover:shadow-2xl' : 'hover:scale-[1.02]'} transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden cursor-pointer`}
      onClick={() => router.push(`/web-contests/${contest.id}`)}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
            <Trophy className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getDifficultyColor(contest.difficulty)}>
            {contest.difficulty}
          </Badge>
        </div>
        <CardTitle className={`${featured ? 'text-xl' : 'text-lg'} line-clamp-2 group-hover:text-purple-600 transition-colors`}>
          {contest.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {contest.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{formatDate(contest.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span className="text-xs truncate max-w-[120px]">{contest.theme}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {contest.tags.slice(0, 3).map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {contest.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{contest.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">${contest.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{contest.participants}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
            disabled={!isRegistrationOpen(contest.registrationDeadline)}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/web-contests/${contest.id}`);
            }}
          >
            {isRegistrationOpen(contest.registrationDeadline) ? 'Join Contest' : 'Closed'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/web-contests/${contest.id}`);
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Reg. deadline: {formatDate(contest.registrationDeadline)}
        </div>
      </CardContent>
    </Card>
  );
}
