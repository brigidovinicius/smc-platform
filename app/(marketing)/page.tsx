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
    description: 'Organize seus indicadores, receba valuation objetivo e acesse uma carteira de compradores prontos para investir.'
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
    <main className="space-y-24 px-4 py-16 md:px-12 lg:px-24">
      {/* HERO */}
      <section className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-blue-300">SaaS Market Cap</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Avalie, Compre e Venda Ativos Digitais com Transparência
          </h1>
          <p className="text-lg text-slate-300">
            O maior hub de valuation e mercado secundário para SaaS, apps, sites e negócios digitais.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="button primary" href="/feed">
              Explorar ativos
            </Link>
            <Link className="button secondary" href="/wizard">
              Enviar meu ativo
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <p className="text-sm text-slate-300 mb-4">Visão consolidada</p>
          <div className="h-64 rounded-2xl bg-[#050b1a] border border-white/5 flex items-center justify-center">
            <span className="text-slate-400">[Mockup de gráfico/metrics]</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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

      {/* FEATURES */}
      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Recursos</p>
          <h2 className="text-3xl font-semibold">Tudo o que você precisa em um só lugar</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="bg-[#060c1a] border border-white/5 rounded-2xl p-5 text-center text-slate-200">
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Use Cases</p>
          <h2 className="text-3xl font-semibold">SMC para diversos perfis do ecossistema</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="bg-[#050b1a] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="h-32 bg-[#070d1f] border border-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                Placeholder
              </div>
              <h3 className="text-xl font-semibold">{useCase.title}</h3>
              <p className="text-slate-300 text-sm">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300">Galeria</p>
          <h2 className="text-3xl font-semibold">Alguns ativos já avaliados</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPlaceholders.map((item) => (
            <div key={item} className="aspect-video rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/30 border border-white/5" />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
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

      {/* FAQ */}
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

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-8 text-sm text-slate-400 flex flex-wrap gap-6 justify-between">
        <p>© {new Date().getFullYear()} SaaS Market Cap</p>
        <div className="flex gap-4">
          <a href="/terms">Termos</a>
          <a href="/privacy">Privacidade</a>
          <a href="mailto:contato@saasmarketcap.com">Contato</a>
        </div>
      </footer>
    </main>
  );
}
