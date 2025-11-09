'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Brain,
    Plus,
    Edit,
    Trash2,
    Users,
    Trophy,
    Eye,
    Activity,
    BarChart3,
    Calendar,
    Code,
    Smartphone,
    Search,
    BookOpen,
    Film,
    Link,
    UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

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
    const [viewingParticipants, setViewingParticipants] = useState<AIChallenge | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('ALL');
    const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('ALL');

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
                    maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : null,
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

    const filteredChallenges = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return challenges
            .filter((challenge) => {
                if (!normalizedSearch) return true;

                const searchableFields = [
                    challenge.title,
                    challenge.category,
                    challenge.description,
                    challenge.prize,
                    challenge.dataset,
                    challenge.evaluationMetric
                ]
                    .filter(Boolean)
                    .map((value) => value!.toString().toLowerCase());

                return searchableFields.some((field) => field.includes(normalizedSearch));
            })
            .filter((challenge) => statusFilter === 'ALL' || challenge.status === statusFilter)
            .filter((challenge) => difficultyFilter === 'ALL' || challenge.difficulty === difficultyFilter)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [challenges, searchTerm, statusFilter, difficultyFilter]);

    const filteredSummary = useMemo(() => {
        if (filteredChallenges.length === 0) {
            return {
                active: 0,
                upcoming: 0,
                averageParticipants: 0,
                completionRate: 0
            };
        }

        const active = filteredChallenges.filter((challenge) => challenge.status === 'ONGOING').length;
        const upcoming = filteredChallenges.filter((challenge) => challenge.status === 'UPCOMING').length;
        const totalParticipants = filteredChallenges.reduce((acc, challenge) => acc + (challenge.participantCount ?? 0), 0);
        const averageParticipants = filteredChallenges.length
            ? Math.round(totalParticipants / filteredChallenges.length)
            : 0;
        const completionRate = filteredChallenges.length
            ? Math.round(
                (filteredChallenges.filter((challenge) => challenge.status === 'COMPLETED').length /
                    filteredChallenges.length) *
                    100
            )
            : 0;

        return {
            active,
            upcoming,
            averageParticipants,
            completionRate
        };
    }, [filteredChallenges]);

    const hasFiltersApplied = useMemo(() => {
        return statusFilter !== 'ALL' || difficultyFilter !== 'ALL' || searchTerm.trim() !== '';
    }, [statusFilter, difficultyFilter, searchTerm]);

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setDifficultyFilter('ALL');
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
            <Navbar />
            
            {/* Host Panel Header */}
            <div className="pt-20 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Brain className="w-8 h-8 text-blue-600 mr-3" />
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
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                            <Button type="submit">
                                                {editingChallenge ? 'Update' : 'Create'} Challenge
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
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Hackathons
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="w-full justify-start bg-accent"
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
                                    variant="ghost" 
                                    className="w-full justify-start"
                                    onClick={() => router.push('/host/courses')}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                                    <Brain className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{challenges.length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {challenges.filter(c => c.status === 'COMPLETED').length} completed
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                                    <Activity className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{challenges.filter(c => c.status === 'ONGOING').length}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Currently running
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{challenges.reduce((sum, c) => sum + (c.participantCount || 0), 0)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across all challenges
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                                    <Trophy className="h-4 w-4 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {challenges.length > 0 ? Math.round((challenges.filter(c => c.status === 'COMPLETED').length / challenges.length) * 100) : 0}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Completion rate
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* AI Challenges Management */}
                        <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Your AI Challenges</CardTitle>
                                <CardDescription>Manage and monitor every AI challenge in one place</CardDescription>
                            </div>
                            {hasFiltersApplied && (
                                <Button size="sm" variant="ghost" onClick={resetFilters}>
                                    Reset filters
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search by title, category or description"
                                    className="pl-9"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All statuses</SelectItem>
                                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={difficultyFilter}
                                onValueChange={(value: any) => setDifficultyFilter(value)}
                            >
                                <SelectTrigger className="w-full">
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
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Active challenges</p>
                                <p className="text-xl font-semibold">{filteredSummary.active}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Upcoming challenges</p>
                                <p className="text-xl font-semibold">{filteredSummary.upcoming}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Avg. participants</p>
                                <p className="text-xl font-semibold">{filteredSummary.averageParticipants}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Completion rate</p>
                                <p className="text-xl font-semibold">{filteredSummary.completionRate}%</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Tabs defaultValue="list" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                                <TabsTrigger value="list">List view</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            </TabsList>
                            <TabsContent value="list" className="space-y-4">
                                {filteredChallenges.length > 0 ? (
                                    <ScrollArea className="-mx-4 sm:mx-0">
                                        <div className="min-w-[720px] px-4 sm:px-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Difficulty</TableHead>
                                                        <TableHead>Participants</TableHead>
                                                        <TableHead>Submissions</TableHead>
                                                        <TableHead>Start</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredChallenges.map((challenge) => (
                                                        <TableRow key={challenge.id}>
                                                            <TableCell className="font-medium">{challenge.title}</TableCell>
                                                            <TableCell className="text-muted-foreground">{challenge.category}</TableCell>
                                                            <TableCell>
                                                                <Badge className={getStatusColor(challenge.status)}>
                                                                    {challenge.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {challenge.difficulty}
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
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setViewingParticipants(challenge)}
                                                                        title="View Participants"
                                                                    >
                                                                        <Users className="w-4 h-4" />
                                                                    </Button>
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
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                                        <p className="text-lg font-semibold">No AI challenges match your filters</p>
                                        <p className="text-sm">Try adjusting the filters or create a new AI challenge to get started.</p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="timeline" className="space-y-4">
                                {filteredChallenges.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredChallenges.map((challenge) => (
                                            <div
                                                key={`${challenge.id}-timeline`}
                                                className="rounded-xl border bg-muted/30 p-4 shadow-sm transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <Badge className={getStatusColor(challenge.status)}>
                                                                {challenge.status}
                                                            </Badge>
                                                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {challenge.difficulty}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{challenge.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{challenge.category}</p>
                                                        </div>
                                                        {challenge.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {challenge.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4" />
                                                            <span>
                                                                {new Date(challenge.startDate).toLocaleDateString()} –{' '}
                                                                {new Date(challenge.endDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>
                                                                {challenge.participantCount || 0}
                                                                {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                                                                {' '}participants
                                                            </span>
                                                        </div>
                                                        {challenge.prize && (
                                                            <div className="flex items-center gap-2">
                                                                <Trophy className="h-4 w-4" />
                                                                <span>{challenge.prize}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <BarChart3 className="h-4 w-4" />
                                                            <span>
                                                                {challenge.submissionCount || 0} submissions
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewingParticipants(challenge)}
                                                    >
                                                        View participants
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleEdit(challenge)}>
                                                        Edit details
                                                    </Button>
                                                    <Button size="sm" onClick={() => router.push(`/ai-challenges/${challenge.id}`)}>
                                                        Open challenge page
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                                        <p className="text-lg font-semibold">No timeline items to show</p>
                                        <p className="text-sm">Adjust your filters or create a new AI challenge to populate the timeline.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                        {challenges.length === 0 && !hasFiltersApplied && (
                            <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                                <p className="text-lg font-semibold">You haven't created any AI challenges yet</p>
                                <p className="text-sm">Use the "Create AI Challenge" button above to launch your first challenge.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
                </div>

                {/* Participants Dialog */}
                <Dialog open={!!viewingParticipants} onOpenChange={() => setViewingParticipants(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Participants - {viewingParticipants?.title}</DialogTitle>
                            <DialogDescription>
                                {viewingParticipants?.participantCount || 0} participant(s) registered
                            </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-y-auto">
                            {viewingParticipants?.participants && viewingParticipants.participants.length > 0 ? (
                                <div className="space-y-3">
                                    {viewingParticipants.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                                                    {participant.user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{participant.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{participant.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Registered</p>
                                                <p className="text-sm">
                                                    {new Date(participant.registeredAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No participants yet</p>
                                    <p className="text-sm">Be patient, registrations will come!</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
