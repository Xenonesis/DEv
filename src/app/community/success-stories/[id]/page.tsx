'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SuccessStory {
  id: string;
  title: string;
  content: string;
  excerpt: string;
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
    bio: string | null;
  };
  publishedAt: string;
}

export default function SuccessStoryDetailPage() {
  const params = useParams();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/community/success-stories/${params.id}`);
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error('Error fetching success story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-400">Success story not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/community/success-stories">
        <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Success Stories
        </Button>
      </Link>

      <article>
        {story.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {story.isFeatured && (
              <Badge className="bg-yellow-500">Featured</Badge>
            )}
            {story.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="border-gray-600">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{story.title}</h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <img
                src={story.author.avatar || story.author.image || '/logo.png'}
                alt={story.author.name || 'User'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{story.author.name}</p>
                <p className="text-sm text-gray-400">Level {story.author.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(story.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{story.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{story.views}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 mb-6 italic">{story.excerpt}</p>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {story.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {story.author.bio && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                About the Author
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={story.author.avatar || story.author.image || '/logo.png'}
                  alt={story.author.name || 'User'}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {story.author.name}
                  </h3>
                  <p className="text-gray-400">{story.author.bio}</p>
                  <Badge variant="outline" className="mt-2 border-gray-600">
                    Level {story.author.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
}
