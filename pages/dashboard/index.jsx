import { getSession, useSession } from 'next-auth/react';
import Card from '@/components/ui/CardWrapper';
import { Badge } from '@/components/ui/badge';
import StatBlock from '@/components/ui/StatBlock';
import ProgressList from '@/components/ui/ProgressList';
import OfferCard from '@/components/OfferCard';
import AssetCard from '@/components/AssetCard';
import MarketGrid from '@/components/MarketGrid';
import EmptyState from '@/components/EmptyState';
import { getUserAssets, getUserOffers, getDashboardStats } from '@/lib/services/dashboard';
import { AppShell } from '@/components/layout/AppShell';

const readinessTasks = [
  { id: 'task-1', title: 'Atualizar MRR dos últimos 6 meses', description: 'Suba os indicadores na aba Métricas', status: 'inProgress', statusLabel: 'Em andamento' },
  { id: 'task-2', title: 'Adicionar benchmark de churn', description: 'Compare com o setor B2B SaaS', status: 'pending', statusLabel: 'Pendente' },
  { id: 'task-3', title: 'Compartilhar checklists jurídicos', description: 'Envie o checklist padrão para o advisor', status: 'done', statusLabel: 'Concluído' }
];

const badges = [
  { label: 'Founder PRO', variant: 'default' },
  { label: 'Pipeline consistente', variant: 'secondary' },
  { label: 'Dados auditados', variant: 'outline' }
];

export default function Dashboard({ assets, offers, stats }) {
  const { data: session } = useSession();

  return (
    <div className="stack-lg">
      <Card
        title="Dashboard de ativos digitais"
        description="Acompanhe métricas, readiness score e prepare-se para negociações com investidores qualificados."
        actions={
          session && (
            <Badge variant="default">
              {session.user?.name?.split(' ')[0] ?? 'Usuário'} · Nível Founder
            </Badge>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock label="Readiness score" value={`${stats.readinessScore}%`} sublabel="Pronto para due diligence" trend="+6% este mês" />
          <StatBlock label="Valuation sugerido" value={stats.valuation} sublabel="Com base em MRR e churn" />
          <StatBlock label="Ativos listados" value={stats.assetsCount} sublabel="Total em carteira" />
        </div>
      </Card>

      <Card title="Meus ativos" description="Selecione um ativo para ajustar métricas, readiness e badges.">
        {assets.length ? (
          <MarketGrid
            items={assets}
            renderItem={(asset) => (
              <div key={asset.id} className="space-y-2">
                <AssetCard
                  asset={{
                    name: asset.name,
                    category: asset.category,
                    description: asset.description,
                    mrr: asset.mrr ? `R$ ${Number(asset.mrr).toLocaleString('pt-BR')}` : 'N/A',
                    churn: asset.churnRate ? `${asset.churnRate}%` : 'N/A'
                  }}
                />
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <Badge variant="default">Saudável</Badge>
                </div>
              </div>
            )}
          />
        ) : (
          <EmptyState title="Nenhum ativo" description="Cadastre seu primeiro ativo para começar." />
        )}
      </Card>

      <Card title="Ofertas ativas" description="Resumo das propostas em negociação.">
        {offers.length ? (
          <MarketGrid
            items={offers}
            renderItem={(offer) => <OfferCard key={offer.id} offer={{
              ...offer,
              title: offer.asset?.name ?? 'Oferta',
              summary: offer.asset?.description ?? '',
              classification: offer.asset?.category ?? 'SaaS',
              revenueRange: offer.asset?.mrr ? `MRR R$ ${Number(offer.asset.mrr).toLocaleString('pt-BR')}` : 'Sob consulta',
              investmentRange: { min: Number(offer.price), max: Number(offer.price) },
              valuationMultiple: 'N/A'
            }} />}
          />
        ) : (
          <EmptyState title="Sem ofertas" description="Publique seu ativo para receber propostas." />
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock label="MRR auditado" value="R$ 28.400" sublabel="crescimento 9% nos últimos 30 dias" />
          <StatBlock label="Churn controlado" value="1.9%" sublabel="benchmark SaaS B2B" />
          <StatBlock label="CAC payback" value="5.2 meses" sublabel="ideal < 7 meses" />
        </div>
      </Card>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AppShell>{page}</AppShell>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?callbackUrl=/dashboard',
        permanent: false
      }
    };
  }

  // @ts-ignore
  const userId = session.user.id;

  const [assets, offers, stats] = await Promise.all([
    getUserAssets(userId),
    getUserOffers(userId),
    getDashboardStats(userId)
  ]);

  // Serialize Decimal to string/number for JSON serialization
  const serialize = (obj) => JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
  ));

  return {
    props: {
      session,
      assets: serialize(assets),
      offers: serialize(offers),
      stats
    }
  };
}
