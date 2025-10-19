'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Check, X, Activity, UserCheck, UserX, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Mentorship {
  id: string;
  mentee: {
    name: string | null;
    image: string | null;
  };
  status: string;
  goals: string;
  createdAt: string;
  sessions?: any[];
}

export default function HostMentorshipPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [stats, setStats] = useState({ totalRequests: 0, activeMentorships: 0, completedMentorships: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [viewingSessions, setViewingSessions] = useState<Mentorship | null>(null);

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
      const [mentorshipsRes, statsRes] = await Promise.all([
        fetch('/api/host/mentorship'),
        fetch('/api/host/mentorship-stats')
      ]);
      const mentorshipsData = await mentorshipsRes.json();
      const statsData = await statsRes.json();
      if (mentorshipsData.success) setMentorships(mentorshipsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (mentorshipId: string, status: string) => {
    try {
      const response = await fetch(`/api/host/mentorship/${mentorshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setMentorships(
          mentorships.map((m) =>
            m.id === mentorshipId ? { ...m, status } : m
          )
        );
        toast.success(`Mentorship ${status.toLowerCase()}`);
        loadData(); // Refresh stats
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating mentorship status');
    }
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
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold">Mentorship Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/host')} variant="outline">Back</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Requests</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalRequests}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Mentorships</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.activeMentorships}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.completedMentorships}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Sessions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalSessions}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mentorship Requests</CardTitle>
            <CardDescription>Manage your mentorship requests and relationships</CardDescription>
          </CardHeader>
          <CardContent>
            {mentorships.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentorships.map((mentorship) => (
                    <TableRow key={mentorship.id}>
                      <TableCell className="font-medium">
                        {mentorship.mentee.name}
                      </TableCell>
                      <TableCell>
                        <Badge>{mentorship.status}</Badge>
                      </TableCell>
                      <TableCell>{mentorship.goals}</TableCell>
                      <TableCell>
                        {new Date(mentorship.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewingSessions(mentorship)}><Clock className="w-4 h-4" /></Button>
                          {mentorship.status === 'PENDING' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(mentorship.id, 'ACTIVE')}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleStatusChange(mentorship.id, 'CANCELLED')}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No mentorship requests yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewingSessions} onOpenChange={() => setViewingSessions(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessions - {viewingSessions?.mentee.name}</DialogTitle>
            <DialogDescription>{viewingSessions?.sessions?.length || 0} sessions scheduled</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {viewingSessions?.sessions && viewingSessions.sessions.length > 0 ? (
              <div className="space-y-3">
                {viewingSessions.sessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{new Date(session.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{session.duration} minutes</p>
                      {session.notes && <p className="text-sm">{session.notes}</p>}
                    </div>
                    <Badge>{session.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions scheduled yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}