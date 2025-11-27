'use client';

import { Badge } from '@/components/ui/badge';
import ProgressList from '@/components/ui/ProgressList';

interface BadgeItem {
  id: string;
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  status?: 'inProgress' | 'pending' | 'done';
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'inProgress' | 'pending' | 'done';
  statusLabel: string;
}

interface BadgesSectionProps {
  badges: BadgeItem[];
  tasks: TaskItem[];
  editable?: boolean;
  isAdmin?: boolean;
}

export default function BadgesSection({ 
  badges, 
  tasks, 
  editable = false,
  isAdmin = false 
}: BadgesSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Gamification & Badges</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Earn badges by completing critical tasks.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {badges.map((badge) => (
          <Badge key={badge.id} variant={badge.variant}>
            {badge.label}
            {badge.status === 'inProgress' && (
              <span className="ml-2 text-xs">— In Progress</span>
            )}
          </Badge>
        ))}
      </div>

      <ProgressList items={tasks} />
    </section>
  );
}

