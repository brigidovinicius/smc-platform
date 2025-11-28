'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, Shield } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { isAdmin } from '@/lib/api/permissions';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function DashboardHeader({ onMenuToggle, isSidebarOpen }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user;
  const admin = isAdmin(session);

  // Check if we're in admin area
  const isInAdminArea = pathname?.startsWith('/dashboard/admin');
  // Check if we're in user dashboard (not admin area)
  const isInUserDashboard = pathname?.startsWith('/dashboard') && !isInAdminArea;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleViewAsUser = () => {
    router.push('/dashboard');
  };

  const handleReturnToAdmin = () => {
    router.push('/dashboard/admin/users');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link href="/dashboard" className="flex items-center">
            <Logo variant="primary" width={120} height={28} />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {admin && isInAdminArea && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAsUser}
              className="text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              View as User
            </Button>
          )}
          
          {admin && isInUserDashboard && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReturnToAdmin}
              className="text-sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Return to Admin Mode
            </Button>
          )}
          
          {admin && isInAdminArea && (
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
              Admin Mode
            </span>
          )}
          
          {user && (
            <div className="flex items-center gap-3">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="hidden sm:inline text-sm text-foreground">
                {user.name?.split(' ')[0] || 'User'}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-sm"
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

