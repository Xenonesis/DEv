"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Mentorship {
  id: string;
  mentee: {
    name: string | null;
    image: string | null;
  };
  status: string;
  goals: string;
  createdAt: string;
}

const HostMentorshipPage = () => {
  const { data: session } = useSession();
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const fetchMentorships = async () => {
        try {
          const res = await fetch('/api/host/mentorship');
          if (res.ok) {
            const data = await res.json();
            setMentorships(data);
          }
        } catch (error) {
          console.error('Error fetching mentorships:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMentorships();
    }
  }, [session]);

  const handleStatusChange = async (mentorshipId: string, status: string) => {
    try {
      await fetch(`/api/host/mentorship/${mentorshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setMentorships(
        mentorships.map((m) =>
          m.id === mentorshipId ? { ...m, status } : m
        )
      );
    } catch (error) {
      console.error('Error updating mentorship status:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mentorships</CardTitle>
        <CardDescription>Manage your mentorship requests.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
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
                    {mentorship.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStatusChange(mentorship.id, 'ACTIVE')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleStatusChange(mentorship.id, 'CANCELLED')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HostMentorshipPage;