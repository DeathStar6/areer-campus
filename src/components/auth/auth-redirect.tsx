
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { BrainCircuit } from 'lucide-react';

export function AuthRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.isAdmin) {
          router.replace(`/admin`);
        } else {
          router.replace(`/dashboard`);
        }
      } else {
        router.replace(`/login`);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <BrainCircuit className="h-16 w-16 animate-pulse text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
