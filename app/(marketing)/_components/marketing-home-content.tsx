'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type HeroStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
};

export type SimpleCard = {
  title: string;
  description: string;
  highlight?: string;
  icon?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type StoryBlock = {
  title: string;
  body: string;
  highlights: string[];
};

export type SecurityBlock = {
  title: string;
  description: string;
  bullets: string[];
};

type MarketingHomeContentProps = {
  heroStats: HeroStat[];
  proofLogos: string[];
  howItWorks: SimpleCard[];
  features: SimpleCard[];
  useCases: SimpleCard[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  gallery: number[];
  story: StoryBlock;
  security: SecurityBlock;
};

export function MarketingHomeContent(props: MarketingHomeContentProps) {
  const { heroStats, proofLogos, howItWorks, features, useCases, testimonials, faq, gallery, story, security } = props;

  return (
    <div className="relative overflow-hidden">
      <FloatingCTA />
      <section className="relative bg-gradient-to-b from-[#050611] via-[#0b0d18] to-[var(--color-bg)] text-white">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(108,92,231,0.25),_transparent_60%)]" />
        <div className="container relative grid gap-16 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 uppercase tracking-[0.3em] text-[10px] text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Beta público
              </span>
              <span className="text-white/80">Dados auditados em tempo real</span>
            </div>
            <div className="space-y-5">
              <motion.h1
                className="font-heading text-4xl leading-tight md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Avalie, compre e venda ativos digitais com transparência radical
              </motion.h1>
              <motion.p
                className="text-lg text-white/80 md:text-xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                O SMC conecta founders, compradores profissionais e flippers em um fluxo único: valuation automático,
                métricas auditadas e negociação segura com operadores verificados.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                className="button primary bg-gradient-to-r from-[#6b5bff] via-[#8f74ff] to-[#6c5ce7] text-base shadow-lg shadow-purple-500/30"
                href="/feed"
              >
                Explorar ativos
              </Link>
              <Link className="button secondary border-white/60 text-white" href="/wizard">
                Enviar meu ativo
              </Link>
            </motion.div>
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-[0_12px_48px_rgba(3,7,18,0.45)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Construído com operadores que já venderam SaaS no Brasil, com metodologia inspirada em Pitch.com e
              AngelList para dar visibilidade, dados e velocidade às negociações.
            </motion.div>
            <ProofBar proofLogos={proofLogos} />
          </div>

          <motion.div
            className="relative rounded-[32px] border border-white/10 bg-white/5 p-6 lg:p-8 shadow-[0_25px_80px_rgba(12,15,35,0.65)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Painel ao vivo</p>
                <p className="text-2xl font-semibold text-white">Health Score do ativo</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">Atualizado agora</span>
            </div>
            <HeroVisualization />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-4 text-white"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">{stat.label}</p>
                  <AnimatedStat
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    description={stat.description}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Como funciona</p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">Fluxo completo em três movimentos</h2>
            <p className="text-base text-[var(--color-text-secondary)]">
              Dados entram uma única vez, passam pelo valuation automático e são convertidos em dossiês com múltiplos de
              mercado e métricas auditadas. Tudo pronto para negociar.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[0_15px_60px_rgba(15,16,20,0.08)]">
            <p className="text-sm font-semibold text-[var(--color-text)]">“Integramos o SMC ao stack do nosso fundo.</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              As oportunidades chegam com saúde financeira, riscos mapeados e documentos organizados. É literalmente
              outra cadência de investimento.”
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
              Isabel – Partner @ Orbit Ventures
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <motion.article
              key={item.title}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
              whileHover={{ y: -6, borderColor: 'rgba(108,92,231,0.4)' }}
            >
              <p className="text-sm font-semibold text-[var(--color-primary)]">{item.highlight}</p>
              <h3 className="mb-2 text-xl font-semibold text-[var(--color-text)]">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container space-y-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Produto</p>
              <h2 className="text-3xl font-semibold text-[var(--color-text)]">SMC é um produto vivo</h2>
              <p className="max-w-2xl text-base text-[var(--color-text-secondary)]">
                Cards com métricas, deal-room com blur estratégico e insights de churn/CAC que você só encontra aqui.
              </p>
            </div>
            <Link className="button ghost" href="/dashboard">
              Ver dashboard em detalhes →
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white/70 p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(10,10,10,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,92,231,0.25),_transparent_65%)]" />
              <div className="relative space-y-4 text-[var(--color-text)]">
                <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                  <span>Visão do operador</span>
                  <span>Blur automático</span>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-inner">
                  <p className="font-heading text-2xl">Pipeline de negociações</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {['MRR • Últimos 12m', 'CAC Recuperado', 'Payback', 'Health Score'].map((item) => (
                      <div key={item} className="rounded-2xl border border-[var(--color-border)] bg-white/90 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">{item}</p>
                        <p className="text-xl font-semibold text-[var(--color-text)]">••••••••</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Para mostrar autoridade sem expor dados sensíveis, aplicamos blur controlado e placeholders
                  configuráveis.
                </p>
              </div>
            </div>
            <div className="grid gap-6">
              {features.map((feature) => (
                <motion.article
                  key={feature.title}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
                  whileHover={{ y: -4, boxShadow: '0 15px 34px rgba(32,33,36,0.1)' }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">{feature.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{feature.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container section space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Perfis atendidos</p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">Uma plataforma para cada player</h2>
          </div>
          <p className="max-w-2xl text-sm text-[var(--color-text-secondary)]">
            SaaS, newsletters, apps mobile e marketplaces aparecem com indicadores padronizados, permitindo comparar
            oportunidades rapidamente.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-[28px] border border-[var(--color-border)] bg-gradient-to-b from-white to-[var(--color-surface)] p-6 shadow-sm"
            >
              <div className="mb-4 h-36 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-center text-sm text-[var(--color-text-secondary)] flex items-center justify-center">
                Renderização ilustrativa
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">{useCase.highlight}</span>
              <h3 className="mt-2 text-xl font-semibold text-[var(--color-text)]">{useCase.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Prova social</p>
              <h2 className="text-3xl font-semibold text-[var(--color-text)]">Relatos reais</h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">Estes operadores já conduziram rodadas via SMC.</p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-white p-3">
            <motion.div
              className="flex gap-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.author}-${index}`}
                  className="min-w-[280px] max-w-sm rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
                >
                  <p className="text-sm text-[var(--color-text-secondary)]">“{testimonial.quote}”</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">{testimonial.author}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container section space-y-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <article className="rounded-[32px] border border-[var(--color-border)] bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Por que existimos</p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">{story.title}</h2>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{story.body}</p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text)]">
              {story.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Segurança e auditoria</p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">{security.title}</h2>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{security.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text)]">
              {security.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container section space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">Galeria</p>
          <h2 className="text-3xl font-semibold text-[var(--color-text)]">Alguns ativos auditados</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Cada card representa um ativo com métricas reais.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <motion.div
              key={item}
              className="aspect-video rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[#cfd5ff] to-white shadow-sm"
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-primary)]">FAQ</p>
            <h2 className="text-3xl font-semibold text-[var(--color-text)]">Perguntas frequentes</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.question}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
                open={item === faq[0]}
              >
                <summary className="cursor-pointer text-lg font-semibold text-[var(--color-text)]">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="rounded-[32px] border border-transparent bg-gradient-to-r from-[#0e0f24] via-[#1b1140] to-[#120d2c] p-[1px] shadow-[0_20px_70px_rgba(12,15,35,0.4)]">
          <div className="rounded-[32px] bg-[#080914] p-10 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Pronto para negociar</p>
                <h2 className="text-3xl font-semibold">Abra o SMC agora mesmo</h2>
                <p className="text-sm text-white/70">
                  Listagens auditadas, compradores verificados e dados para defender seu valuation. Tudo em um só fluxo.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="button primary text-base" href="/feed">
                  Explorar ativos
                </Link>
                <Link className="button secondary text-base" href="/wizard">
                  Enviar meu ativo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofBar({ proofLogos }: { proofLogos: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-[0.3em] text-white/70">
      <span>Utilizado em operações com</span>
      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
        {proofLogos.map((logo) => (
          <span key={logo} className="text-white/80">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnimatedStat({
  value,
  prefix,
  suffix,
  description
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 90, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => {
      unsubscribe();
    };
  }, [springValue]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <div ref={ref}>
      <p className="text-3xl font-semibold">
        {prefix}
        {Math.round(displayValue)}
        {suffix}
      </p>
      <p className="text-xs text-white/70">{description}</p>
    </div>
  );
}

function HeroVisualization() {
  return (
    <div className="space-y-6 rounded-[28px] border border-white/15 bg-gradient-to-b from-[#141731] to-[#070816] p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>MRR + Health Score</span>
        <span>Atualização automática</span>
      </div>
      <div className="relative h-60 overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4">
        <svg className="absolute inset-0 h-full w-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <motion.svg className="h-full w-full" viewBox="0 0 400 240" fill="none">
          <motion.path
            d="M10 200 C 80 120, 120 220, 190 150 C 240 110, 270 80, 320 110 C 360 140, 390 60, 390 60"
            stroke="url(#lineGradientPrimary)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
          <motion.path
            d="M10 220 C 70 180, 100 140, 170 190 C 220 230, 270 200, 320 210 C 360 220, 390 200, 390 200"
            stroke="rgba(98,226,206,0.5)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
          />
          <defs>
            <linearGradient id="lineGradientPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6b5bff" />
              <stop offset="100%" stopColor="#00c2ff" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Score operacional', detail: '82/100', trend: '+6 pts • 30 dias' },
          { title: 'Churn previsto', detail: '2,8%', trend: '-0,4 p.p.' },
          { title: 'Ticket médio', detail: 'R$ 297', trend: '+11% YoY' }
        ].map((metric) => (
          <div key={metric.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{metric.title}</p>
            <p className="text-xl font-semibold text-white">{metric.detail}</p>
            <p className="text-xs text-white/60">{metric.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingCTA() {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-30 hidden md:block">
      <div className="pointer-events-auto rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
        <span>Pronto para enviar seu ativo?</span>{' '}
        <Link className="ml-2 font-semibold text-white underline" href="/wizard">
          Abrir wizard →
        </Link>
      </div>
    </div>
  );
}
