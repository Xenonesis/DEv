'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, Heart, Eye, Star, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import Navbar from '@/components/Navbar';

interface SuccessStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
  likes: number;
  views: number;
  isFeatured: boolean;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    avatar: string | null;
    level: number;
  };
  publishedAt: string;
}

export default function SuccessStoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: '',
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/community/success-stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      const response = await fetch('/api/community/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ title: '', excerpt: '', content: '', imageUrl: '', tags: '' });
        fetchStories();
      }
    } catch (error) {
      console.error('Error creating success story:', error);
    }
  };

  const featuredStories = stories.filter((s) => s.isFeatured);
  const regularStories = stories.filter((s) => !s.isFeatured);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Success Stories</h1>
            <p className="text-gray-400">Get inspired by amazing achievements</p>
          </div>
          {session && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Share Your Story
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Share Your Success Story</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Inspire others with your journey
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateStory} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Story title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Brief excerpt (1-2 sentences)"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your full story..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Image URL (optional)"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Share Story
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading success stories...</div>
        ) : stories.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No success stories yet</p>
              <p className="text-gray-500 mt-2">Be the first to share your story!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Featured Stories */}
            {featuredStories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-white">Featured Stories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredStories.map((story) => (
                    <Link key={story.id} href={`/success-stories/${story.id}`}>
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all cursor-pointer h-full">
                        {story.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-yellow-500">Featured</Badge>
                            {story.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="border-gray-600">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <CardTitle className="text-2xl text-white">{story.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-2">
                            {story.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={story.author.avatar || story.author.image || '/logo.png'}
                                alt={story.author.name || 'User'}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm text-white">{story.author.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(story.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>{story.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{story.views}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Stories */}
            {regularStories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">All Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularStories.map((story) => (
                    <Link key={story.id} href={`/success-stories/${story.id}`}>
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all cursor-pointer h-full">
                        {story.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img
                              src={story.imageUrl}
                              alt={story.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {story.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="border-gray-600 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <CardTitle className="text-lg text-white line-clamp-2">
                            {story.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-sm line-clamp-2">
                            {story.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={story.author.avatar || story.author.image || '/logo.png'}
                                alt={story.author.name || 'User'}
                                className="w-6 h-6 rounded-full"
                              />
                              <p className="text-xs text-gray-400">{story.author.name}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{story.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{story.views}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
