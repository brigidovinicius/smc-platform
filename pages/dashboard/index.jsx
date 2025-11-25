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
import { useTranslation } from '@/lib/i18n/context';

const badges = [
  { label: 'Founder PRO', variant: 'default' },
  { label: 'Pipeline consistente', variant: 'secondary' },
  { label: 'Dados auditados', variant: 'outline' }
];

export default function Dashboard({ assets, offers, stats }) {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const readinessTasks = [
    {
      id: 'task-1',
      title: t('dashboard.tasks.updateMetrics.title'),
      description: t('dashboard.tasks.updateMetrics.description'),
      status: 'inProgress',
      statusLabel: t('dashboard.taskStatus.inProgress')
    },
    {
      id: 'task-2',
      title: t('dashboard.tasks.addBenchmark.title'),
      description: t('dashboard.tasks.addBenchmark.description'),
      status: 'pending',
      statusLabel: t('dashboard.taskStatus.pending')
    },
    {
      id: 'task-3',
      title: t('dashboard.tasks.shareChecklist.title'),
      description: t('dashboard.tasks.shareChecklist.description'),
      status: 'done',
      statusLabel: t('dashboard.taskStatus.done')
    }
  ];

  return (
    <div className="stack-lg">
      <Card
        title={t('dashboard.title')}
        description={t('dashboard.description')}
        actions={
          session && (
            <Badge variant="default">
              {session.user?.name?.split(' ')[0] ?? 'User'} · Founder Level
            </Badge>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatBlock label="Readiness score" value={`${stats.readinessScore}%`} sublabel="Ready for due diligence" trend="+6% this month" />
          <StatBlock label="Suggested valuation" value={stats.valuation} sublabel="Based on MRR and churn" />
          <StatBlock label="Listed assets" value={stats.assetsCount} sublabel="Total in portfolio" />
        </div>
      </Card>

      <Card title={t('dashboard.myAssets')} description={t('dashboard.myAssetsDescription')}>
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
          <EmptyState title={t('dashboard.noAssets')} description={t('dashboard.noAssetsDescription')} />
        )}
      </Card>

      <Card title={t('dashboard.activeOffers')} description={t('dashboard.activeOffersDescription')}>
        {offers.length ? (
          <MarketGrid
            items={offers}
            renderItem={(offer) => <OfferCard key={offer.id} offer={{
              ...offer,
              title: offer.asset?.name ?? 'Offer',
              summary: offer.asset?.description ?? '',
              classification: offer.asset?.category ?? 'SaaS',
              revenueRange: offer.asset?.mrr ? `MRR $${Number(offer.asset.mrr).toLocaleString('en-US')}` : 'On request',
              investmentRange: { min: Number(offer.price), max: Number(offer.price) },
              valuationMultiple: 'N/A'
            }} />}
          />
        ) : (
          <EmptyState title={t('dashboard.noOffers')} description={t('dashboard.noOffersDescription')} />
        )}
      </Card>

      <Card title={t('dashboard.gamification')} description={t('dashboard.gamificationDescription')}>
        <div className="flex flex-wrap gap-3 mb-6">
          {badges.map((badge) => (
            <Badge key={badge.label} variant={badge.variant}>
              {badge.label}
            </Badge>
          ))}
        </div>
        <ProgressList items={readinessTasks} />
      </Card>

      <Card title={t('dashboard.valuations')} description={t('dashboard.valuationsDescription')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatBlock label="Audited MRR" value="$28,400" sublabel="9% growth in the last 30 days" />
          <StatBlock label="Controlled churn" value="1.9%" sublabel="B2B SaaS benchmark" />
          <StatBlock label="CAC payback" value="5.2 months" sublabel="ideal < 7 months" />
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
