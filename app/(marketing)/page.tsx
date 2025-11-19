import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SMC – Avalie, compre e venda ativos digitais',
  description:
    'Marketplace especializado em valuation, compra e venda de SaaS, apps, sites e negócios digitais com due diligence assistida.'
};

const howItWorks = [
  {
    title: 'Envie seu ativo',
    description: 'Preencha o formulário com métricas de MRR, churn, CAC e posicionamento.'
  },
  {
    title: 'Receba valuation automático',
    description: 'Nossa inteligência cruza dados de mercado e entrega múltiplos de referência.'
  },
  {
    title: 'Negocie com compradores qualificados',
    description: 'Receba propostas diretas de fundos, flippers e operadores avaliados.'
  }
];

const features = [
  'Valuation Automático',
  'Due Diligence Assistida por IA',
  'Métricas Transparentes',
  'Negociação Segura',
  'Base Qualificada de Compradores',
  'Exportação de Relatórios'
];

const useCases = [
  {
    title: 'Para Fundadores de SaaS',
    description: 'Organize seus indicadores, receba valuation objetivo e acesse compradores prontos para investir.'
  },
  {
    title: 'Para Compradores Profissionais',
    description: 'Encontre negócios com dados auditados, histórico de MRR e múltiplos alinhados ao mercado.'
  },
  {
    title: 'Para Flippers de Sites',
    description: 'Acelere a aquisição e revenda de projetos verificando métricas-chave em minutos.'
  }
];

const testimonials = [
  {
    quote: 'Conseguimos vender nosso micro-SaaS em 34 dias com múltiplo acima do esperado.',
    author: 'Ana Costa',
    role: 'Founder – BackOffice Pro'
  },
  {
    quote: 'O painel de métricas e a due diligence assistida reduziram riscos nas aquisições.',
    author: 'Marcos Lima',
    role: 'Investor – Horizon Capital'
  },
  {
    quote: 'O SMC virou o canal principal para testar e flipar sites rentáveis.',
    author: 'Juliana Ribeiro',
    role: 'Digital Asset Flipper'
  }
];

const faq = [
  'Como funciona o valuation automático?',
  'Posso cadastrar ativos sem receita?',
  'Quais métricas são obrigatórias?',
  'Como funciona a verificação dos compradores?',
  'Existe comissão sobre a venda?',
  'Posso negociar em sigilo?',
  'Quais mercados o SMC cobre?',
  'Como é feito o pagamento após a venda?',
  'Posso listar múltiplos ativos ao mesmo tempo?',
  'O SMC oferece suporte jurídico ou contábil?'
];

const galleryPlaceholders = Array.from({ length: 8 }).map((_, index) => index);

export default function MarketingHome() {
  return (
    <main className="space-y-28 px-4 py-20 md:px-12 lg:px-24 bg-gradient-to-b from-[#02040a] via-[#050a1a] to-[#02040a]">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400" /> SaaS Market Cap
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white">
            Avalie, compre e venda ativos digitais com transparência total
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Estrutura completa para founders, investidores e profissionais de aquisição acessarem valuation automático,
            métricas auditadas e compradores qualificados.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="button primary text-base" href="/feed">
              Explorar ativos
            </Link>
            <Link className="button secondary text-base" href="/wizard">
              Enviar meu ativo
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3 text-left">
            {[
              { label: 'Ativos avaliados', value: '320+' },
              { label: 'Volume listado', value: 'R$ 180 mi' },
              { label: 'Compradores verificados', value: '2.400+' }
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-700/20 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-[#030713]/80 p-8 shadow-2xl shadow-blue-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Visão de valuation</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Live</span>
            </div>
            <div className="mt-6 h-56 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center text-slate-400">Placeholder para mockup de gráfico</div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { label: 'MRR auditado', value: 'R$ 28.400', trend: '+9% · 30d' },
                { label: 'Múltiplo sugerido', value: '4.2x ARR', trend: 'ref. mercado B2B' }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="text-xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Como funciona</p>
          <h2 className="text-3xl font-semibold">Três passos para navegar no mercado secundário</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article key={item.title} className="bg-[#050b1a] border border-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Recursos</p>
            <h2 className="text-3xl font-semibold">Tudo o que você precisa em um só lugar</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-lg">
            Automação de valuation, due diligence com IA e infraestrutura de negociação centralizados em um dashboard.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/10 to-transparent p-5 text-slate-100 shadow-2xl shadow-black/40">
              <div className="mb-3 h-10 w-10 rounded-full bg-white/10 text-center text-lg leading-10 text-blue-300">✦</div>
              <p className="text-base font-semibold">{feature}</p>
              <p className="text-sm text-slate-400">Operações suportadas com materiais prontos para due diligence.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Use cases</p>
          <h2 className="text-3xl font-semibold">SMC para múltiplos perfis do ecossistema</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="h-32 rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5 text-blue-200 flex items-center justify-center">
                Ilustração
              </div>
              <h3 className="text-xl font-semibold">{useCase.title}</h3>
              <p className="text-slate-300 text-sm">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Galeria</p>
            <h2 className="text-3xl font-semibold">Alguns ativos já avaliados</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">Visualize como entregamos métricas de MRR, churn e CAC em cards prontos para investidores.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPlaceholders.map((item) => (
            <div key={item} className="aspect-video rounded-2xl border border-white/5 bg-gradient-to-br from-blue-900/40 to-purple-900/30" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Depoimentos</p>
          <h2 className="text-3xl font-semibold">Confiança validada por quem usa</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="bg-[#050b1a] border border-white/5 rounded-3xl p-6 space-y-4">
              <p className="text-slate-200">“{testimonial.quote}”</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">FAQ</p>
          <h2 className="text-3xl font-semibold">Perguntas frequentes</h2>
        </div>
        <div className="space-y-4">
          {faq.map((question) => (
            <details key={question} className="bg-[#050b1a] border border-white/5 rounded-2xl p-4">
              <summary className="cursor-pointer text-lg font-semibold text-white">{question}</summary>
              <p className="mt-3 text-sm text-slate-300">
                Nossa equipe responde em até 24h e direciona você para o melhor fluxo de compra ou venda.
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 pt-8 text-sm text-slate-400 flex flex-wrap gap-6 justify-between">
        <p>© {new Date().getFullYear()} SaaS Market Cap</p>
        <div className="flex gap-4">
          <Link href="/" className="text-slate-300/80 hover:text-white">Termos</Link>
          <Link href="/" className="text-slate-300/80 hover:text-white">Privacidade</Link>
          <a href="mailto:contato@saasmarketcap.com">Contato</a>
        </div>
      </footer>
    </main>
  );
}
