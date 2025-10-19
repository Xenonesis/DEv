'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Plus, Edit, Trash2, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Tutorial {
  id: string;
  title: string;
  difficulty: string;
  createdAt: string;
  _count: {
    participants: number;
  };
  participants?: any[];
}

export default function HostTutorialsPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [stats, setStats] = useState({ totalTutorials: 0, totalParticipants: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [viewingParticipants, setViewingParticipants] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', imageUrl: '', videoUrl: '', tags: '', difficulty: 'BEGINNER'
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/signin'); return; }
    checkHostAccess();
  }, [session, status, router]);

  const checkHostAccess = async () => {
    try {
      const response = await fetch('/api/host/check-access');
      const data = await response.json();
      if (!data.success || !data.isHost) {
        toast.error('Host privileges required');
        router.push('/');
        return;
      }
      loadData();
    } catch (error) {
      toast.error('Error checking permissions');
      router.push('/');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [tutorialsRes, statsRes] = await Promise.all([
        fetch('/api/host/tutorials'),
        fetch('/api/host/tutorials-stats')
      ]);
      const tutorialsData = await tutorialsRes.json();
      const statsData = await statsRes.json();
      if (tutorialsData.success) setTutorials(tutorialsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTutorial ? `/api/host/tutorials/${editingTutorial.id}` : '/api/host/tutorials';
      const method = editingTutorial ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingTutorial ? 'Tutorial updated' : 'Tutorial created');
        setIsCreateDialogOpen(false);
        setEditingTutorial(null);
        resetForm();
        loadData();
      } else {
        toast.error(data.error || 'Failed to save tutorial');
      }
    } catch (error) {
      toast.error('Error saving tutorial');
    }
  };

  const handleEdit = async (tutorial: Tutorial) => {
    try {
      const response = await fetch(`/api/host/tutorials/${tutorial.id}`);
      const data = await response.json();
      if (data.success) {
        const fullTutorial = data.data;
        setEditingTutorial(fullTutorial);
        setFormData({
          title: fullTutorial.title,
          description: fullTutorial.description,
          imageUrl: fullTutorial.imageUrl || '',
          videoUrl: fullTutorial.videoUrl || '',
          tags: fullTutorial.tags ? JSON.parse(fullTutorial.tags).join(', ') : '',
          difficulty: fullTutorial.difficulty
        });
        setIsCreateDialogOpen(true);
      } else {
        toast.error('Failed to load tutorial details');
      }
    } catch (error) {
      toast.error('Error loading tutorial details');
    }
  };

  const handleDelete = async (tutorialId: string) => {
    if (!confirm('Delete this tutorial?')) return;
    try {
      const response = await fetch(`/api/host/tutorials/${tutorialId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Tutorial deleted');
        loadData();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting tutorial');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', imageUrl: '', videoUrl: '', tags: '', difficulty: 'BEGINNER'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold">Tutorials Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingTutorial(null); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tutorial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTutorial ? 'Edit Tutorial' : 'Create New Tutorial'}</DialogTitle>
                    <DialogDescription>Fill in the tutorial details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Select value={formData.difficulty} onValueChange={(v: any) => setFormData({ ...formData, difficulty: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                            <SelectItem value="EXPERT">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Image URL</Label>
                        <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="Optional" />
                      </div>
                      <div>
                        <Label>Video URL</Label>
                        <Input value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="Optional" />
                      </div>
                    </div>
                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Optional" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">{editingTutorial ? 'Update' : 'Create'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button onClick={() => router.push('/host')} variant="outline">Back</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Tutorials</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalTutorials}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Participants</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalParticipants}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Tutorials</CardTitle>
            <CardDescription>Manage all your tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            {tutorials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutorials.map((tutorial) => (
                    <TableRow key={tutorial.id}>
                      <TableCell className="font-medium">{tutorial.title}</TableCell>
                      <TableCell><Badge>{tutorial.difficulty}</Badge></TableCell>
                      <TableCell>{tutorial._count.participants}</TableCell>
                      <TableCell>{new Date(tutorial.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewingParticipants(tutorial)}><Users className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(tutorial)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(tutorial.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No tutorials yet. Create your first tutorial!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewingParticipants} onOpenChange={() => setViewingParticipants(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participants - {viewingParticipants?.title}</DialogTitle>
            <DialogDescription>{viewingParticipants?._count.participants || 0} enrolled</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {viewingParticipants?.participants && viewingParticipants.participants.length > 0 ? (
              <div className="space-y-3">
                {viewingParticipants.participants.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{p.user.name}</p>
                      <p className="text-sm text-muted-foreground">{p.user.email}</p>
                    </div>
                    <p className="text-sm">{new Date(p.registeredAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No participants yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}