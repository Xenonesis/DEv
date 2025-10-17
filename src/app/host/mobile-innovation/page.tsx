'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Smartphone, Plus, Edit, Trash2, Users, Trophy, Eye, Activity, BarChart3, ArrowLeft, Code } from 'lucide-react';
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

interface MobileInnovation {
    id: string;
    title: string;
    description: string;
    category: string;
    platform: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    requirements?: string;
    judgingCriteria?: string;
    participantCount?: number;
    submissionCount?: number;
}

export default function HostMobileInnovationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [innovations, setInnovations] = useState<MobileInnovation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingInnovation, setEditingInnovation] = useState<MobileInnovation | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        platform: '',
        techStack: '',
        prize: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        difficulty: 'BEGINNER',
        tags: '',
        requirements: '',
        judgingCriteria: ''
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

            loadInnovations();
        } catch (error) {
            console.error('Error checking host access:', error);
            toast.error('Error checking permissions');
            router.push('/');
        }
    };

    const loadInnovations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/host/mobile-innovation');
            const data = await response.json();

            if (data.success) {
                setInnovations(data.data);
            }
        } catch (error) {
            console.error('Error loading innovations:', error);
            toast.error('Error loading mobile innovations');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingInnovation
                ? `/api/host/mobile-innovation/${editingInnovation.id}`
                : '/api/host/mobile-innovation';

            const method = editingInnovation ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
                    techStack: formData.techStack ? formData.techStack.split(',').map(t => t.trim()) : [],
                    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(editingInnovation ? 'Mobile Innovation updated' : 'Mobile Innovation created');
                setIsCreateDialogOpen(false);
                setEditingInnovation(null);
                resetForm();
                loadInnovations();
            } else {
                toast.error(data.error || 'Failed to save innovation');
            }
        } catch (error) {
            console.error('Error saving innovation:', error);
            toast.error('Error saving innovation');
        }
    };

    const handleEdit = (innovation: MobileInnovation) => {
        setEditingInnovation(innovation);
        setFormData({
            title: innovation.title,
            description: innovation.description,
            category: innovation.category,
            platform: innovation.platform,
            techStack: '',
            prize: innovation.prize || '',
            maxParticipants: innovation.maxParticipants?.toString() || '',
            startDate: new Date(innovation.startDate).toISOString().slice(0, 16),
            endDate: new Date(innovation.endDate).toISOString().slice(0, 16),
            difficulty: innovation.difficulty,
            tags: '',
            requirements: innovation.requirements || '',
            judgingCriteria: innovation.judgingCriteria || ''
        });
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (innovationId: string) => {
        if (!confirm('Are you sure you want to delete this mobile innovation?')) return;

        try {
            const response = await fetch(`/api/host/mobile-innovation/${innovationId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Mobile Innovation deleted');
                loadInnovations();
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting innovation:', error);
            toast.error('Error deleting innovation');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            platform: '',
            techStack: '',
            prize: '',
            maxParticipants: '',
            startDate: '',
            endDate: '',
            difficulty: 'BEGINNER',
            tags: '',
            requirements: '',
            judgingCriteria: ''
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'ONGOING': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalParticipants = innovations.reduce((sum, i) => sum + (i.participantCount || 0), 0);
    const totalSubmissions = innovations.reduce((sum, i) => sum + (i.submissionCount || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/20 mb-4"
                        onClick={() => router.push('/host')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Smartphone className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Mobile Innovation Challenges</h1>
                            <p className="text-blue-100">Manage your mobile innovation challenges</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Challenges</p>
                                        <p className="text-2xl font-bold">{innovations.length}</p>
                                    </div>
                                    <Activity className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Participants</p>
                                        <p className="text-2xl font-bold">{totalParticipants}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Submissions</p>
                                        <p className="text-2xl font-bold">{totalSubmissions}</p>
                                    </div>
                                    <Trophy className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Active Now</p>
                                        <p className="text-2xl font-bold">
                                            {innovations.filter(i => i.status === 'ONGOING').length}
                                        </p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Your Mobile Innovations</h2>
                        <p className="text-muted-foreground">Create and manage mobile innovation challenges</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                onClick={() => {
                                    setEditingInnovation(null);
                                    resetForm();
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Innovation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingInnovation ? 'Edit Mobile Innovation' : 'Create Mobile Innovation'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingInnovation ? 'Update your mobile innovation challenge' : 'Create a new mobile innovation challenge'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Input
                                            id="category"
                                            placeholder="e.g., Health, Education"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="platform">Platform *</Label>
                                        <Select
                                            value={formData.platform}
                                            onValueChange={(value) => setFormData({ ...formData, platform: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="iOS">iOS</SelectItem>
                                                <SelectItem value="Android">Android</SelectItem>
                                                <SelectItem value="Cross-Platform">Cross-Platform</SelectItem>
                                                <SelectItem value="Web">Web</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                                        <Input
                                            id="techStack"
                                            placeholder="e.g., React Native, Firebase, TensorFlow"
                                            value={formData.techStack}
                                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="prize">Prize</Label>
                                        <Input
                                            id="prize"
                                            placeholder="e.g., $5000"
                                            value={formData.prize}
                                            onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="maxParticipants">Max Participants</Label>
                                        <Input
                                            id="maxParticipants"
                                            type="number"
                                            value={formData.maxParticipants}
                                            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="startDate">Start Date *</Label>
                                        <Input
                                            id="startDate"
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">End Date *</Label>
                                        <Input
                                            id="endDate"
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="difficulty">Difficulty *</Label>
                                        <Select
                                            value={formData.difficulty}
                                            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BEGINNER">Beginner</SelectItem>
                                                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                                <SelectItem value="ADVANCED">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                                        <Input
                                            id="tags"
                                            placeholder="e.g., mobile, AI, health"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="requirements">Requirements</Label>
                                        <Textarea
                                            id="requirements"
                                            value={formData.requirements}
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label htmlFor="judgingCriteria">Judging Criteria</Label>
                                        <Textarea
                                            id="judgingCriteria"
                                            value={formData.judgingCriteria}
                                            onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateDialogOpen(false);
                                            setEditingInnovation(null);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                    >
                                        {editingInnovation ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {innovations.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Mobile Innovations Yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first mobile innovation challenge to get started
                            </p>
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Innovation
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Participants</TableHead>
                                        <TableHead>Submissions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {innovations.map((innovation) => (
                                        <TableRow key={innovation.id}>
                                            <TableCell className="font-medium">{innovation.title}</TableCell>
                                            <TableCell>{innovation.category}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{innovation.platform}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(innovation.status)}>
                                                    {innovation.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getDifficultyColor(innovation.difficulty)}>
                                                    {innovation.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div>{formatDate(innovation.startDate)}</div>
                                                <div className="text-muted-foreground">{formatDate(innovation.endDate)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    <span>{innovation.participantCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4 text-muted-foreground" />
                                                    <span>{innovation.submissionCount || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(innovation)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(innovation.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
