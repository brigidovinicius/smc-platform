'use client';

import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  userName: string;
  userLevel?: string;
}

export default function ProfileCard({ userName, userLevel = 'Founder' }: ProfileCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {userName} · Level {userLevel}
      </h2>
      <div className="flex items-center gap-2">
        <Badge variant="default">Active Profile</Badge>
      </div>
    </div>
  );
}

