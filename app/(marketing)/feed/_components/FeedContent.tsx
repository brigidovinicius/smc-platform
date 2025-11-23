'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRightCircle, Filter, Shield, Zap, Layers, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface Offer {
  id: string;
  slug: string;
  title: string;
  summary: string;
  classification: string;
  niche: string;
  investmentRange?: { min: number; max: number };
  revenueRange: string;
  valuationMultiple: string;
  badges?: string[];
  metrics?: { mrr?: string };
}

interface FeedContentProps {
  offers: Offer[];
}

export function FeedContent({ offers }: FeedContentProps) {
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

  const OfferCard = ({ offer, isHighlighted }: { offer: Offer; isHighlighted: boolean }) => {
    const ctaHref = `/offers/${offer.slug}`;
    const ctaLabel = 'Ver detalhes →';

    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
          isHighlighted ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-indigo-600 mb-3">
          {isHighlighted && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] tracking-[0.2em] text-indigo-700">
              Novo
            </span>
          )}
          <span>{offer.classification}</span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">{offer.title}</h2>
        <p className="text-slate-600 mb-4">{offer.summary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 mb-4">
          <div>
            <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
              Faturamento
              <span className="text-indigo-500 cursor-help" title="MRR aproximado reportado pelo operador.">
                ⓘ
              </span>
            </p>
            <strong className="text-slate-900">{offer.revenueRange}</strong>
          </div>
          <div>
            <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
              Investimento
              <span className="text-indigo-500 cursor-help" title="Faixa esperada para aquisição equity/cash-out.">
                ⓘ
              </span>
            </p>
            <strong className="text-slate-900">
              {offer.investmentRange
                ? `R$ ${(offer.investmentRange.min / 1000).toFixed(0)}k – R$ ${(offer.investmentRange.max / 1000).toFixed(0)}k`
                : 'Sob consulta'}
            </strong>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Nicho</p>
            <strong className="text-slate-900">{offer.niche}</strong>
          </div>
          <div>
            <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
              Múltiplo
              <span className="text-indigo-500 cursor-help" title="Valor pedido / ARR.">
                ⓘ
              </span>
            </p>
            <strong className="text-slate-900">{offer.valuationMultiple}</strong>
          </div>
        </div>
        {offer.badges && offer.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {offer.badges.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                {badge}
              </span>
            ))}
          </div>
        )}
        <Link
          href={ctaHref}
          className="mt-4 inline-flex items-center justify-center w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 hover:scale-[1.02]"
          aria-label={`${ctaLabel} - ${offer.title}`}
        >
          {ctaLabel}
        </Link>
      </motion.article>
    );
  };

  return (
    <div className="container py-16 space-y-12">
      {/* Hero Stats Section */}
      <section className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="tracking-[0.4em] uppercase text-xs text-indigo-600 font-semibold">SMC FEED · Prévia pública</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] text-slate-900">
              Oportunidades de SaaS, marketplaces e newsletters com métricas auditadas.
            </h1>
            <p className="text-slate-600 max-w-2xl text-lg">
              Memorandos enxutos com faixa de investimento, MRR e nicho. Filtre por ticket, classificação e MRR para
              encontrar ativos alinhados ao seu perfil. Para dados completos, faça login.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/login?callbackUrl=/feed"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-800 transition hover:scale-105"
                aria-label="Fazer login para receber memorando completo"
              >
                Receber memorando completo
                <ArrowRightCircle className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/wizard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                aria-label="Cadastrar novo ativo no marketplace"
              >
                Listar meu ativo
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
                <Shield className="h-3.5 w-3.5" />
                Inventário curado e auditado
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-indigo-700">
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
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-md"
                >
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.hint}</p>
                  </div>
                  <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Como usamos este feed</h2>
            <p className="text-slate-600">
              Curadoria baseada em MRR, churn, CAC e comparáveis. Founders usam para captar propostas; investidores, para filtrar tickets e nichos.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" aria-label="Filtros do feed">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-700">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold">Refine por ticket, MRR e nicho</span>
          </div>
          <span className="text-xs text-slate-500">Prévia pública · Detalhes completos pedem login</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-600 font-medium">Classificação</span>
            <select
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
            <span className="text-slate-600 font-medium">Ticket de investimento</span>
            <select
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
            <span className="text-slate-600 font-medium">MRR</span>
            <select
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
            <span className="text-slate-600 font-medium">Nicho</span>
            <select
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
          <div className="flex flex-wrap items-center gap-3 text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-600">Filtros ativos:</span>
            {activeFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-200 transition"
                onClick={filter.onRemove}
                aria-label={`Remover filtro: ${filter.label}`}
              >
                {filter.label}
                <span aria-hidden="true">✕</span>
              </button>
            ))}
            <button
              type="button"
              className="text-xs text-indigo-600 underline hover:text-indigo-700"
              onClick={clearAllFilters}
              aria-label="Limpar todos os filtros"
            >
              Limpar todos
            </button>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Due diligence enxuta', desc: 'Memorando resume MRR, churn e stack. Dados completos sob NDA.', icon: Shield },
          { title: 'Tickets variados', desc: 'De R$ 20k a R$ 2mi. Filtre conforme tese e risco.', icon: Layers },
          { title: 'Atualizações diárias', desc: 'Operadores adicionam métricas e marcos em tempo real.', icon: Zap }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 uppercase tracking-[0.2em] font-semibold mb-1">{item.title}</p>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Offers Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            Mostrando <strong className="text-slate-900">{Math.min(visibleCount, filteredOffers.length)}</strong> de{' '}
            <strong className="text-slate-900">{filteredOffers.length}</strong> ativos
          </span>
          <span>Atualizado continuamente com dados auditados.</span>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Nenhum ativo encontrado com esses filtros.</p>
            <p className="text-slate-600 mt-2">Ajuste os filtros ou limpe-os para ver o inventário completo.</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm text-slate-900 transition hover:bg-slate-50"
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
                <OfferCard key={offer.id} offer={offer} isHighlighted={index === 0} />
              ))}
            </div>
            {visibleCount < filteredOffers.length && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 hover:scale-105"
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
  );
}

