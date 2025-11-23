import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRightCircle, Filter, Shield, Zap, Layers } from 'lucide-react';
import { listOffers } from '@/lib/services/offers';

const SITE_URL = 'https://smc-platform.vercel.app';

const investmentFilters = [
  { label: 'Todos os tickets', value: 'all' },
  { label: 'até R$ 100k', value: '0-100' },
  { label: 'R$ 100k – R$ 200k', value: '100-200' },
  { label: 'acima de R$ 200k', value: '200-plus' }
];

const revenueFilters = ['Todos', 'MRR < R$ 10k', 'MRR R$ 10k – R$ 20k', 'MRR > R$ 20k'];

const determineRevenueBucket = (mrrText = '') => {
  const numeric = Number(mrrText.replace(/\D/g, '')) || 0;
  if (numeric === 0) return 'Todos';
  if (numeric < 10000) return 'MRR < R$ 10k';
  if (numeric <= 20000) return 'MRR R$ 10k – R$ 20k';
  return 'MRR > R$ 20k';
};

const matchesInvestment = (offer, filter) => {
  if (filter === 'all') return true;
  const min = offer.investmentRange?.min || 0;
  const max = offer.investmentRange?.max || min;
  switch (filter) {
    case '0-100':
      return max <= 100000;
    case '100-200':
      return min >= 100000 && max <= 200000;
    case '200-plus':
      return min >= 200000 || max >= 200000;
    default:
      return true;
  }
};

const OfferCard = ({ offer, isHighlighted, isAuthenticated }) => {
  const ctaHref = isAuthenticated ? `/offers/${offer.slug}` : `/auth/login?callbackUrl=/offers/${offer.slug}`;
  const ctaLabel = isAuthenticated ? 'Ver detalhes →' : 'Entrar para ver detalhes';

  return (
    <article
      className={`bg-[#0b1230] border rounded-3xl p-6 flex flex-col gap-3 shadow-2xl transition hover:-translate-y-1 ${
        isHighlighted ? 'border-blue-400 shadow-blue-500/40' : 'border-white/5 shadow-black/40'
      }`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-blue-300">
        {isHighlighted && (
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] tracking-[0.2em] text-blue-100">Novo</span>
        )}
        <span>{offer.classification}</span>
      </div>
      <h2 className="text-2xl font-semibold text-white">{offer.title}</h2>
      <p className="text-slate-300">{offer.summary}</p>
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
        <div>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            Faturamento
            <span className="text-blue-300 cursor-help" title="MRR aproximado reportado pelo operador.">
              ⓘ
            </span>
          </p>
          <strong>{offer.revenueRange}</strong>
        </div>
        <div>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            Investimento
            <span className="text-blue-300 cursor-help" title="Faixa esperada para aquisição equity/cash-out.">
              ⓘ
            </span>
          </p>
          <strong>
            {offer.investmentRange
              ? `R$ ${(offer.investmentRange.min / 1000).toFixed(0)}k – R$ ${(offer.investmentRange.max / 1000).toFixed(0)}k`
              : 'Sob consulta'}
          </strong>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Nicho</p>
          <strong>{offer.niche}</strong>
        </div>
        <div>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            Múltiplo
            <span className="text-blue-300 cursor-help" title="Valor pedido / ARR.">
              ⓘ
            </span>
          </p>
          <strong>{offer.valuationMultiple}</strong>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {offer.badges?.map((badge) => (
          <span key={badge} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-200">
            {badge}
          </span>
        ))}
      </div>
      <Link
        href={ctaHref}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b5bff] to-[#8f74ff] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        aria-label={`${ctaLabel} - ${offer.title}`}
      >
        {ctaLabel}
      </Link>
    </article>
  );
};

const FeedPage = ({ offers }) => {
  const { data: session } = useSession();
  const [classification, setClassification] = useState('Todos');
  const [investmentFilter, setInvestmentFilter] = useState('all');
  const [revenueFilter, setRevenueFilter] = useState('Todos');
  const [nicheFilter, setNicheFilter] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(9);

  const totalOffers = offers.length;

  const classifications = useMemo(
    () => ['Todos', ...new Set(offers.map((offer) => offer.classification))],
    [offers]
  );

  const niches = useMemo(() => ['Todos', ...new Set(offers.map((offer) => offer.niche))], [offers]);

  const filteredOffers = offers.filter((offer) => {
    const classificationMatch = classification === 'Todos' || offer.classification === classification;
    const investmentMatch = matchesInvestment(offer, investmentFilter);
    const revenueBucket = determineRevenueBucket(offer.metrics?.mrr);
    const revenueMatch = revenueFilter === 'Todos' || revenueBucket === revenueFilter;
    const nicheMatch = nicheFilter === 'Todos' || offer.niche === nicheFilter;
    return classificationMatch && investmentMatch && revenueMatch && nicheMatch;
  });

  const paginatedOffers = filteredOffers.slice(0, visibleCount);

  const activeFilters = useMemo(() => {
    const chips = [];
    if (classification !== 'Todos') {
      chips.push({ label: classification, onRemove: () => setClassification('Todos') });
    }
    if (investmentFilter !== 'all') {
      const label = investmentFilters.find((f) => f.value === investmentFilter)?.label ?? 'Ticket';
      chips.push({ label, onRemove: () => setInvestmentFilter('all') });
    }
    if (revenueFilter !== 'Todos') {
      chips.push({ label: revenueFilter, onRemove: () => setRevenueFilter('Todos') });
    }
    if (nicheFilter !== 'Todos') {
      chips.push({ label: nicheFilter, onRemove: () => setNicheFilter('Todos') });
    }
    return chips;
  }, [classification, investmentFilter, revenueFilter, nicheFilter]);

  const clearAllFilters = () => {
    setClassification('Todos');
    setInvestmentFilter('all');
    setRevenueFilter('Todos');
    setNicheFilter('Todos');
  };

  const uniqueNiches = niches.length > 0 ? niches.length - 1 : 0;
  const averageTicket = useMemo(() => {
    const withPrice = offers.filter((offer) => offer.investmentRange?.min && offer.investmentRange?.max);
    if (!withPrice.length) return 'Sob consulta';
    const avg =
      withPrice.reduce((acc, offer) => acc + (offer.investmentRange.min + offer.investmentRange.max) / 2, 0) /
      withPrice.length;
    return `R$ ${(avg / 1000).toFixed(0)}k`;
  }, [offers]);

  const schemaData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Feed de oportunidades – SMC Platform',
      description:
        'Lista curada de ativos digitais, SaaS e newsletters disponíveis para aquisição com métricas de MRR, churn e ticket de investimento.',
      mainEntity: offers.map((offer, index) => ({
        '@type': 'Offer',
        position: index + 1,
        url: `${SITE_URL}/offers/${offer.slug}`,
        itemOffered: {
          '@type': 'Product',
          name: offer.title,
          category: offer.classification,
          description: offer.summary
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'BRL',
          minPrice: offer.investmentRange?.min ?? undefined,
          maxPrice: offer.investmentRange?.max ?? undefined
        }
      }))
    }),
    [offers]
  );

  return (
    <main className="min-h-screen bg-[#050711] py-16 px-4 text-white">
      <Head>
        <title>Feed de oportunidades – SMC Platform | SaaS & ativos digitais</title>
        <meta
          name="description"
          content="Explore oportunidades de compra de SaaS, marketplaces e newsletters com métricas de MRR, churn e faixa de investimento. Prévia pública da SMC Platform."
        />
        <meta
          name="keywords"
          content="feed de SaaS, oportunidades digitais, ativos digitais à venda, comprar SaaS, investir em SaaS"
        />
        <meta property="og:title" content="Feed de oportunidades – SMC Platform" />
        <meta
          property="og:description"
          content="Prévia pública com as melhores oportunidades de ativos digitais da SMC Platform."
        />
        <meta property="og:url" content={`${SITE_URL}/feed`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>
      <div className="max-w-6xl mx-auto space-y-10">
        <nav className="text-sm text-blue-300 flex items-center gap-2" aria-label="breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <span className="text-slate-300">Oportunidades</span>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1230] via-[#0b1230] to-[#0d1636] p-8 md:p-12 shadow-2xl space-y-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.2),transparent_40%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="tracking-[0.4em] uppercase text-xs text-blue-200">SMC FEED · Prévia pública</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1]">
                Oportunidades de SaaS, marketplaces e newsletters com métricas auditadas.
              </h1>
              <p className="text-slate-300 max-w-2xl">
                Memorandos enxutos com faixa de investimento, MRR e nicho. Filtre por ticket, classificação e MRR para
                encontrar ativos alinhados ao seu perfil. Para dados completos, faça login.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/auth/login?callbackUrl=/feed" 
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#050711] px-5 py-3 text-sm font-semibold hover:translate-y-[-1px] transition"
                  aria-label="Fazer login para receber memorando completo"
                >
                  Receber memorando completo
                  <ArrowRightCircle className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link 
                  href="/wizard" 
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                  aria-label="Cadastrar novo ativo no marketplace"
                >
                  Listar meu ativo
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                  <Shield className="h-3.5 w-3.5" />
                  Inventário curado e auditado
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-blue-100">
                  <Zap className="h-3.5 w-3.5" />
                  Atualização diária
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: 'Ativos publicados', value: totalOffers, hint: 'Curados pelo time SMC', icon: Layers },
                { label: 'Ticket médio', value: averageTicket, hint: 'Equity + cash-out', icon: Shield },
                { label: 'Nichos', value: uniqueNiches || '—', hint: 'Categorias distintas', icon: Filter }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-black/30">
                    <div>
                      <p className="text-sm text-slate-300">{stat.label}</p>
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.hint}</p>
                    </div>
                    <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#081024] border border-white/5 rounded-3xl p-6 space-y-4 text-left shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Como usamos este feed</h2>
              <p className="text-slate-300">
                Curadoria baseada em MRR, churn, CAC e comparáveis. Founders usam para captar propostas; investidores, para filtrar tickets e nichos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#081024] border border-white/5 rounded-3xl p-6 space-y-4" aria-label="Filtros do feed">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-200">
              <Filter className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-semibold">Refine por ticket, MRR e nicho</span>
            </div>
            <span className="text-xs text-slate-400">Prévia pública · Detalhes completos pedem login</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-400">Classificação</span>
              <select
                className="bg-[#050b1a] border border-white/10 rounded-2xl px-4 py-2"
                value={classification}
                onChange={(event) => setClassification(event.target.value)}
                aria-label="Filtrar por classificação"
              >
                {classifications.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-400">Ticket de investimento</span>
              <select
                className="bg-[#050b1a] border border-white/10 rounded-2xl px-4 py-2"
                value={investmentFilter}
                onChange={(event) => setInvestmentFilter(event.target.value)}
                aria-label="Filtrar por ticket de investimento"
              >
                {investmentFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-400">MRR</span>
              <select
                className="bg-[#050b1a] border border-white/10 rounded-2xl px-4 py-2"
                value={revenueFilter}
                onChange={(event) => setRevenueFilter(event.target.value)}
                aria-label="Filtrar por receita recorrente mensal (MRR)"
              >
                {revenueFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-400">Nicho</span>
              <select
                className="bg-[#050b1a] border border-white/10 rounded-2xl px-4 py-2"
                value={nicheFilter}
                onChange={(event) => setNicheFilter(event.target.value)}
                aria-label="Filtrar por nicho de mercado"
              >
                {niches.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-400">Filtros ativos:</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white"
                  onClick={filter.onRemove}
                  aria-label={`Remover filtro: ${filter.label}`}
                >
                  {filter.label}
                  <span aria-hidden="true">✕</span>
                </button>
              ))}
              <button 
                type="button" 
                className="text-xs text-blue-300 underline" 
                onClick={clearAllFilters}
                aria-label="Limpar todos os filtros"
              >
                Limpar todos
              </button>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Due diligence enxuta', desc: 'Memorando resume MRR, churn e stack. Dados completos sob NDA.', icon: Shield },
            { title: 'Tickets variados', desc: 'De R$ 20k a R$ 2mi. Filtre conforme tese e risco.', icon: Layers },
            { title: 'Atualizações diárias', desc: 'Operadores adicionam métricas e marcos em tempo real.', icon: Zap }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-[#081024] p-5 shadow-lg flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-200 uppercase tracking-[0.2em]">{item.title}</p>
                  <p className="text-slate-300 text-sm">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <span>
              Mostrando <strong>{Math.min(visibleCount, filteredOffers.length)}</strong> de{' '}
              <strong>{filteredOffers.length}</strong> ativos
            </span>
            <span>Atualizado continuamente com dados auditados.</span>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#081024] p-10 text-center">
              <p className="text-lg font-semibold">Nenhum ativo encontrado com esses filtros.</p>
              <p className="text-slate-400 mt-2">Ajuste os filtros ou limpe-os para ver o inventário completo.</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:bg-white/10"
                onClick={clearAllFilters}
                aria-label="Limpar todos os filtros para ver inventário completo"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedOffers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    isHighlighted={index === 0}
                    isAuthenticated={Boolean(session)}
                  />
                ))}
              </div>
              {visibleCount < filteredOffers.length && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    aria-label={`Mostrar mais ativos. Atualmente mostrando ${visibleCount} de ${filteredOffers.length}`}
                  >
                    Mostrar mais ativos
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </div>
    </main>
  );
};

const normalizeOffer = (offer) => {
  const asset = offer.asset ?? null;
  const mrrValue = asset?.mrr ?? null;
  const arrValue = asset?.arr ?? null;
  const formattedMRR = typeof mrrValue === 'number' ? `R$ ${mrrValue.toLocaleString('pt-BR')}` : undefined;

  return {
    id: offer.id,
    slug: asset?.slug ?? offer.id,
    title: asset?.name ?? offer.asset?.slug ?? 'Ativo digital',
    summary: asset?.description ?? 'Ativo cadastrado no marketplace.',
    classification: asset?.category ?? 'Ativo',
    niche: asset?.category ?? 'Ativos digitais',
    investmentRange: {
      min: offer.price,
      max: offer.price
    },
    revenueRange: formattedMRR ? `MRR ${formattedMRR}` : 'Sob consulta',
    valuationMultiple:
      typeof arrValue === 'number' && arrValue > 0
        ? `${(offer.price / arrValue).toFixed(1)}x ARR`
        : 'Sob consulta',
    badges: [],
    metrics: {
      mrr: formattedMRR
    }
  };
};

export async function getServerSideProps() {
  try {
    const offerResult = await listOffers({ pageSize: 50 });
    const normalized = offerResult.items.map(normalizeOffer);
    return {
      props: { offers: normalized }
    };
  } catch (error) {
    console.error('[feed] Falha ao carregar ofertas', error);
    return {
      props: { offers: [] }
    };
  }
}

export default FeedPage;
