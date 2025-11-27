import prisma from '@/lib/prisma';

interface Badge {
  id: string;
  label: string;
  variant: 'default' | 'secondary' | 'outline';
  status?: 'inProgress' | 'pending' | 'done';
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'inProgress' | 'pending' | 'done';
  statusLabel: string;
}

/**
 * Obtém badges do usuário baseado em suas métricas e ações
 */
export async function getUserBadges(userId: string): Promise<{ badges: Badge[]; tasks: Task[] }> {
  // Buscar dados do usuário para calcular badges
  const [assetsCount, offersCount, assets] = await Promise.all([
    prisma.asset.count({ where: { ownerId: userId } }),
    prisma.offer.count({ where: { sellerId: userId } }),
    prisma.asset.findMany({
      where: { ownerId: userId },
      select: {
        mrr: true,
        churnRate: true,
        createdAt: true
      }
    })
  ]);

  const badges: Badge[] = [];
  const tasks: Task[] = [];

  // Badge: Founder PRO (ter pelo menos 1 ativo)
  if (assetsCount > 0) {
    badges.push({
      id: 'founder-pro',
      label: 'Founder PRO',
      variant: 'default',
      status: 'done'
    });
  } else {
    badges.push({
      id: 'founder-pro',
      label: 'Founder PRO',
      variant: 'default',
      status: 'inProgress'
    });
  }

  // Badge: Consistent Pipeline (having active offers)
  if (offersCount > 0) {
    badges.push({
      id: 'pipeline-consistente',
      label: 'Consistent Pipeline',
      variant: 'secondary',
      status: 'done'
    });
  } else {
    badges.push({
      id: 'pipeline-consistente',
      label: 'Consistent Pipeline',
      variant: 'secondary',
      status: 'inProgress'
    });
  }

  // Badge: Audited Data (having metrics filled)
  const hasAuditedData = assets.some(a => a.mrr && a.churnRate);
  if (hasAuditedData) {
    badges.push({
      id: 'dados-auditados',
      label: 'Audited Data',
      variant: 'outline',
      status: 'done'
    });
  } else {
    badges.push({
      id: 'dados-auditados',
      label: 'Audited Data',
      variant: 'outline',
      status: 'inProgress'
    });
  }

  // Tarefas
  const hasMRRHistory = assets.length > 0 && assets.some(a => a.mrr);
  tasks.push({
    id: 'task-1',
    title: 'Update MRR for the last 6 months',
    description: 'Upload indicators in the Metrics tab',
    status: hasMRRHistory ? 'done' : 'inProgress',
    statusLabel: hasMRRHistory ? 'Completed' : 'In Progress'
  });

  const hasChurnBenchmark = assets.some(a => a.churnRate);
  tasks.push({
    id: 'task-2',
    title: 'Add churn benchmark',
    description: 'Compare with B2B SaaS industry',
    status: hasChurnBenchmark ? 'done' : 'pending',
    statusLabel: hasChurnBenchmark ? 'Completed' : 'Pending'
  });

  tasks.push({
    id: 'task-3',
    title: 'Share legal checklists',
    description: 'Send the standard checklist to the advisor',
    status: 'done',
    statusLabel: 'Completed'
  });

  return { badges, tasks };
}

