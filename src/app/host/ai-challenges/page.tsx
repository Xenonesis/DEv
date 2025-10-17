'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Brain, Plus, Edit, Trash2, Users, Trophy, Eye, Activity, BarChart3, ArrowLeft, Target, Database } from 'lucide-react';
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

interface AIChallenge {
    id: string;
    title: string;
    description: string;
    category: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    dataset?: string;
    evaluationMetric?: string;
    rules?: string;
    participantCount?: number;
    submissionCount?: number;
}

export default function HostAIChallengesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [challenges, setChallenges] = useState<AIChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<AIChallenge | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        prize: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        difficulty: 'BEGINNER',
        tags: '',
        dataset: '',
        evaluationMetric: '',
        rules: ''
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

            loadChallenges();
        } catch (error) {
            console.error('Error checking host access:', error);
            toast.error('Error checking permissions');
            router.push('/');
        }
    };

    const loadChallenges = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/host/ai-challenges');
            const data = await response.json();

            if (data.success) {
                setChallenges(data.data);
            }
        } catch (error) {
            console.error('Error loading challenges:', error);
            toast.error('Error loading AI challenges');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingChallenge
                ? `/api/host/ai-challenges/${editingChallenge.id}`
                : '/api/host/ai-challenges';

            const method = editingChallenge ? 'PUT' : 'POST';

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
                toast.success(editingChallenge ? 'AI Challenge updated' : 'AI Challenge created');
                setIsCreateDialogOpen(false);
                setEditingChallenge(null);
                resetForm();
                loadChallenges();
            } else {
                toast.error(data.error || 'Failed to save challenge');
            }
        } catch (error) {
            console.error('Error saving challenge:', error);
            toast.error('Error saving challenge');
        }
    };

    const handleEdit = (challenge: AIChallenge) => {
        setEditingChallenge(challenge);
        setFormData({
            title: challenge.title,
            description: challenge.description,
            category: challenge.category,
            prize: challenge.prize || '',
            maxParticipants: challenge.maxParticipants?.toString() || '',
            startDate: new Date(challenge.startDate).toISOString().slice(0, 16),
            endDate: new Date(challenge.endDate).toISOString().slice(0, 16),
            difficulty: challenge.difficulty,
            tags: '',
            dataset: challenge.dataset || '',
            evaluationMetric: challenge.evaluationMetric || '',
            rules: challenge.rules || ''
        });
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (challengeId: string) => {
        if (!confirm('Are you sure you want to delete this AI challenge?')) return;

        try {
            const response = await fetch(`/api/host/ai-challenges/${challengeId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                toast.success('AI Challenge deleted');
                loadChallenges();
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting challenge:', error);
            toast.error('Error deleting challenge');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            prize: '',
            maxParticipants: '',
            startDate: '',
            endDate: '',
            difficulty: 'BEGINNER',
            tags: '',
            dataset: '',
            evaluationMetric: '',
            rules: ''
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
                    <p>Loading AI challenges...</p>
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
                            <Brain className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold">AI Challenges Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => { resetForm(); setEditingChallenge(null); }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create AI Challenge
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingChallenge ? 'Edit AI Challenge' : 'Create New AI Challenge'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingChallenge ? 'Update challenge details' : 'Fill in the details to create a new AI challenge'}
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
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                                                        <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
                                                        <SelectItem value="Reinforcement Learning">Reinforcement Learning</SelectItem>
                                                        <SelectItem value="Time Series">Time Series</SelectItem>
                                                        <SelectItem value="Generative AI">Generative AI</SelectItem>
                                                        <SelectItem value="Speech Recognition">Speech Recognition</SelectItem>
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
                                                <Label htmlFor="evaluationMetric">Evaluation Metric</Label>
                                                <Input
                                                    id="evaluationMetric"
                                                    value={formData.evaluationMetric}
                                                    onChange={(e) => setFormData({ ...formData, evaluationMetric: e.target.value })}
                                                    placeholder="e.g., Accuracy, F1 Score"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="dataset">Dataset Info (Optional)</Label>
                                            <Textarea
                                                id="dataset"
                                                value={formData.dataset}
                                                onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
                                                placeholder="Describe the dataset or provide a link"
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="rules">Rules & Guidelines (Optional)</Label>
                                            <Textarea
                                                id="rules"
                                                value={formData.rules}
                                                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                                placeholder="Challenge rules and submission guidelines"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                                            <Input
                                                id="tags"
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                placeholder="e.g., CNN, LSTM, Transformer"
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                                {editingChallenge ? 'Update' : 'Create'} Challenge
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
                            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{challenges.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {challenges.filter(c => c.status === 'ONGOING' || c.status === 'UPCOMING').length}
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
                                {challenges.reduce((sum, c) => sum + (c.participantCount || 0), 0)}
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
                                {challenges.reduce((sum, c) => sum + (c.submissionCount || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Challenges Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your AI Challenges</CardTitle>
                        <CardDescription>
                            Manage and monitor your hosted AI challenges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Participants</TableHead>
                                    <TableHead>Submissions</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challenges.map((challenge) => (
                                    <TableRow key={challenge.id}>
                                        <TableCell className="font-medium">{challenge.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="gap-1">
                                                <Brain className="w-3 h-3" />
                                                {challenge.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(challenge.status)}>
                                                {challenge.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {challenge.participantCount || 0}
                                            {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                                        </TableCell>
                                        <TableCell>{challenge.submissionCount || 0}</TableCell>
                                        <TableCell>
                                            {new Date(challenge.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.push(`/ai-challenges/${challenge.id}`)}
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(challenge)}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(challenge.id)}
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
                        {challenges.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-lg font-medium mb-2">No AI challenges created yet</p>
                                <p className="text-sm">Create your first AI challenge to get started!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
