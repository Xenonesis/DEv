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

interface Resource {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

const HostResourcesPage = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
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
    if (session?.user) {
      const fetchResources = async () => {
        try {
          const res = await fetch('/api/host/resources');
          if (res.ok) {
            const data = await res.json();
            setResources(data);
          }
        } catch (error) {
          console.error('Error fetching resources:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchResources();
    }
  }, [session]);

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await fetch(`/api/host/resources/${resourceId}`, {
        method: 'DELETE',
      });
      setResources(resources.filter((resource) => resource.id !== resourceId));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      imageUrl: '',
      tags: '',
      type: 'ARTICLE',
    });
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: '', // You might want to fetch the full resource details here
      url: '',
      imageUrl: '',
      tags: '',
      type: resource.type,
    });
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingResource
        ? `/api/host/resources/${editingResource.id}`
        : '/api/host/resources';
      const method = editingResource ? 'PUT' : 'POST';

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
          editingResource
            ? 'Resource updated successfully'
            : 'Resource created successfully'
        );
        setIsCreateDialogOpen(false);
        setEditingResource(null);
        resetForm();
        // You would typically reload the data here
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save resource');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Error saving resource');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Resources</CardTitle>
            <CardDescription>Manage your created resources.</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingResource(null); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
                <DialogDescription>
                  {editingResource ? 'Update resource details' : 'Fill in the details to create a new resource'}
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
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARTICLE">Article</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="TOOL">Tool</SelectItem>
                      <SelectItem value="BOOK">Book</SelectItem>
                      <SelectItem value="PAPER">Paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingResource ? 'Update' : 'Create'} Resource</Button>
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
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>
                    <Badge>{resource.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(resource.id)}>
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

export default HostResourcesPage;