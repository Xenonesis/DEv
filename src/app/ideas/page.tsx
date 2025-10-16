'use client';

import { useState, useEffect } from 'react';
import {
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
  Brain,
  Globe,
  Users,
  Zap,
  Shield,
  Database,
  Smartphone,
  Cloud,
  ArrowRight,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Filter,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';

// Using real API data instead of mock data
const fetchIdeas = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`/api/ideas?${params}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
};

const ideas = [
  {
    id: 1,
    title: 'AI-Powered Customer Service Platform',
    category: 'Artificial Intelligence',
    description: 'Revolutionary customer service platform that uses advanced AI to provide instant, personalized support 24/7.',
    image: '/api/placeholder/400/250',
    tags: ['AI', 'Chatbot', 'NLP', 'Automation'],
    stats: {
      views: 1234,
      likes: 89,
      comments: 23
    },
    difficulty: 'Advanced',
    estimatedTime: '3-6 months',
    technologies: ['OpenAI', 'Python', 'React', 'Node.js'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 2,
    title: 'Smart Home Energy Management System',
    category: 'IoT & Smart Home',
    description: 'Intelligent energy management system that optimizes home energy consumption using IoT sensors and machine learning.',
    image: '/api/placeholder/400/250',
    tags: ['IoT', 'Energy', 'Smart Home', 'Sustainability'],
    stats: {
      views: 892,
      likes: 67,
      comments: 15
    },
    difficulty: 'Intermediate',
    estimatedTime: '2-4 months',
    technologies: ['Arduino', 'Python', 'React', 'MQTT'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'Blockchain-Based Supply Chain Tracker',
    category: 'Blockchain',
    description: 'Transparent supply chain management system using blockchain technology for complete traceability and accountability.',
    image: '/api/placeholder/400/250',
    tags: ['Blockchain', 'Supply Chain', 'Transparency', 'Security'],
    stats: {
      views: 756,
      likes: 54,
      comments: 12
    },
    difficulty: 'Advanced',
    estimatedTime: '4-8 months',
    technologies: ['Ethereum', 'Solidity', 'Web3.js', 'React'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 4,
    title: 'Mental Health Companion App',
    category: 'Healthcare',
    description: 'Comprehensive mental health support app with mood tracking, meditation guides, and professional consultation features.',
    image: '/api/placeholder/400/250',
    tags: ['Healthcare', 'Mental Health', 'Wellness', 'Mobile'],
    stats: {
      views: 1567,
      likes: 123,
      comments: 34
    },
    difficulty: 'Intermediate',
    estimatedTime: '3-5 months',
    technologies: ['React Native', 'Firebase', 'Node.js', 'TensorFlow'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 5,
    title: 'Sustainable Urban Farming Platform',
    category: 'Sustainability',
    description: 'Digital platform connecting urban farmers with consumers, promoting sustainable agriculture in cities.',
    image: '/api/placeholder/400/250',
    tags: ['Sustainability', 'Agriculture', 'Urban Farming', 'Marketplace'],
    stats: {
      views: 923,
      likes: 78,
      comments: 19
    },
    difficulty: 'Intermediate',
    estimatedTime: '2-3 months',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Google Maps API'],
    color: 'from-green-500 to-lime-500'
  },
  {
    id: 6,
    title: 'Virtual Reality Training Simulator',
    category: 'VR/AR',
    description: 'Immersive VR training platform for professional skills development with realistic scenarios and real-time feedback.',
    image: '/api/placeholder/400/250',
    tags: ['VR', 'Training', 'Education', 'Simulation'],
    stats: {
      views: 1102,
      likes: 95,
      comments: 28
    },
    difficulty: 'Advanced',
    estimatedTime: '6-12 months',
    technologies: ['Unity', 'C#', 'WebXR', 'Three.js'],
    color: 'from-indigo-500 to-purple-500'
  }
];

const categories = [
  { id: 'all', name: 'All Ideas', icon: Lightbulb },
  { id: 'ai', name: 'AI & ML', icon: Brain },
  { id: 'iot', name: 'IoT', icon: Smartphone },
  { id: 'blockchain', name: 'Blockchain', icon: Shield },
  { id: 'healthcare', name: 'Healthcare', icon: Heart },
  { id: 'sustainability', name: 'Sustainability', icon: Globe },
  { id: 'vr-ar', name: 'VR/AR', icon: Target }
];

const trendingTopics = [
  { name: 'Artificial Intelligence', count: 156, trend: 'up' },
  { name: 'Sustainable Tech', count: 89, trend: 'up' },
  { name: 'Blockchain', count: 67, trend: 'stable' },
  { name: 'IoT Solutions', count: 45, trend: 'up' },
  { name: 'VR/AR Applications', count: 34, trend: 'up' }
];

export default function IdeasPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [ideasData, setIdeasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load ideas data
  useEffect(() => {
    const loadIdeas = async () => {
      setLoading(true);
      const data = await fetchIdeas({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: 'votes'
      });
      setIdeasData(data);
      setLoading(false);
    };

    loadIdeas();
  }, [selectedCategory]);

  const filteredIdeas = ideasData.filter(idea => {
    const difficultyMatch = selectedDifficulty === 'all' ||
      (idea.difficulty && idea.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    return difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NeoFest
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-purple-600 transition-colors">Home</a>
              <a href="/functionalities" className="text-foreground hover:text-purple-600 transition-colors">Functionalities</a>
              <a href="/ideas" className="text-purple-600 font-medium">Ideas</a>
              <a href="/#about" className="text-foreground hover:text-purple-600 transition-colors">About</a>
              <a href="/#contact" className="text-foreground hover:text-purple-600 transition-colors">Contact</a>
              <ThemeToggle />
              <Button>Get Started</Button>
            </div>

            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Innovation Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transformative
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Project Ideas
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore innovative project concepts that leverage cutting-edge technologies to solve real-world problems.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-muted-foreground">Project Ideas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-muted-foreground">Technologies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-muted-foreground">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-muted-foreground">Industries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <category.icon className="w-4 h-4 mr-2" />
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Difficulty</h4>
                    <div className="space-y-2">
                      {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <Button
                          key={level}
                          variant={selectedDifficulty === level.toLowerCase() ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedDifficulty(level.toLowerCase())}
                        >
                          {level === 'all' ? 'All Levels' : level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Trending Topics</h4>
                    <div className="space-y-2">
                      {trendingTopics.map((topic) => (
                        <div key={topic.name} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{topic.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {topic.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ideas Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {filteredIdeas.length} Project Ideas
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Latest
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popular
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {filteredIdeas.map((idea) => (
                  <Card key={idea.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className={`h-48 bg-gradient-to-br ${idea.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 mb-2">
                          {idea.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-white line-clamp-2">
                          {idea.title}
                        </h3>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardDescription className="text-base line-clamp-3">
                        {idea.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {idea.stats.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {idea.stats.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {idea.stats.comments}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {idea.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {idea.estimatedTime}
                        </div>
                        <Button size="sm">
                          Explore Idea
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Idea Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Lightbulb className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Have an Innovative Idea?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Share your project concept with our community and collaborate with talented developers to bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                Submit Your Idea
                <Rocket className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-purple-600">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}