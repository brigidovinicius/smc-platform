'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Card from '@/components/ui/CardWrapper';
import { Badge } from '@/components/ui/badge';
import StatBlock from '@/components/ui/StatBlock';
import ProgressList from '@/components/ui/ProgressList';
import OfferCard from '@/components/OfferCard';
import AssetCard from '@/components/AssetCard';
import MarketGrid from '@/components/MarketGrid';
import EmptyState from '@/components/EmptyState';
import { useContext7 } from '@/components/providers/Context7Provider';

const readinessTasks = [
  { id: 'task-1', title: 'Atualizar MRR dos últimos 6 meses', description: 'Suba os indicadores na aba Métricas', status: 'inProgress', statusLabel: 'Em andamento' },
  { id: 'task-2', title: 'Adicionar benchmark de churn', description: 'Compare com o setor B2B SaaS', status: 'pending', statusLabel: 'Pendente' },
  { id: 'task-3', title: 'Compartilhar checklists jurídicos', description: 'Envie o checklist padrão para o advisor', status: 'done', statusLabel: 'Concluído' }
];

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

const badges: Array<{ label: string; variant: BadgeVariant }> = [
  { label: 'Founder PRO', variant: 'default' },
  { label: 'Pipeline consistente', variant: 'secondary' },
  { label: 'Dados auditados', variant: 'outline' }
];

type DashboardSessionUser = {
  id?: string | null;
  role?: string | null;
  email?: string | null;
  name?: string | null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const sessionUser = session?.user as DashboardSessionUser | undefined;
  const sessionUserId = sessionUser?.id ?? null;
  const { trackEvent, getFeatureFlag } = useContext7();
  const telemetrySent = useRef(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    readinessScore: 82,
    valuation: 'R$ 950k',
    assetsCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setAssets(result.data.assets || []);
          setOffers(result.data.offers || []);
          setStats((prev) => result.data.stats || prev);
          trackEvent('dashboard_data_loaded', {
            assets: result.data.assets?.length ?? 0,
            offers: result.data.offers?.length ?? 0,
            readinessScore: result.data.stats?.readinessScore
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [trackEvent]);

  useEffect(() => {
    if (status === 'authenticated' && sessionUserId) {
      fetchDashboardData();
    }
  }, [status, sessionUserId, fetchDashboardData]);

  useEffect(() => {
    if (status !== 'authenticated' || telemetrySent.current) return;
    telemetrySent.current = true;
    trackEvent('dashboard_session_started', {
      readinessScore: stats.readinessScore,
      assets: assets.length,
      offers: offers.length,
      betaGamification: getFeatureFlag('enableLeadScoring')
    });
  }, [status, stats.readinessScore, assets.length, offers.length, trackEvent, getFeatureFlag]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <Card
        className="w-full"
        title="Dashboard de ativos digitais"
        description="Acompanhe métricas, readiness score e prepare-se para negociações com investidores qualificados."
        actions={
          session && (
            <Badge variant="default">
              {sessionUser?.name?.split(' ')[0] ?? 'Usuário'} · Nível Founder
            </Badge>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock label="Readiness score" value={`${stats.readinessScore}%`} sublabel="Pronto para due diligence" trend="+6% este mês" />
          <StatBlock label="Valuation sugerido" value={stats.valuation} sublabel="Com base em MRR e churn" trend="Atualizado diariamente" />
          <StatBlock label="Ativos listados" value={stats.assetsCount} sublabel="Total em carteira" trend="--" />
        </div>
      </Card>

      <Card className="w-full" title="Meus ativos" description="Selecione um ativo para ajustar métricas, readiness e badges." actions={null}>
        {assets.length ? (
          <MarketGrid
            items={assets}
            renderItem={(asset: any) => (
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

      <Card className="w-full" title="Ofertas ativas" description="Resumo das propostas em negociação." actions={null}>
        {offers.length ? (
          <MarketGrid
            items={offers}
            renderItem={(offer: any) => <OfferCard key={offer.id} offer={{
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

      <Card className="w-full" title="Gamificação & badges" description="Conquiste badges ao completar tarefas críticas." actions={null}>
        <div className="flex flex-wrap gap-3 mb-6">
          {badges.map((badge) => (
            <Badge key={badge.label} variant={badge.variant}>
              {badge.label}
            </Badge>
          ))}
        </div>
        <ProgressList items={readinessTasks} />
      </Card>

      <Card className="w-full" title="Valuations e métricas" description="Resumo das análises automáticas feitas com base em MRR, churn e CAC." actions={null}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock label="MRR auditado" value="R$ 28.400" sublabel="crescimento 9% nos últimos 30 dias" trend="+9% vs último mês" />
          <StatBlock label="Churn controlado" value="1.9%" sublabel="benchmark SaaS B2B" trend="Em linha com o setor" />
          <StatBlock label="CAC payback" value="5.2 meses" sublabel="ideal < 7 meses" trend="Meta < 6 meses" />
        </div>
      </Card>
    </div>
  );
}

