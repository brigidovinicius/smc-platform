import { getSession, useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatBlock from '@/components/ui/StatBlock';
import ProgressList from '@/components/ui/ProgressList';

const mockAssets = [
  {
    id: '1',
    title: 'CRM micro-SaaS',
    stage: 'Pronto para venda',
    readiness: 92,
    score: 780,
    health: 'Saudável'
  },
  {
    id: '2',
    title: 'Marketplace de templates',
    stage: 'Em due diligence',
    readiness: 76,
    score: 640,
    health: 'Estável'
  }
];

const readinessTasks = [
  { id: 'task-1', title: 'Atualizar MRR dos últimos 6 meses', description: 'Suba os indicadores na aba Métricas', status: 'inProgress', statusLabel: 'Em andamento' },
  { id: 'task-2', title: 'Adicionar benchmark de churn', description: 'Compare com o setor B2B SaaS', status: 'pending', statusLabel: 'Pendente' },
  { id: 'task-3', title: 'Compartilhar checklists jurídicos', description: 'Envie o checklist padrão para o advisor', status: 'done', statusLabel: 'Concluído' }
];

const badges = [
  { label: 'Founder PRO', variant: 'info' },
  { label: 'Pipeline consistente', variant: 'success' },
  { label: 'Dados auditados', variant: 'warning' }
];

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="stack-lg">
      <Card
        title="Dashboard de ativos digitais"
        description="Acompanhe métricas, readiness score e prepare-se para negociações com investidores qualificados."
        actions={
          session && (
            <Badge variant="info">
              {session.user?.name?.split(' ')[0] ?? 'Usuário'} · Nível Founder
            </Badge>
          )
        }
      >
        <div className="grid md:grid-cols-3 gap-4">
          <StatBlock label="Readiness score" value="82%" sublabel="Pronto para due diligence" trend="+6% este mês" />
          <StatBlock label="Valuation sugerido" value="R$ 950k" sublabel="Com base em MRR e churn" />
          <StatBlock label="XP de vendedor" value="1.450" sublabel="Próximo nível: Builder" />
        </div>
      </Card>

      <Card title="Meus ativos" description="Selecione um ativo para ajustar métricas, readiness e badges.">
        <div className="space-y-4">
          {mockAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#060c1a] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between"
            >
              <div>
                <p className="text-lg text-white font-semibold">{asset.title}</p>
                <p className="text-slate-400 text-sm">{asset.stage}</p>
              </div>
              <div className="flex gap-6 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Readiness</p>
                  <strong className="text-xl">{asset.readiness}%</strong>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health score</p>
                  <strong className="text-xl">{asset.score}</strong>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                  <Badge variant="success">{asset.health}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Gamificação & badges" description="Conquiste badges ao completar tarefas críticas.">
        <div className="flex flex-wrap gap-3 mb-6">
          {badges.map((badge) => (
            <Badge key={badge.label} variant={badge.variant}>
              {badge.label}
            </Badge>
          ))}
        </div>
        <ProgressList items={readinessTasks} />
      </Card>

      <Card title="Valuations e métricas" description="Resumo das análises automáticas feitas com base em MRR, churn e CAC.">
        <div className="grid md:grid-cols-3 gap-4">
          <StatBlock label="MRR auditado" value="R$ 28.400" sublabel="crescimento 9% nos últimos 30 dias" />
          <StatBlock label="Churn controlado" value="1.9%" sublabel="benchmark SaaS B2B" />
          <StatBlock label="CAC payback" value="5.2 meses" sublabel="ideal < 7 meses" />
        </div>
      </Card>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/dashboard',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}
