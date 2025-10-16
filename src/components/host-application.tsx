'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, UserCheck, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface HostApplicationProps {
  userRole?: string;
  isHostApproved?: boolean;
}

export function HostApplication({ userRole, isHostApproved }: HostApplicationProps) {
  const { data: session } = useSession();
  const [isApplying, setIsApplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApplyForHost = async () => {
    if (!session) {
      toast.error('Please sign in to apply for host access');
      return;
    }

    setIsApplying(true);
    
    try {
      const response = await fetch('/api/user/apply-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Host application submitted successfully! Please wait for admin approval.');
        setIsDialogOpen(false);
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to submit host application');
      }
    } catch (error) {
      console.error('Error applying for host access:', error);
      toast.error('Error submitting host application');
    } finally {
      setIsApplying(false);
    }
  };

  // Don't show if user is already admin
  if (userRole === 'ADMIN') {
    return null;
  }

  // Show different states based on user's host status
  if (userRole === 'HOST') {
    if (isHostApproved) {
      return (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-200">
              <CheckCircle className="w-5 h-5 mr-2" />
              Host Access Approved
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              You have been approved as a host and can now create and manage hackathons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/host'} className="bg-green-600 hover:bg-green-700">
              <Crown className="w-4 h-4 mr-2" />
              Go to Host Panel
            </Button>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
              <Clock className="w-5 h-5 mr-2" />
              Host Application Pending
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Your host application is currently under review. You'll be notified once it's approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="border-yellow-300 text-yellow-800 dark:text-yellow-200">
              Pending Admin Approval
            </Badge>
          </CardContent>
        </Card>
      );
    }
  }

  // Show application option for regular users
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="w-5 h-5 mr-2 text-purple-600" />
          Become a Host
        </CardTitle>
        <CardDescription>
          Apply to become a host and create your own hackathons for the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">As a host, you'll be able to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Create and manage hackathons</li>
              <li>Set themes, prizes, and difficulty levels</li>
              <li>Monitor participant registrations</li>
              <li>Track hackathon progress and results</li>
            </ul>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <UserCheck className="w-4 h-4 mr-2" />
                Apply for Host Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Host Access</DialogTitle>
                <DialogDescription>
                  Submit your application to become a host. Admin approval is required before you can start creating hackathons.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Host Responsibilities:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Create engaging and fair hackathons</li>
                    <li>• Provide clear guidelines and requirements</li>
                    <li>• Monitor and support participants</li>
                    <li>• Ensure timely communication and updates</li>
                  </ul>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApplyForHost} disabled={isApplying}>
                    {isApplying ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}