'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Code, Plus, Edit, Trash2, Users, Trophy, Eye, Activity, BarChart3, ArrowLeft, Globe, Palette } from 'lucide-react';
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

interface WebContest {
    id: string;
    title: string;
    description: string;
    theme: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    requirements?: string;
    judgingCriteria?: string;
    submissionUrl?: string;
    participantCount?: number;
    submissionCount?: number;
}

export default function HostWebContestsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contests, setContests] = useState<WebContest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingContest, setEditingContest] = useState<WebContest | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        theme: '',
        prize: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        difficulty: 'BEGINNER',
        tags: '',
        requirements: '',
        judgingCriteria: '',
        submissionUrl: ''
    });

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth/signin');
            return;
        }
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

            loadContests();
        } catch (error) {
            console.error('Error checking host access:', error);
            toast.error('Error checking permissions');
            router.push('/');
        }
    };

    const loadContests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/host/web-contests');
            const data = await response.json();

            if (data.success) {
                setContests(data.data);
            }
        } catch (error) {
            console.error('Error loading contests:', error);
            toast.error('Error loading web contests');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingContest
                ? `/api/host/web-contests/${editingContest.id}`
                : '/api/host/web-contests';

            const method = editingContest ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
                    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(editingContest ? 'Web Contest updated' : 'Web Contest created');
                setIsCreateDialogOpen(false);
                setEditingContest(null);
                resetForm();
                loadContests();
            } else {
                toast.error(data.error || 'Failed to save contest');
            }
        } catch (error) {
            console.error('Error saving contest:', error);
            toast.error('Error saving contest');
        }
    };

    const handleEdit = (contest: WebContest) => {
        setEditingContest(contest);
        setFormData({
            title: contest.title,
            description: contest.description,
            theme: contest.theme,
            prize: contest.prize || '',
            maxParticipants: contest.maxParticipants?.toString() || '',
            startDate: new Date(contest.startDate).toISOString().slice(0, 16),
            endDate: new Date(contest.endDate).toISOString().slice(0, 16),
            difficulty: contest.difficulty,
            tags: '',
            requirements: contest.requirements || '',
            judgingCriteria: contest.judgingCriteria || '',
            submissionUrl: contest.submissionUrl || ''
        });
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (contestId: string) => {
        if (!confirm('Are you sure you want to delete this web contest?')) return;

        try {
            const response = await fetch(`/api/host/web-contests/${contestId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Web Contest deleted');
                loadContests();
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting contest:', error);
            toast.error('Error deleting contest');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            theme: '',
            prize: '',
            maxParticipants: '',
            startDate: '',
            endDate: '',
            difficulty: 'BEGINNER',
            tags: '',
            requirements: '',
            judgingCriteria: '',
            submissionUrl: ''
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-100 text-blue-800';
            case 'ONGOING': return 'bg-green-100 text-green-800';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Loading web contests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/host')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Code className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold">Web Contests Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => { resetForm(); setEditingContest(null); }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Web Contest
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingContest ? 'Edit Web Contest' : 'Create New Web Contest'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingContest ? 'Update contest details' : 'Fill in the details to create a new web development contest'}
                                        </DialogDescription>
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
                                                <Label htmlFor="theme">Theme</Label>
                                                <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select theme" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                                                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                                                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                                                        <SelectItem value="Landing Page">Landing Page</SelectItem>
                                                        <SelectItem value="Blog">Blog</SelectItem>
                                                        <SelectItem value="Social Media">Social Media</SelectItem>
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
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="prize">Prize (Optional)</Label>
                                                <Input
                                                    id="prize"
                                                    value={formData.prize}
                                                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                                    placeholder="e.g., $5000"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                                <Input
                                                    id="maxParticipants"
                                                    type="number"
                                                    value={formData.maxParticipants}
                                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                                    placeholder="e.g., 100"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="startDate">Start Date</Label>
                                                <Input
                                                    id="startDate"
                                                    type="datetime-local"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="endDate">End Date</Label>
                                                <Input
                                                    id="endDate"
                                                    type="datetime-local"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="difficulty">Difficulty</Label>
                                                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
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
                                            <div>
                                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                                <Input
                                                    id="tags"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="e.g., React, CSS, Responsive"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="requirements">Technical Requirements (Optional)</Label>
                                            <Textarea
                                                id="requirements"
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                                placeholder="Specify technical requirements, frameworks, or constraints"
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="judgingCriteria">Judging Criteria (Optional)</Label>
                                            <Textarea
                                                id="judgingCriteria"
                                                value={formData.judgingCriteria}
                                                onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value })}
                                                placeholder="How will submissions be evaluated?"
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="submissionUrl">Submission Instructions (Optional)</Label>
                                            <Textarea
                                                id="submissionUrl"
                                                value={formData.submissionUrl}
                                                onChange={(e) => setFormData({ ...formData, submissionUrl: e.target.value })}
                                                placeholder="Instructions for submitting projects (e.g., GitHub repo + live URL)"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                                {editingContest ? 'Update' : 'Create'} Contest
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Contests</CardTitle>
                            <Code className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{contests.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Contests</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contests.filter(c => c.status === 'ONGOING' || c.status === 'UPCOMING').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contests.reduce((sum, c) => sum + (c.participantCount || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {contests.reduce((sum, c) => sum + (c.submissionCount || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Web Contests</CardTitle>
                        <CardDescription>
                            Manage and monitor your hosted web development contests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Theme</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Participants</TableHead>
                                    <TableHead>Submissions</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contests.map((contest) => (
                                    <TableRow key={contest.id}>
                                        <TableCell className="font-medium">{contest.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1">
                                                <Globe className="w-3 h-3" />
                                                {contest.theme}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(contest.status)}>
                                                {contest.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {contest.participantCount || 0}
                                            {contest.maxParticipants && ` / ${contest.maxParticipants}`}
                                        </TableCell>
                                        <TableCell>{contest.submissionCount || 0}</TableCell>
                                        <TableCell>
                                            {new Date(contest.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.push(`/web-contests/${contest.id}`)}
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(contest)}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(contest.id)}
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
                        {contests.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-lg font-medium mb-2">No web contests created yet</p>
                                <p className="text-sm">Create your first web development contest to get started!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
