import type { Metadata } from 'next';
import { MarketingHomeContent } from './_components/marketing-home-content';
import { StructuredData } from './_components/structured-data';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'SMC – Avalie, compre e venda ativos digitais com dados reais',
  description:
    'O SaaS Market Cap combina valuation automático, due diligence assistida por IA e compradores verificados para founders, investidores e flippers.',
  keywords: [
    'SaaS marketplace',
    'comprar SaaS',
    'vender SaaS',
    'valuation automático',
    'due diligence IA',
    'M&A ativos digitais',
    'marketplace ativos digitais',
    'investir em SaaS',
    'múltiplos ARR',
    'MRR',
    'micro-SaaS',
    'newsletters pagas',
    'apps digitais',
    'deal room',
    'compradores verificados'
  ],
  authors: [{ name: 'SaaS Market Cap' }],
  creator: 'SaaS Market Cap',
  publisher: 'SaaS Market Cap',
  alternates: {
    canonical: SITE_CONFIG.url
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_CONFIG.url,
    siteName: 'SaaS Market Cap',
    title: 'SMC – Marketplace de Ativos Digitais com Valuation Automático',
    description:
      'Compre e venda SaaS, newsletters e apps com dados verificados. Valuation automático, due diligence com IA e compradores qualificados. Mais de 2.400 investidores ativos.',
    images: [
      {
        url: '/images/hero-dashboard.webp',
        width: 1024,
        height: 1024,
        alt: 'Painel de controle do SaaS Market Cap mostrando métricas de valuation e análise de ativos digitais'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMC – Marketplace de Ativos Digitais',
    description:
      'Valuation automático, due diligence com IA e compradores verificados para negociar SaaS e ativos digitais.',
    images: ['/images/hero-dashboard.webp'],
    creator: '@saasmarketcap'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  },
  verification: {
    // TODO: Adicione seu código real do Google Search Console aqui
    // Obtenha em: https://search.google.com/search-console
    google: 'ADICIONE_SEU_CODIGO_AQUI'
  }
};

const heroStats = [
  {
    label: 'Ativos avaliados',
    value: 326,
    suffix: '+',
    description: 'MRR auditado nas últimas 12 semanas.'
  },
  {
    label: 'Volume listado',
    value: 180,
    prefix: 'R$ ',
    suffix: ' mi',
    description: 'Inventário disponível no marketplace.'
  },
  {
    label: 'Compradores verificados',
    value: 2400,
    suffix: '+',
    description: 'Investidores, flippers e funds.'
  },
  {
    label: 'Tempo médio de venda',
    value: 34,
    suffix: ' dias',
    description: 'Do publish ao closing.'
  }
];

const proofLogos = ['Atlas Capital', 'LatAm Operators', 'Orbit Ventures', 'Angels Club', 'Foxter Labs'];

const howItWorks = [
  {
    title: 'Envie seu ativo',
    description:
      'Pitch guiado e intuitivo que organiza suas métricas em minutos. Interface simples que padroniza MRR, churn, CAC e stack sem planilhas complexas.',
    highlight: '1 • Intake',
    icon: 'Upload'
  },
  {
    title: 'Receba valuation automático',
    description:
      'Motor inteligente analisa seus dados e gera dossiê profissional pronto para apresentar. Valuation baseado em comparáveis reais do mercado.',
    highlight: '2 • Valuation',
    icon: 'Calculator'
  },
  {
    title: 'Negocie com compradores qualificados',
    description:
      'Processo facilitado com compradores verificados, NDA digital e trilha de negociação transparente. Do primeiro contato ao closing.',
    highlight: '3 • Negociação',
    icon: 'Handshake'
  }
];

const features = [
  {
    title: 'Valuation Automático',
    description:
      'Modelo proprietário cruza MRR, churn, CAC, LTV, crescimento e riscos setoriais para recomendar múltiplos.',
    icon: 'ChartLine'
  },
  {
    title: 'Due Diligence com IA',
    description:
      'Checklist inteligente sinaliza anomalias em receitas, cohort, dependências e expõe todo o histórico de métricas.',
    icon: 'Brain'
  },
  {
    title: 'Deal-Room Seguro',
    description:
      'Uploads criptografados, blur automático e logs de acesso para compartilhar dados sensíveis só com quem avançar.',
    icon: 'Shield'
  },
  {
    title: 'Base de Compradores',
    description:
      'Funds, agregadores e flippers pré-verificados com acordo operacional e SLA para envio de propostas.',
    icon: 'Users'
  },
  {
    title: 'Relatórios Exportáveis',
    description:
      'Gere PDF, planilhas e modelos de data-room em um clique para mostrar tração e uso de caixa com clareza.',
    icon: 'FileText'
  },
  {
    title: 'Insights Operacionais',
    description:
      'Alertas sobre churn, retenção, payback e health score para orientar founders antes de abrir rodada ou venda.',
    icon: 'Zap'
  }
];

const useCases = [
  {
    title: 'Fundadores de SaaS e apps',
    description: 'Estruture os dados críticos, valide valuation e escolha quando abrir negociação com a base SMC.',
    highlight: 'Founders'
  },
  {
    title: 'Investidores e compradores',
    description: 'Acesso fácil às métricas principais (MRR, churn, CAC, LTV) padronizadas e auditáveis. Pipeline qualificado para decisões rápidas e informadas.',
    highlight: 'Investidores'
  },
  {
    title: 'Flippers e operadores',
    description: 'Identifique deals subprecificados, acompanhe health score e planeje turnaround com dados completos.',
    highlight: 'Flippers'
  }
];

const testimonials = [
  {
    quote: 'Vimos o dossiê completo, negociamos em duas chamadas e fechamos com múltiplo 4.3x ARR.',
    author: 'Ana Costa',
    role: 'Founder',
    company: 'BackOffice Pro'
  },
  {
    quote: 'A automação de due diligence diminuiu 70% do tempo que gastávamos analisando micro-SaaS.',
    author: 'Marcos Lima',
    role: 'Investor',
    company: 'Horizon Capital'
  },
  {
    quote: 'O marketplace virou o principal canal para flippar sites e newsletters rentáveis no Brasil.',
    author: 'Juliana Ribeiro',
    role: 'Operator',
    company: 'Digital Asset Lab'
  }
];

const faq = [
  {
    question: 'Como o valuation automático é calculado?',
    answer:
      'Usamos múltiplos baseados em transações recentes, ajustados por MRR, churn, CAC, LTV, crescimento e risco setorial. Cada input gera um relatório com justificativa do múltiplo sugerido.'
  },
  {
    question: 'Posso cadastrar ativos que ainda não geram receita recorrente?',
    answer:
      'Sim. Para ativos em estágio inicial consideramos GMV, usuários ativos, leads e provas de tração. Você recebe orientações claras sobre o que precisa evoluir antes de abrir negociação.'
  },
  {
    question: 'Como os compradores são verificados?',
    answer:
      'Aplicamos KYC, pedimos prova de fundos e histórico de operações. Só liberamos acesso completo aos dados após acordo de confidencialidade e aceite dos termos da plataforma.'
  },
  {
    question: 'Existe comissão sobre a venda?',
    answer:
      'Trabalhamos com success fee escalonado conforme o tamanho da transação. Não há custo para listar ativos; você só paga quando fecha negócio dentro do SMC.'
  },
  {
    question: 'Consigo negociar em sigilo?',
    answer:
      'Sim. Você controla quem acessa o data-room, habilita blur automático e pode assinar NDA digital antes de revelar informações críticas.'
  },
  {
    question: 'Quais mercados e modelos o SMC cobre?',
    answer:
      'SaaS B2B/B2C, apps mobile, marketplaces, newsletters pagas, APIs e plataformas de conteúdo digital. Expandimos os filtros constantemente.'
  },
  {
    question: 'Como funciona o pagamento após o closing?',
    answer:
      'Trabalhamos com instrumentos de escrow e parceiros jurídicos para custodiar o valor até que as transferências de ativos sejam confirmadas.'
  },
  {
    question: 'Posso listar vários ativos ao mesmo tempo?',
    answer:
      'Pode. Cada ativo recebe um dossiê independente e tem indicadores próprios. Operamos com limites apenas para garantir qualidade do inventário.'
  },
  {
    question: 'O SMC fornece suporte jurídico ou contábil?',
    answer:
      'Temos parceiros especializados e templates prontos para contratos de compra e venda, reorganização societária e transferência de IP.'
  },
  {
    question: 'Qual o prazo médio para fechar uma venda?',
    answer:
      'A média atual é de 34 dias, mas depende do ticket, da qualidade dos dados e da velocidade de resposta entre as partes.'
  }
];

const galleryPlaceholders = Array.from({ length: 8 }).map((_, index) => index);

const story = {
  title: 'Criamos o SMC porque founders não podem depender de guesses para precificar um ativo digital.',
  body: 'Depois de ver dezenas de negociações travarem por falta de dados e padrões, construímos uma infraestrutura focada em métricas e governança. O resultado é clareza para quem vende e convicção para quem compra.',
  highlights: [
    'Metodologia própria inspirada em AngelList, Pitch.com e operadores brasileiros.',
    'Processo de onboarding assistido com especialistas em M&A + automações com IA.',
    'Relatórios que educam o fundador sobre o que precisa evoluir para capturar múltiplos maiores.'
  ]
};

const productShots = [
  {
    highlight: 'Insights de métricas',
    title: 'Canvas de cohort',
    description: 'Veja retenção, expansão e churn com filtros por plano e faixa de ticket.',
    metric: 'Net Revenue Retention · 118%',
    gradient: 'linear-gradient(135deg, #120C2C 0%, #302A73 50%, #5A45B7 100%)'
  },
  {
    highlight: 'Deal room',
    title: 'Documentos com blur',
    description: 'Compartilhe P&L e contratos com níveis de acesso configuráveis.',
    metric: '16 documentos liberados',
    gradient: 'linear-gradient(135deg, #0F1F3C 0%, #123F6F 50%, #29A4D9 100%)'
  },
  {
    highlight: 'Comparativo de múltiplos',
    title: 'Múltiplos sugeridos',
    description: 'Compare deals similares no mercado secundário e gere argumentos de valuation.',
    metric: 'Faixa sugerida · 4.1x a 4.5x ARR',
    gradient: 'linear-gradient(135deg, #2D0F3B 0%, #6E0F88 60%, #A855F7 100%)'
  }
];

const security = {
  title: 'Camadas de confiança para negociar ativos de alto valor.',
  description:
    'Utilizamos criptografia, logs auditáveis e políticas rígidas de acesso para proteger dados financeiros e estratégicos.',
  bullets: [
    'Due diligence com histórico de alterações em métricas.',
    'KYC e verificação manual de operadores antes de liberar data-room.',
    'Integração com parceiros jurídicos e escrow para custodiar pagamentos.'
  ],
  callouts: [
    {
      highlight: 'Compliance',
      title: 'Logs auditáveis',
      description: 'Monitoramos cada acesso e alteração nos dados do ativo.'
    },
    {
      highlight: 'Sigilo',
      title: 'Blur e NDA digital',
      description: 'Escolha o nível de exposição de cada documento antes de liberar.'
    },
    {
      highlight: 'Liquidação',
      title: 'Escrow protegido',
      description: 'Parceiros jurídicos e financeiros dão segurança ao closing.'
    }
  ]
};

export default function MarketingHome() {
  return (
    <>
      <StructuredData faq={faq} />
      <MarketingHomeContent
        heroStats={heroStats}
        proofLogos={proofLogos}
        howItWorks={howItWorks}
        features={features}
        useCases={useCases}
        productShots={productShots}
        testimonials={testimonials}
        faq={faq}
        gallery={galleryPlaceholders}
        story={story}
        security={security}
      />
    </>
  );
}
