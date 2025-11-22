'use client';

import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Footer } from './footer';
import {
  ChartLine,
  Brain,
  Shield,
  Users,
  FileText,
  Zap,
  Upload,
  Calculator,
  Handshake,
  ArrowRight,
  CheckCircle,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ChartLine,
  Brain,
  Shield,
  Users,
  FileText,
  Zap,
  Upload,
  Calculator,
  Handshake
};

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

export type ProductShot = {
  title: string;
  description: string;
  metric: string;
  highlight: string;
  gradient: string;
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
  callouts?: SimpleCard[];
};

type MarketingHomeContentProps = {
  heroStats: HeroStat[];
  proofLogos: string[];
  howItWorks: SimpleCard[];
  features: SimpleCard[];
  useCases: SimpleCard[];
  productShots: ProductShot[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  gallery: number[];
  story: StoryBlock;
  security: SecurityBlock;
};

export function MarketingHomeContent(props: MarketingHomeContentProps) {
  const {
    proofLogos,
    howItWorks,
    features,
    testimonials
  } = props;

  return (
    <div className="relative overflow-hidden bg-[#FAFAFA]">
      <StickyNavbar />
      <FloatingCTA />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-[90vh] overflow-hidden bg-[#02040a] text-white"
      >
        {/* Background Effects - Premium Glow */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.15]" />
        <div className="absolute -top-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />

        <div className="container relative z-10 grid gap-16 py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-md transition-colors hover:bg-indigo-500/15"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-indigo-200 uppercase">Beta Público · Dados auditados</span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="font-heading text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                O marketplace de <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ativos digitais
                </span>
              </motion.h1>
              <motion.p
                className="max-w-xl text-lg text-slate-400 md:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Compre e venda SaaS, newsletters e comunidades com dados verificados.
                Valuation automático, due diligence integrada e deal-room seguro.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-slate-200 hover:scale-105"
                href="/feed"
              >
                <span className="mr-2">Explorar ativos</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                href="/wizard"
              >
                Vender meu ativo
              </Link>
            </motion.div>

            <div className="pt-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-500">Confiança de players como</p>
              <MarqueeLogos logos={proofLogos} />
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative z-10 rounded-3xl border border-white/10 bg-[#0B0D18]/80 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900">
                <Image
                  src="/images/hero-dashboard.webp"
                  alt="Painel de controle do SaaS Market Cap mostrando métricas de valuation, MRR e análise de ativos digitais em tempo real"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D18] via-transparent to-transparent opacity-60" />
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-20 z-20 rounded-2xl border border-white/10 bg-[#1A1D2D]/90 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  💰
                </div>
                <div>
                  <p className="text-xs text-slate-400">Oferta Recebida</p>
                  <p className="font-semibold text-white">R$ 450.000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS - TIMELINE */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Como funciona</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Do cadastro ao exit, simplificamos cada etapa da jornada de M&A para ativos digitais.
            </p>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-slate-100 hidden md:block" />

            <div className="space-y-12 md:space-y-24">
              {howItWorks.map((item, index) => {
                const Icon = item.icon ? iconMap[item.icon] : CheckCircle;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col gap-8 md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center`}
                  >
                    <div className="flex-1 text-center md:text-left">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-600 mb-4 md:hidden`}>
                        {index + 1}
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>

                    <div className="relative flex items-center justify-center md:w-24">
                      <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200 md:flex z-10">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="aspect-video rounded-2xl bg-white border border-slate-100 p-8 flex items-center justify-center group hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                        <div className="h-20 w-20 rounded-2xl bg-indigo-50/50 shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                          <Icon size={40} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - BENTO GRID */}
      <section id="recursos" className="py-24 bg-slate-50">
        <div className="container">
          <div className="mb-16 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">Tudo o que você precisa para negociar</h2>
            <p className="text-slate-600">
              Ferramentas profissionais de M&A democratizadas para o mercado de micro-SaaS e ativos digitais.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">
            {/* Large Item 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 md:col-span-2">
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    {features[0].icon && iconMap[features[0].icon] && <ChartLine size={24} />}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{features[0].title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{features[0].description}</p>
                </div>
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                  <Image
                    src="/images/feature-valuation.webp"
                    alt="Gráfico de valuation automático mostrando múltiplos de ARR, análise de MRR e recomendações de precificação para SaaS"
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Tall Item */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 md:row-span-2">
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  {features[2].icon && iconMap[features[2].icon] && <Shield size={24} />}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{features[2].title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">{features[2].description}</p>

                <div className="relative flex-1 min-h-[200px] w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 mb-4 group-hover:border-indigo-100 transition-colors">
                  <Image
                    src="/images/feature-dealroom.webp"
                    alt="Deal room seguro com criptografia, controle de acesso e compartilhamento de documentos confidenciais para M&A de ativos digitais"
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-auto rounded-xl bg-slate-50 border border-slate-100 p-4 group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-500">Deal Room Ativo</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-slate-200" />
                    <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Small Item 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  {features[1].icon && iconMap[features[1].icon] && <Brain size={24} />}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{features[1].title}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{features[1].description}</p>
                <div className="relative h-32 w-full mt-auto overflow-hidden rounded-xl bg-slate-50 border border-slate-100 group-hover:border-indigo-100 transition-colors">
                  <Image
                    src="/images/feature-duediligence.webp"
                    alt="Due diligence assistida por IA com análise automática de métricas, detecção de anomalias e verificação de dados financeiros"
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Small Item 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                {features[5].icon && iconMap[features[5].icon] && <Zap size={24} />}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{features[5].title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{features[5].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos" className="py-24 bg-white overflow-hidden">
        <div className="container mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Quem já negociou</h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[400px] flex-shrink-0 rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <p className="mb-6 text-lg text-slate-700 italic">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.author}</p>
                    <p className="text-sm text-slate-500">{t.role} @ {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#02040a] px-8 py-20 text-center text-white md:px-20 ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.15]" />
            <div className="absolute -top-[50%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold md:text-5xl">Pronto para o próximo deal?</h2>
              <p className="text-xl text-slate-400">
                Junte-se a mais de 2.400 investidores e founders negociando ativos digitais com segurança.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link className="button primary h-14 px-8 text-lg" href="/feed">
                  Ver oportunidades
                </Link>
                <Link className="button secondary h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10" href="/wizard">
                  Vender ativo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- Subcomponents ---

function MarqueeLogos({ logos }: { logos: string[] }) {
  return (
    <div className="relative w-full overflow-hidden mask-linear-fade">
      <motion.div
        className="flex w-max gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <span key={i} className="text-lg font-semibold text-white/40 whitespace-nowrap">
            {logo}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function FloatingCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest > 500);
    });
  }, [scrollY]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 hidden md:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
    >
      <Link
        href="/wizard"
        className="flex items-center gap-3 rounded-full bg-indigo-600 px-6 py-3 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 hover:bg-indigo-700"
      >
        <span className="font-medium">Vender meu ativo</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">→</span>
      </Link>
    </motion.div>
  );
}

function StickyNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-sm backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          <span className={scrolled ? 'text-slate-900' : 'text-white'}>SMC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Como funciona', 'Recursos', 'Depoimentos'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'
                }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className={`text-sm font-medium ${scrolled ? 'text-slate-900' : 'text-white'
              }`}
          >
            Entrar
          </Link>
          <Link
            href="/auth/register?callbackUrl=/feed"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${scrolled
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
          >
            Começar
          </Link>
        </div>
      </div>
    </header>
  );
}
