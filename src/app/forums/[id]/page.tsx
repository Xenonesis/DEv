'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowLeft, MessageSquare, Eye, Pin, Lock, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';

interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    avatar: string | null;
  };
  createdAt: string;
}

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    avatar: string | null;
  };
  replies: ForumReply[];
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

export default function ForumDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [forum, setForum] = useState<Forum | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchForum();
    }
  }, [params.id]);

  const fetchForum = async () => {
    try {
      const response = await fetch(`/api/community/forums/${params.id}`);
      const data = await response.json();
      setForum(data);
    } catch (error) {
      console.error('Error fetching forum:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/community/forums/${params.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyContent('');
        fetchForum();
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-400">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!forum) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-400">Forum not found</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/forums">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forums
          </Button>
        </Link>

        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-3">
              {forum.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
              {forum.isLocked && <Lock className="w-4 h-4 text-red-500" />}
              <Badge className={`${getCategoryColor(forum.category)} text-white`}>
                {categories.find((c) => c.value === forum.category)?.label}
              </Badge>
            </div>
            <CardTitle className="text-3xl text-white mb-4">{forum.title}</CardTitle>
            <p className="text-gray-300 text-lg">{forum.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{forum.replies.length} replies</span>
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
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="text-white">{forum.author.name}</div>
                  <div className="text-xs">{new Date(forum.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Replies ({forum.replies.length})</h2>
          {forum.replies.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="py-8 text-center text-gray-400">
                No replies yet. Be the first to reply!
              </CardContent>
            </Card>
          ) : (
            forum.replies.map((reply) => (
              <Card key={reply.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <img
                      src={reply.author.avatar || reply.author.image || '/logo.png'}
                      alt={reply.author.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{reply.author.name}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {session && !forum.isLocked && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                  required
                />
                <Button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Posting...' : 'Post Reply'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!session && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-8 text-center">
              <p className="text-gray-400">
                Please <Link href="/auth/signin" className="text-purple-400 hover:underline">sign in</Link> to reply
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </>
  );
}
