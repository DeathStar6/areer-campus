
'use client';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Compass, LayoutDashboard, Shield, User as UserIcon, Settings } from "lucide-react";
import type { User as UserType } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardSidebarContent({ user }: { user: UserType | null }) {
  const pathname = usePathname();

  if(!user) return null;

  return (
    <>
        <SidebarHeader className="p-4 flex items-center justify-between">
            <Link href={`/dashboard`} className="flex items-center gap-2">
                <Compass className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground font-headline group-data-[collapsible=icon]:hidden">Career Compass</h1>
            </Link>
             <SidebarTrigger className="md:hidden"/>
        </SidebarHeader>
        <SidebarContent className="p-4">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === `/dashboard`}>
                        <Link href={`/dashboard`}>
                            <LayoutDashboard />
                            <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(`/dashboard/profile`)}>
                        <Link href={`/dashboard/profile`}>
                            <UserIcon />
                            <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(`/dashboard/settings`)}>
                        <Link href={`/dashboard/settings`}>
                            <Settings />
                            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {user.isAdmin && (
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(`/admin`)}>
                        <Link href={`/admin`}>
                            <Shield />
                            <span className="group-data-[collapsible=icon]:hidden">Admin Panel</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
            <UserNav user={user} />
        </SidebarFooter>
    </>
  );
}
