export const offers = [
  {
    slug: 'crm-micro-saas-recorrencia',
    title: 'CRM micro-SaaS especialista em recorrência B2B',
    classification: 'SaaS',
    investmentRange: { min: 180000, max: 250000 },
    revenueRange: 'MRR R$ 18k – R$ 25k',
    valuationMultiple: '4.2x ARR',
    niche: 'Ferramentas B2B',
    highlightTier: 'OURO',
    metrics: {
      mrr: 'R$ 22.400',
      churn: '1.8% mensal',
      ltv: 'R$ 9.600',
      cac: 'R$ 2.150'
    },
    summary:
      'Pipeline previsível com 40 contas SMB, integrações nativas com RD Station e HubSpot e biblioteca de playbooks para times de CS.',
    badges: ['Playbooks prontos', 'Integrações nativas', 'Time remoto']
  },
  {
    slug: 'marketplace-templates-lowcode',
    title: 'Marketplace de templates low-code com comunidade ativa',
    classification: 'Marketplace',
    investmentRange: { min: 80000, max: 120000 },
    revenueRange: 'Faturamento R$ 35k/mês',
    valuationMultiple: '3.1x lucro',
    niche: 'Low-code / No-code',
    highlightTier: 'PRATA',
    metrics: {
      mrr: 'R$ 12.700',
      churn: '3% mensal',
      ltv: 'R$ 2.800',
      cac: 'R$ 340'
    },
    summary:
      'Plataforma com 500+ templates para Bubble e Webflow, monetização via comissionamento e assinaturas PRO para criadores.',
    badges: ['Comunidade ativa', 'Assinatura PRO', '50k pageviews/mês']
  },
  {
    slug: 'newsletter-saas-dados',
    title: 'Newsletter SaaS com inteligência de dados e upsell para relatórios',
    classification: 'Newsletter',
    investmentRange: { min: 50000, max: 75000 },
    revenueRange: 'Receita R$ 10k/mês',
    valuationMultiple: '3.5x receita',
    niche: 'Inteligência de mercado',
    highlightTier: 'BRONZE',
    metrics: {
      mrr: 'R$ 6.400',
      churn: '0.9% mensal',
      ltv: 'R$ 1.200',
      cac: 'R$ 90'
    },
    summary:
      'Lista altamente segmentada com 18 mil assinantes. Conteúdo premium sobre métricas SaaS e relatórios sob demanda.',
    badges: ['18k assinantes', 'Conteúdo premium', 'Upsell B2B']
  }
];

export const getAllOffers = () => offers;

export const getOfferBySlug = (slug) => offers.find((offer) => offer.slug === slug);
