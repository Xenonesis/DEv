'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Check, X, Activity, UserCheck, UserX, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface Mentorship {
  id: string;
  mentee: {
    id: string;
    name: string | null;
    image: string | null;
  };
  status: string;
  goals: string;
  createdAt: string;
  sessions?: any[];
}

export default function HostMentorshipPanel() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [stats, setStats] = useState({ totalRequests: 0, activeMentorships: 0, completedMentorships: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [viewingSessions, setViewingSessions] = useState<Mentorship | null>(null);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    checkHostAccess();
  }, [session, sessionStatus, router]);

  const checkHostAccess = async () => {
    try {
      const response = await fetch('/api/host/check-access');
      const data = await response.json();
      if (!data.success || !data.isHost) {
        toast.error('Host privileges required to access this page.');
        router.push('/');
        return;
      }
      loadData();
    } catch (error) {
      toast.error('Failed to verify host status.');
      router.push('/');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [mentorshipsRes, statsRes] = await Promise.all([
        fetch('/api/host/mentorship'),
        fetch('/api/host/mentorship-stats')
      ]);
      const mentorshipsData = await mentorshipsRes.json();
      const statsData = await statsRes.json();

      if (mentorshipsData.success) {
        setMentorships(mentorshipsData.data);
      } else {
        toast.error(mentorshipsData.error || 'Failed to load mentorships.');
      }

      if (statsData.success) {
        setStats(statsData.data);
      } else {
        toast.error(statsData.error || 'Failed to load stats.');
      }
    } catch (error) {
      toast.error('An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (mentorshipId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/host/mentorship/${mentorshipId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Mentorship ${newStatus.toLowerCase()}`);
        loadData();
      } else {
        toast.error(data.error || 'Failed to update status.');
      }
    } catch (error) {
      toast.error('Error updating mentorship status.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>;
      case 'PENDING': return <Badge variant="secondary">Pending</Badge>;
      case 'COMPLETED': return <Badge variant="outline">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/host')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Host Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Mentorship Management</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Oversee and manage all your mentorship activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalRequests}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Mentorships</CardTitle>
              <UserCheck className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeMentorships}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</CardTitle>
              <Check className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completedMentorships}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</CardTitle>
              <Clock className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalSessions}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-900 shadow-sm">
          <CardHeader>
            <CardTitle>Mentorship Requests</CardTitle>
            <CardDescription>Manage your mentorship requests and ongoing relationships.</CardDescription>
          </CardHeader>
          <CardContent>
            {mentorships.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mentee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Goals</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentorships.map((mentorship) => (
                      <TableRow key={mentorship.id}>
                        <TableCell className="font-medium">{mentorship.mentee.name}</TableCell>
                        <TableCell>{getStatusBadge(mentorship.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{mentorship.goals}</TableCell>
                        <TableCell>{new Date(mentorship.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setViewingSessions(mentorship)}><Clock className="w-4 h-4" /></Button>
                            {mentorship.status === 'PENDING' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(mentorship.id, 'ACTIVE')}>
                                  <Check className="w-4 h-4 mr-1" /> Accept
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleStatusChange(mentorship.id, 'CANCELLED')}>
                                  <X className="w-4 h-4 mr-1" /> Decline
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No mentorship requests found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!viewingSessions} onOpenChange={() => setViewingSessions(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessions for {viewingSessions?.mentee.name}</DialogTitle>
            <DialogDescription>{viewingSessions?.sessions?.length || 0} sessions recorded.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto p-1">
            {viewingSessions?.sessions && viewingSessions.sessions.length > 0 ? (
              <div className="space-y-3">
                {viewingSessions.sessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-semibold">{new Date(session.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{session.duration} minutes</p>
                      {session.notes && <p className="text-sm mt-1">{session.notes}</p>}
                    </div>
                    <Badge variant={session.status === 'COMPLETED' ? 'default' : 'secondary'}>{session.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions scheduled for this mentee yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}