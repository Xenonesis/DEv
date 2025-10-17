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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Forums</h1>
            <p className="text-gray-400">Join discussions and connect with the community</p>
          </div>
          {session && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Discussion</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Start a new discussion topic
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateForum} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Discussion title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                      required
                    />
                  </div>
                  <div>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Discussion
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading forums...</div>
        ) : forums.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No discussions yet</p>
              <p className="text-gray-500 mt-2">Be the first to start a discussion!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {forums.map((forum) => (
              <Link key={forum.id} href={`/forums/${forum.id}`}>
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {forum.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                          {forum.isLocked && <Lock className="w-4 h-4 text-red-500" />}
                          <Badge className={`${getCategoryColor(forum.category)} text-white`}>
                            {categories.find((c) => c.value === forum.category)?.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white mb-2">
                          {forum.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {forum.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{forum.replyCount} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{forum.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={forum.author.avatar || forum.author.image || '/logo.png'}
                          alt={forum.author.name || 'User'}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{forum.author.name}</span>
                        <span>•</span>
                        <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
