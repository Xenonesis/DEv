'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Eye, Pin, Lock, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  replyCount: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    avatar: string | null;
  };
  createdAt: string;
}

const categories = [
  { value: 'GENERAL', label: 'General' },
  { value: 'HELP', label: 'Help & Support' },
  { value: 'SHOWCASE', label: 'Showcase' },
  { value: 'ANNOUNCEMENTS', label: 'Announcements' },
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'CAREER', label: 'Career' },
];

export default function ForumsPage() {
  const { data: session } = useSession();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
  });

  useEffect(() => {
    fetchForums();
  }, [selectedCategory]);

  const fetchForums = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/community/forums'
        : `/api/community/forums?category=${selectedCategory}`;
      const response = await fetch(url);
      const data = await response.json();
      setForums(data);
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/community/forums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ title: '', description: '', category: 'GENERAL' });
        fetchForums();
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      GENERAL: 'bg-blue-500',
      HELP: 'bg-green-500',
      SHOWCASE: 'bg-purple-500',
      ANNOUNCEMENTS: 'bg-yellow-500',
      FEEDBACK: 'bg-pink-500',
      TECHNICAL: 'bg-red-500',
      CAREER: 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-gradient-to-r from-purple-400/10 to-blue-400/10 blur-sm"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-xl">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Community
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Forums
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join discussions, share knowledge, and connect with fellow developers and tech enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Start Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Create New Discussion</DialogTitle>
                      <DialogDescription>
                        Start a new topic and engage with the community
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateForum} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Enter discussion title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe your topic in detail..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="min-h-[120px] resize-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Create Discussion
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              {!session && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                >
                  Sign In to Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[240px] h-11 border-border/50 focus:border-purple-500 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Forums List Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading discussions...</p>
            </div>
          ) : forums.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full mb-6">
                  <MessageSquare className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Discussions Yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to start a conversation!</p>
                {session && (
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start First Discussion
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {forums.map((forum, index) => (
                <Link key={forum.id} href={`/forums/${forum.id}`}>
                  <Card 
                    className="group hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 overflow-hidden relative cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/10 dark:to-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {forum.isPinned && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                <Pin className="w-3 h-3 text-yellow-600" />
                                <span className="text-xs font-medium text-yellow-600">Pinned</span>
                              </div>
                            )}
                            {forum.isLocked && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                                <Lock className="w-3 h-3 text-red-600" />
                                <span className="text-xs font-medium text-red-600">Locked</span>
                              </div>
                            )}
                            <Badge className={`${getCategoryColor(forum.category)} text-white border-0`}>
                              {categories.find((c) => c.value === forum.category)?.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                            {forum.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {forum.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{forum.replyCount}</span>
                            <span className="hidden sm:inline">replies</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{forum.views}</span>
                            <span className="hidden sm:inline">views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={forum.author.avatar || forum.author.image || '/logo.png'}
                            alt={forum.author.name || 'User'}
                            className="w-8 h-8 rounded-full border-2 border-background"
                          />
                          <div className="hidden sm:block">
                            <p className="text-sm font-medium">{forum.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(forum.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                </Link>
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
      `}</style>
    </div>
  );
}
