"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
}

const HostTutorialsPage = () => {
  const { data: session } = useSession();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    tags: '',
    difficulty: 'BEGINNER',
  });

  useEffect(() => {
    if (session?.user) {
      const fetchTutorials = async () => {
        try {
          const res = await fetch('/api/host/tutorials');
          if (res.ok) {
            const data = await res.json();
            setTutorials(data);
          }
        } catch (error) {
          console.error('Error fetching tutorials:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTutorials();
    }
  }, [session]);

  const handleDelete = async (tutorialId: string) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    try {
      await fetch(`/api/host/tutorials/${tutorialId}`, {
        method: 'DELETE',
      });
      setTutorials(tutorials.filter((tutorial) => tutorial.id !== tutorialId));
    } catch (error) {
      console.error('Error deleting tutorial:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      tags: '',
      difficulty: 'BEGINNER',
    });
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      description: '', // You might want to fetch the full tutorial details here
      imageUrl: '',
      videoUrl: '',
      tags: '',
      difficulty: tutorial.difficulty,
    });
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTutorial
        ? `/api/host/tutorials/${editingTutorial.id}`
        : '/api/host/tutorials';
      const method = editingTutorial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        toast.success(
          editingTutorial
            ? 'Tutorial updated successfully'
            : 'Tutorial created successfully'
        );
        setIsCreateDialogOpen(false);
        setEditingTutorial(null);
        resetForm();
        // You would typically reload the data here
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save tutorial');
      }
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast.error('Error saving tutorial');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Tutorials</CardTitle>
            <CardDescription>Manage your created tutorials.</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingTutorial(null); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Tutorial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTutorial ? 'Edit Tutorial' : 'Create New Tutorial'}</DialogTitle>
                <DialogDescription>
                  {editingTutorial ? 'Update tutorial details' : 'Fill in the details to create a new tutorial'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input id="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="EXPERT">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingTutorial ? 'Update' : 'Create'} Tutorial</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
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
                  <TableCell>
                    <Badge>{tutorial.difficulty}</Badge>
                  </TableCell>
                  <TableCell>{tutorial._count.participants}</TableCell>
                  <TableCell>
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(tutorial.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HostTutorialsPage;