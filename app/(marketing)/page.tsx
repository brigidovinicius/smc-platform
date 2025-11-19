import type { Metadata } from 'next';
import { MarketingHomeContent } from './_components/marketing-home-content';

export const metadata: Metadata = {
  title: 'SMC – Avalie, compre e venda ativos digitais com dados reais',
  description:
    'O SaaS Market Cap combina valuation automático, due diligence assistida por IA e compradores verificados para founders, investidores e flippers.'
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
      'Cadastro guiado com métricas de MRR, churn, CAC, canais de aquisição e stack tecnológico. Tudo padronizado.',
    highlight: '1 • Intake'
  },
  {
    title: 'Receba valuation automático',
    description:
      'Nosso motor aplica múltiplos comparáveis, sanity check de métricas e gera dossiê pronto para compartilhar.',
    highlight: '2 • Valuation'
  },
  {
    title: 'Negocie com compradores qualificados',
    description:
      'Acesso a funds, clubes de compra e operadores individuais com NDA, trilha de negociação e escrow seguro.',
    highlight: '3 • Negociação'
  }
];

const features = [
  {
    title: 'Valuation Automático',
    description:
      'Modelo proprietário cruza MRR, churn, CAC, LTV, crescimento e riscos setoriais para recomendar múltiplos.',
    icon: '📈'
  },
  {
    title: 'Due Diligence com IA',
    description:
      'Checklist inteligente sinaliza anomalias em receitas, cohort, dependências e expõe todo o histórico de métricas.',
    icon: '🧠'
  },
  {
    title: 'Deal-Room Seguro',
    description:
      'Uploads criptografados, blur automático e logs de acesso para compartilhar dados sensíveis só com quem avançar.',
    icon: '🛡️'
  },
  {
    title: 'Base de Compradores',
    description:
      'Funds, agregadores e flippers pré-verificados com acordo operacional e SLA para envio de propostas.',
    icon: '🤝'
  },
  {
    title: 'Relatórios Exportáveis',
    description:
      'Gere PDF, planilhas e modelos de data-room em um clique para mostrar tração e uso de caixa com clareza.',
    icon: '🗂️'
  },
  {
    title: 'Insights Operacionais',
    description:
      'Alertas sobre churn, retenção, payback e health score para orientar founders antes de abrir rodada ou venda.',
    icon: '⚡️'
  }
];

const useCases = [
  {
    title: 'Fundadores de SaaS e apps',
    description: 'Estruture os dados críticos, valide valuation e escolha quando abrir negociação com a base SMC.',
    highlight: 'Founders'
  },
  {
    title: 'Compradores institucionais',
    description: 'Receba pipeline com métricas padronizadas e histórico auditável para comitês e LPs.',
    highlight: 'Funds & studios'
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

const security = {
  title: 'Camadas de confiança para negociar ativos de alto valor.',
  description:
    'Utilizamos criptografia, logs auditáveis e políticas rígidas de acesso para proteger dados financeiros e estratégicos.',
  bullets: [
    'Due diligence com histórico de alterações em métricas.',
    'KYC e verificação manual de operadores antes de liberar data-room.',
    'Integração com parceiros jurídicos e escrow para custodiar pagamentos.'
  ]
};

export default function MarketingHome() {
  return (
    <MarketingHomeContent
      heroStats={heroStats}
      proofLogos={proofLogos}
      howItWorks={howItWorks}
      features={features}
      useCases={useCases}
      testimonials={testimonials}
      faq={faq}
      gallery={galleryPlaceholders}
      story={story}
      security={security}
    />
  );
}
