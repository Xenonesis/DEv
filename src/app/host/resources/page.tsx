'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Edit, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

export default function HostResourcesPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState({ totalResources: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
    tags: '',
    type: 'ARTICLE',
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
      const [resourcesRes, statsRes] = await Promise.all([
        fetch('/api/host/resources'),
        fetch('/api/host/resources-stats')
      ]);
      const resourcesData = await resourcesRes.json();
      const statsData = await statsRes.json();
      if (resourcesData.success) setResources(resourcesData.data);
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
      const url = editingResource ? `/api/host/resources/${editingResource.id}` : '/api/host/resources';
      const method = editingResource ? 'PUT' : 'POST';
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
        toast.success(editingResource ? 'Resource updated' : 'Resource created');
        setIsCreateDialogOpen(false);
        setEditingResource(null);
        resetForm();
        loadData();
      } else {
        toast.error(data.error || 'Failed to save resource');
      }
    } catch (error) {
      toast.error('Error saving resource');
    }
  };

  const handleEdit = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/host/resources/${resource.id}`);
      const data = await response.json();
      if (data.success) {
        const fullResource = data.data;
        setEditingResource(fullResource);
        setFormData({
          title: fullResource.title,
          description: fullResource.description,
          url: fullResource.url,
          imageUrl: fullResource.imageUrl || '',
          tags: fullResource.tags ? JSON.parse(fullResource.tags).join(', ') : '',
          type: fullResource.type
        });
        setIsCreateDialogOpen(true);
      } else {
        toast.error('Failed to load resource details');
      }
    } catch (error) {
      toast.error('Error loading resource details');
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Delete this resource?')) return;
    try {
      const response = await fetch(`/api/host/resources/${resourceId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Resource deleted');
        loadData();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting resource');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', url: '', imageUrl: '', tags: '', type: 'ARTICLE'
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
              <BookOpen className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold">Resources Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingResource(null); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
                    <DialogDescription>Fill in the resource details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ARTICLE">Article</SelectItem>
                            <SelectItem value="VIDEO">Video</SelectItem>
                            <SelectItem value="TOOL">Tool</SelectItem>
                            <SelectItem value="BOOK">Book</SelectItem>
                            <SelectItem value="PAPER">Paper</SelectItem>
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
                        <Label>URL</Label>
                        <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="Optional" />
                      </div>
                    </div>
                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Optional" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">{editingResource ? 'Update' : 'Create'}</Button>
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
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Resources</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalResources}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Resource Types</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{[...new Set(resources.map(r => r.type))].length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Resources</CardTitle>
            <CardDescription>Manage all your resources</CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell><Badge>{resource.type}</Badge></TableCell>
                      <TableCell>{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(resource.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No resources yet. Create your first resource!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}