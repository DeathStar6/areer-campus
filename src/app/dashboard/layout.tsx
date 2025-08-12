
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from '@/components/dashboard/dashboard-sidebar-content';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
            <BrainCircuit className="h-16 w-16 animate-pulse text-primary" />
            <p className="text-muted-foreground">Securing your session...</p>
        </div>
      </div>
    );
  }

  // Redirect admin users to the admin page if they land here
  if (user.isAdmin) {
    router.replace('/admin');
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <BrainCircuit className="h-16 w-16 animate-pulse text-primary" />
                <p className="text-muted-foreground">Redirecting to admin panel...</p>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r hidden md:flex">
          <DashboardSidebarContent user={user} />
      </Sidebar>
      <SidebarInset>
          {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
