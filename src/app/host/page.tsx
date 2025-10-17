'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    Users,
    Trophy,
    Clock,
    MapPin,
    Eye,
    Settings,
    Activity,
    BarChart3,
    Brain,
    Code,
    Smartphone,
    Search
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

interface Hackathon {
    id: string;
    title: string;
    description: string;
    theme: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    imageUrl?: string;
    tags?: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    participantCount?: number;
    participants?: Array<{
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
            avatar?: string;
        };
        registeredAt: string;
    }>;
}

interface HostStats {
    totalHackathons: number;
    activeHackathons: number;
    totalParticipants: number;
    completedHackathons: number;
}

const statusOptions = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'] as const;
const difficultyOptions = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

type StatusFilter = typeof statusOptions[number];
type DifficultyFilter = typeof difficultyOptions[number];

export default function HostPanel() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [stats, setStats] = useState<HostStats>({
        totalHackathons: 0,
        activeHackathons: 0,
        totalParticipants: 0,
        completedHackathons: 0
    });
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
    const [viewingParticipants, setViewingParticipants] = useState<Hackathon | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        theme: '',
        prize: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        difficulty: 'BEGINNER' as const,
        tags: ''
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
                if (data.needsApproval) {
                    toast.error('Your host application is pending approval. Please wait for admin approval.');
                } else {
                    toast.error('Host privileges required. Please apply for host access.');
                }
                router.push('/');
                return;
            }

            loadData();
        } catch (error) {
            console.error('Error checking host access:', error);
            toast.error('Error checking permissions');
            router.push('/');
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const [hackathonsResponse, statsResponse] = await Promise.all([
                fetch('/api/host/hackathons'),
                fetch('/api/host/stats')
            ]);

            const hackathonsData = await hackathonsResponse.json();
            const statsData = await statsResponse.json();

            if (hackathonsData.success) {
                setHackathons(hackathonsData.data);
            }

            if (statsData.success) {
                setStats(statsData.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Error loading host data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingHackathon
                ? `/api/host/hackathons/${editingHackathon.id}`
                : '/api/host/hackathons';

            const method = editingHackathon ? 'PUT' : 'POST';

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
                toast.success(editingHackathon ? 'Hackathon updated successfully' : 'Hackathon created successfully');
                setIsCreateDialogOpen(false);
                setEditingHackathon(null);
                resetForm();
                loadData();
            } else {
                toast.error(data.error || 'Failed to save hackathon');
            }
        } catch (error) {
            console.error('Error saving hackathon:', error);
            toast.error('Error saving hackathon');
        }
    };

    const handleEdit = (hackathon: Hackathon) => {
        setEditingHackathon(hackathon);
        setFormData({
            title: hackathon.title,
            description: hackathon.description,
            theme: hackathon.theme,
            prize: hackathon.prize || '',
            maxParticipants: hackathon.maxParticipants?.toString() || '',
            startDate: new Date(hackathon.startDate).toISOString().slice(0, 16),
            endDate: new Date(hackathon.endDate).toISOString().slice(0, 16),
            difficulty: hackathon.difficulty,
            tags: (() => {
                if (!hackathon.tags) return '';

                try {
                    const parsed = JSON.parse(hackathon.tags);
                    if (Array.isArray(parsed)) {
                        return parsed.join(', ');
                    }
                    return parsed.toString();
                } catch {
                    return hackathon.tags;
                }
            })()
        });
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (hackathonId: string) => {
        if (!confirm('Are you sure you want to delete this hackathon?')) return;

        try {
            const response = await fetch(`/api/host/hackathons/${hackathonId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Hackathon deleted successfully');
                loadData();
            } else {
                toast.error(data.error || 'Failed to delete hackathon');
            }
        } catch (error) {
            console.error('Error deleting hackathon:', error);
            toast.error('Error deleting hackathon');
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
            tags: ''
        });
    };

    const filteredHackathons = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return hackathons
            .filter((hackathon) => {
                if (!normalizedSearch) return true;

                const searchableFields = [
                    hackathon.title,
                    hackathon.theme,
                    hackathon.description,
                    hackathon.prize,
                    hackathon.tags
                ]
                    .filter(Boolean)
                    .map((value) => value!.toString().toLowerCase());

                return searchableFields.some((field) => field.includes(normalizedSearch));
            })
            .filter((hackathon) => statusFilter === 'ALL' || hackathon.status === statusFilter)
            .filter((hackathon) => difficultyFilter === 'ALL' || hackathon.difficulty === difficultyFilter)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [hackathons, searchTerm, statusFilter, difficultyFilter]);

    const filteredSummary = useMemo(() => {
        if (filteredHackathons.length === 0) {
            return {
                active: 0,
                upcoming: 0,
                averageParticipants: 0,
                completionRate: 0
            };
        }

        const active = filteredHackathons.filter((hackathon) => hackathon.status === 'ONGOING').length;
        const upcoming = filteredHackathons.filter((hackathon) => hackathon.status === 'UPCOMING').length;
        const totalParticipants = filteredHackathons.reduce((acc, hackathon) => acc + (hackathon.participantCount ?? 0), 0);
        const averageParticipants = filteredHackathons.length
            ? Math.round(totalParticipants / filteredHackathons.length)
            : 0;
        const completionRate = filteredHackathons.length
            ? Math.round(
                (filteredHackathons.filter((hackathon) => hackathon.status === 'COMPLETED').length /
                    filteredHackathons.length) *
                    100
            )
            : 0;

        return {
            active,
            upcoming,
            averageParticipants,
            completionRate
        };
    }, [filteredHackathons]);

    const hasFiltersApplied = useMemo(() => {
        return statusFilter !== 'ALL' || difficultyFilter !== 'ALL' || searchTerm.trim() !== '';
    }, [statusFilter, difficultyFilter, searchTerm]);

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setDifficultyFilter('ALL');
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
                    <p>Loading host panel...</p>
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
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
                            <h1 className="text-2xl font-bold">Host Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => { resetForm(); setEditingHackathon(null); }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Hackathon
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingHackathon ? 'Edit Hackathon' : 'Create New Hackathon'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingHackathon ? 'Update hackathon details' : 'Fill in the details to create a new hackathon'}
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
                                                <Input
                                                    id="theme"
                                                    value={formData.theme}
                                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="prize">Prize (Optional)</Label>
                                                <Input
                                                    id="prize"
                                                    value={formData.prize}
                                                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                                    placeholder="e.g., $1000 cash prize"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
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
                                            <div>
                                                <Label htmlFor="tags">Tags (comma-separated)</Label>
                                                <Input
                                                    id="tags"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="e.g., AI, Web Development, Mobile"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                {editingHackathon ? 'Update' : 'Create'} Hackathon
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hackathons</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalHackathons}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Hackathons</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeHackathons}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedHackathons}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Challenges Quick Access */}
                <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>AI Challenges Management</CardTitle>
                                    <CardDescription>Create and manage AI/ML competitions</CardDescription>
                                </div>
                            </div>
                            <Button 
                                onClick={() => router.push('/host/ai-challenges')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Manage AI Challenges
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Web Contests Quick Access */}
                <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Web Contests Management</CardTitle>
                                    <CardDescription>Create and manage web development competitions</CardDescription>
                                </div>
                            </div>
                            <Button 
                                onClick={() => router.push('/host/web-contests')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                Manage Web Contests
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Mobile Innovation Quick Access */}
                <Card className="mb-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                                    <Smartphone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Mobile Innovation Management</CardTitle>
                                    <CardDescription>Create and manage mobile app innovation challenges</CardDescription>
                                </div>
                            </div>
                            <Button 
                                onClick={() => router.push('/host/mobile-innovation')}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                            >
                                Manage Mobile Innovation
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Events Management Quick Access */}
                <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Events Management</CardTitle>
                                    <CardDescription>Create and manage workshops, seminars, and networking events</CardDescription>
                                </div>
                            </div>
                            <Button 
                                onClick={() => router.push('/host/events')}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                Manage Events
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Hackathons Table */}
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Your Hackathons</CardTitle>
                                <CardDescription>Manage and monitor every competition in one place</CardDescription>
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
                                    placeholder="Search by title, theme or description"
                                    className="pl-9"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option === 'ALL' ? 'All statuses' : option.charAt(0) + option.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={difficultyFilter}
                                onValueChange={(value) => setDifficultyFilter(value as DifficultyFilter)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficultyOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option === 'ALL'
                                                ? 'All difficulties'
                                                : option.charAt(0) + option.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Active events</p>
                                <p className="text-xl font-semibold">{filteredSummary.active}</p>
                            </div>
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs text-muted-foreground">Upcoming events</p>
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
                                {filteredHackathons.length > 0 ? (
                                    <ScrollArea className="-mx-4 sm:mx-0">
                                        <div className="min-w-[720px] px-4 sm:px-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Title</TableHead>
                                                        <TableHead>Theme</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Difficulty</TableHead>
                                                        <TableHead>Participants</TableHead>
                                                        <TableHead>Start</TableHead>
                                                        <TableHead>End</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredHackathons.map((hackathon) => (
                                                        <TableRow key={hackathon.id}>
                                                            <TableCell className="font-medium">{hackathon.title}</TableCell>
                                                            <TableCell className="text-muted-foreground">{hackathon.theme}</TableCell>
                                                            <TableCell>
                                                                <Badge className={getStatusColor(hackathon.status)}>
                                                                    {hackathon.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {hackathon.difficulty}
                                                            </TableCell>
                                                            <TableCell>
                                                                {hackathon.participantCount || 0}
                                                                {hackathon.maxParticipants && ` / ${hackathon.maxParticipants}`}
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(hackathon.startDate).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(hackathon.endDate).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => setViewingParticipants(hackathon)}
                                                                        title="View Participants"
                                                                    >
                                                                        <Users className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => router.push(`/hackathons/${hackathon.id}`)}
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleEdit(hackathon)}
                                                                        title="Edit"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleDelete(hackathon.id)}
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
                                        <p className="text-lg font-semibold">No hackathons match your filters</p>
                                        <p className="text-sm">Try adjusting the filters or create a new hackathon to get started.</p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="timeline" className="space-y-4">
                                {filteredHackathons.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredHackathons.map((hackathon) => (
                                            <div
                                                key={`${hackathon.id}-timeline`}
                                                className="rounded-xl border bg-muted/30 p-4 shadow-sm transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <Badge className={getStatusColor(hackathon.status)}>
                                                                {hackathon.status}
                                                            </Badge>
                                                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                {hackathon.difficulty}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{hackathon.theme}</p>
                                                        </div>
                                                        {hackathon.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {hackathon.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>
                                                                {new Date(hackathon.startDate).toLocaleDateString()} –{' '}
                                                                {new Date(hackathon.endDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>
                                                                {hackathon.participantCount || 0}
                                                                {hackathon.maxParticipants && ` / ${hackathon.maxParticipants}`}
                                                                {' '}participants
                                                            </span>
                                                        </div>
                                                        {hackathon.prize && (
                                                            <div className="flex items-center gap-2">
                                                                <Trophy className="h-4 w-4" />
                                                                <span>{hackathon.prize}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <BarChart3 className="h-4 w-4" />
                                                            <span>
                                                                {hackathon.participants?.length || 0} team(s) engaged
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewingParticipants(hackathon)}
                                                    >
                                                        View participants
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleEdit(hackathon)}>
                                                        Edit details
                                                    </Button>
                                                    <Button size="sm" onClick={() => router.push(`/hackathons/${hackathon.id}`)}>
                                                        Open event page
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                                        <p className="text-lg font-semibold">No timeline items to show</p>
                                        <p className="text-sm">Adjust your filters or create a new hackathon to populate the timeline.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                        {hackathons.length === 0 && !hasFiltersApplied && (
                            <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                                <p className="text-lg font-semibold">You haven't created any hackathons yet</p>
                                <p className="text-sm">Use the "Create Hackathon" button above to launch your first event.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
    );
}