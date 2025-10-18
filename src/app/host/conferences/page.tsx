'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Edit, Trash2, Users, Activity } from 'lucide-react';
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

interface Conference {
    id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    duration: number;
    location?: string;
    isOnline: boolean;
    maxAttendees?: number;
    participantCount?: number;
    participants?: any[];
}

export default function HostConferencesPanel() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [stats, setStats] = useState({ totalConferences: 0, upcomingConferences: 0, pastConferences: 0, totalParticipants: 0 });
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingConference, setEditingConference] = useState<Conference | null>(null);
    const [viewingParticipants, setViewingParticipants] = useState<Conference | null>(null);
    const [formData, setFormData] = useState({
        title: '', description: '', type: 'CONFERENCE', date: '', startTime: '', duration: '60',
        location: '', isOnline: false, maxAttendees: '', tags: ''
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
            const [conferencesRes, statsRes] = await Promise.all([
                fetch('/api/host/conferences'),
                fetch('/api/host/conferences-stats')
            ]);
            const conferencesData = await conferencesRes.json();
            const statsData = await statsRes.json();
            if (conferencesData.success) setConferences(conferencesData.data);
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
            const url = editingConference ? `/api/host/conferences/${editingConference.id}` : '/api/host/conferences';
            const method = editingConference ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    duration: parseInt(formData.duration),
                    maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
                    tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(editingConference ? 'Conference updated' : 'Conference created');
                setIsCreateDialogOpen(false);
                setEditingConference(null);
                resetForm();
                loadData();
            } else {
                toast.error(data.error || 'Failed to save conference');
            }
        } catch (error) {
            toast.error('Error saving conference');
        }
    };

    const handleEdit = (conference: Conference) => {
        setEditingConference(conference);
        const conferenceDate = new Date(conference.date);
        setFormData({
            title: conference.title,
            description: conference.description,
            type: conference.type,
            date: conferenceDate.toISOString().split('T')[0],
            startTime: conferenceDate.toTimeString().slice(0, 5),
            duration: conference.duration.toString(),
            location: conference.location || '',
            isOnline: conference.isOnline,
            maxAttendees: conference.maxAttendees?.toString() || '',
            tags: ''
        });
        setIsCreateDialogOpen(true);
    };

    const handleDelete = async (conferenceId: string) => {
        if (!confirm('Delete this conference?')) return;
        try {
            const response = await fetch(`/api/host/conferences/${conferenceId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                toast.success('Conference deleted');
                loadData();
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting conference');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', description: '', type: 'CONFERENCE', date: '', startTime: '', duration: '60',
            location: '', isOnline: false, maxAttendees: '', tags: ''
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
                            <Calendar className="w-8 h-8 text-green-600 mr-3" />
                            <h1 className="text-2xl font-bold">Conferences Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => { resetForm(); setEditingConference(null); }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Conference
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{editingConference ? 'Edit Conference' : 'Create New Conference'}</DialogTitle>
                                        <DialogDescription>Fill in the conference details</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Title</Label>
                                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                            </div>
                                            <div>
                                                <Label>Type</Label>
                                                <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CONFERENCE">Conference</SelectItem>
                                                        <SelectItem value="SUMMIT">Summit</SelectItem>
                                                        <SelectItem value="WEBINAR">Webinar</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label>Date</Label>
                                                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                            </div>
                                            <div>
                                                <Label>Start Time</Label>
                                                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
                                            </div>
                                            <div>
                                                <Label>Duration (min)</Label>
                                                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Location</Label>
                                                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Optional" />
                                            </div>
                                            <div>
                                                <Label>Max Attendees</Label>
                                                <Input type="number" value={formData.maxAttendees} onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })} placeholder="Optional" />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" checked={formData.isOnline} onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })} />
                                            <Label>Online Conference</Label>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                            <Button type="submit">{editingConference ? 'Update' : 'Create'}</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Conferences</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalConferences}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Upcoming</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.upcomingConferences}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Past Conferences</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.pastConferences}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Participants</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalParticipants}</div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Conferences</CardTitle>
                        <CardDescription>Manage all your conferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {conferences.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Participants</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conferences.map((conference) => (
                                        <TableRow key={conference.id}>
                                            <TableCell className="font-medium">{conference.title}</TableCell>
                                            <TableCell><Badge>{conference.type}</Badge></TableCell>
                                            <TableCell>{new Date(conference.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{conference.isOnline ? 'Online' : 'Offline'}</TableCell>
                                            <TableCell>{conference.participantCount || 0}{conference.maxAttendees && ` / ${conference.maxAttendees}`}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => setViewingParticipants(conference)}><Users className="w-4 h-4" /></Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleEdit(conference)}><Edit className="w-4 h-4" /></Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(conference.id)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No conferences yet. Create your first conference!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!viewingParticipants} onOpenChange={() => setViewingParticipants(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Participants - {viewingParticipants?.title}</DialogTitle>
                        <DialogDescription>{viewingParticipants?.participantCount || 0} registered</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                        {viewingParticipants?.participants && viewingParticipants.participants.length > 0 ? (
                            <div className="space-y-3">
                                {viewingParticipants.participants.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">{p.user.name}</p>
                                            <p className="text-sm text-muted-foreground">{p.user.email}</p>
                                        </div>
                                        <p className="text-sm">{new Date(p.registeredAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No participants yet</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}