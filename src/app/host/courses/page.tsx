'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Activity,
  Brain,
  Code,
  Smartphone,
  Calendar,
  Search,
  Film,
  Link,
  UserCheck,
  Trophy,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  title: string;
  difficulty: string;
  createdAt: string;
  _count: {
    participants: number;
  };
  participants?: any[];
}

export default function HostCoursesPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalParticipants: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingParticipants, setViewingParticipants] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('ALL');
  const [formData, setFormData] = useState({
    title: '', description: '', imageUrl: '', tags: '', difficulty: 'BEGINNER'
  });

  // Filtered courses with search and difficulty filter
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'ALL' || course.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [courses, searchTerm, difficultyFilter]);

  const hasFiltersApplied = searchTerm !== '' || difficultyFilter !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('ALL');
  };

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
      const [coursesRes, statsRes] = await Promise.all([
        fetch('/api/host/courses'),
        fetch('/api/host/courses-stats')
      ]);
      const coursesData = await coursesRes.json();
      const statsData = await statsRes.json();
      if (coursesData.success) setCourses(coursesData.data);
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
      const url = editingCourse ? `/api/host/courses/${editingCourse.id}` : '/api/host/courses';
      const method = editingCourse ? 'PUT' : 'POST';
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
        toast.success(editingCourse ? 'Course updated' : 'Course created');
        setIsCreateDialogOpen(false);
        setEditingCourse(null);
        resetForm();
        loadData();
      } else {
        toast.error(data.error || 'Failed to save course');
      }
    } catch (error) {
      toast.error('Error saving course');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: '', // You might want to fetch the full course details here
      imageUrl: '',
      tags: '',
      difficulty: course.difficulty
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      const response = await fetch(`/api/host/courses/${courseId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Course deleted');
        loadData();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting course');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', imageUrl: '', tags: '', difficulty: 'BEGINNER'
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
      <Navbar />
      
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold">Courses Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingCourse(null); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                    <DialogDescription>Fill in the course details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title"
                          value={formData.title} 
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select 
                          value={formData.difficulty} 
                          onValueChange={(v: any) => setFormData({ ...formData, difficulty: v })}
                        >
                          <SelectTrigger id="difficulty">
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
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        required 
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input 
                          id="imageUrl"
                          value={formData.imageUrl} 
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
                          placeholder="Optional" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input 
                          id="tags"
                          value={formData.tags} 
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                          placeholder="e.g., React, TypeScript"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingCourse ? 'Update' : 'Create'} Course
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button onClick={() => router.push('/')} variant="outline">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Management Hub</CardTitle>
                <CardDescription>Navigate to different sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Hackathons
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/ai-challenges')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Challenges
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/web-contests')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Web Contests
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/mobile-innovation')}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile Innovation
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/events')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/conferences')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Conferences
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/tutorials')}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Tutorials
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/resources')}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Resources
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => router.push('/host/mentorship')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Mentorship
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    All time courses
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled students
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{filteredCourses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Matching filters
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Courses Table */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Your Courses</CardTitle>
                    <CardDescription>Manage all your courses</CardDescription>
                  </div>
                  {hasFiltersApplied && (
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  )}
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={difficultyFilter}
                    onValueChange={(value) => setDifficultyFilter(value as any)}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All difficulties</SelectItem>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="EXPERT">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtered Summary */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Showing</p>
                    <p className="text-xl font-semibold">{filteredCourses.length}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Total enrolled</p>
                    <p className="text-xl font-semibold">
                      {filteredCourses.reduce((sum, c) => sum + (c._count?.participants || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Avg. per course</p>
                    <p className="text-xl font-semibold">
                      {filteredCourses.length > 0 
                        ? Math.round(filteredCourses.reduce((sum, c) => sum + (c._count?.participants || 0), 0) / filteredCourses.length)
                        : 0
                      }
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">From total</p>
                    <p className="text-xl font-semibold">{courses.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourses.length > 0 ? (
                  <ScrollArea className="-mx-4 sm:mx-0">
                    <div className="min-w-[720px] px-4 sm:px-0">
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
                          {filteredCourses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{course.difficulty}</Badge>
                              </TableCell>
                              <TableCell>{course._count.participants}</TableCell>
                              <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setViewingParticipants(course)}
                                    title="View Participants"
                                  >
                                    <Users className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => router.push(`/courses/${course.id}`)}
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleEdit(course)}
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    onClick={() => handleDelete(course.id)}
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No courses match your filters</p>
                    <p className="text-sm">Try adjusting the filters or create a new course to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Participants Dialog */}
      <Dialog open={!!viewingParticipants} onOpenChange={() => setViewingParticipants(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Participants - {viewingParticipants?.title}</DialogTitle>
            <DialogDescription>
              {viewingParticipants?._count.participants || 0} enrolled students
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            {viewingParticipants?.participants && viewingParticipants.participants.length > 0 ? (
              <div className="space-y-3">
                {viewingParticipants.participants.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold">{p.user.name}</p>
                      <p className="text-sm text-muted-foreground">{p.user.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(p.registeredAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No participants yet</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}