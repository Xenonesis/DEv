'use client';

import { useState, useEffect } from 'react';
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
    BarChart3
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
}

interface HostStats {
    totalHackathons: number;
    activeHackathons: number;
    totalParticipants: number;
    completedHackathons: number;
}

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
            tags: hackathon.tags ? JSON.parse(hackathon.tags).join(', ') : ''
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

                {/* Hackathons Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Hackathons</CardTitle>
                        <CardDescription>
                            Manage and monitor your hosted hackathons
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
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hackathons.map((hackathon) => (
                                    <TableRow key={hackathon.id}>
                                        <TableCell className="font-medium">{hackathon.title}</TableCell>
                                        <TableCell>{hackathon.theme}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(hackathon.status)}>
                                                {hackathon.status}
                                            </Badge>
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
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.push(`/hackathons/${hackathon.id}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(hackathon)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(hackathon.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {hackathons.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No hackathons created yet. Create your first hackathon to get started!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}