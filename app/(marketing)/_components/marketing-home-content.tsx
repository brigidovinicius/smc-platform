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
import { GridBackground, Marquee, FeatureCards, HowItWorks } from '@/components/marketing';
import { Logo } from '@/components/Logo';

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
        className="relative min-h-[90vh] overflow-hidden bg-[#050611] text-white"
      >
        {/* Grid Background */}
        <GridBackground />
        
        {/* Background Effects - Removed gradients per brand guidelines */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />

        <div className="container relative z-10 grid gap-8 md:gap-16 py-20 md:py-24 lg:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center px-4 sm:px-6">
          <div className="space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-wide text-white/90 uppercase">Public Beta · Audited Data</span>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <motion.h1
                className="font-heading text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                The marketplace for <br className="hidden sm:block" />
                <span className="text-[#0044CC]">
                  digital assets
                </span>
              </motion.h1>
              <motion.p
                className="max-w-xl text-base text-slate-400 sm:text-lg md:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Buy and sell SaaS, newsletters, and communities with verified data.
                Automated valuation, integrated due diligence, and secure deal room.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-6 sm:px-8 font-medium text-black transition-all hover:bg-slate-200 hover:scale-105 text-sm sm:text-base"
                href="/feed"
              >
                <span className="mr-2">Explore assets</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 text-sm sm:text-base"
                href="/wizard"
              >
                List my asset
              </Link>
            </motion.div>

            <div className="pt-6 sm:pt-8">
              <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-400">Trusted by players like</p>
              <Marquee items={proofLogos} speed={30} className="relative z-10" />
            </div>
          </div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative z-10 rounded-3xl border border-white/10 bg-[#0B0D18]/80 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900">
                <Image
                  src="/images/hero-dashboard.webp"
                  alt="CounterX dashboard showing valuation metrics, MRR, and real-time digital assets analysis"
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
                  <p className="text-xs text-slate-400">Offer Received</p>
                  <p className="font-semibold text-white">$450,000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS - TIMELINE */}
      <section id="how-it-works" className="py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="mb-8 md:mb-12 lg:mb-16 text-center">
            <h2 className="mb-3 md:mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">How it works</h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 px-4">
              From signup to exit, we simplify every step of the M&A journey for digital assets.
            </p>
          </div>

          <HowItWorks steps={howItWorks} iconMap={iconMap} />
        </div>
      </section>

      {/* FEATURES - BENTO GRID */}
      <section id="features" className="py-12 md:py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="mb-8 md:mb-12 lg:mb-16 max-w-2xl">
            <h2 className="mb-3 md:mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">Everything you need to negotiate</h2>
            <p className="text-sm sm:text-base text-slate-600">
              Professional M&A tools democratized for the micro-SaaS and digital assets market.
            </p>
          </div>

          <FeatureCards
            features={[
              {
                title: features[0].title,
                description: features[0].description,
                icon: features[0].icon && iconMap[features[0].icon] ? iconMap[features[0].icon] : undefined,
                image: '/images/feature-valuation.webp'
              },
              {
                title: features[1].title,
                description: features[1].description,
                icon: features[1].icon && iconMap[features[1].icon] ? iconMap[features[1].icon] : undefined,
                image: '/images/feature-duediligence.webp'
              },
              {
                title: features[2].title,
                description: features[2].description,
                icon: features[2].icon && iconMap[features[2].icon] ? iconMap[features[2].icon] : undefined,
                image: '/images/feature-dealroom.webp'
              },
              {
                title: features[5].title,
                description: features[5].description,
                icon: features[5].icon && iconMap[features[5].icon] ? iconMap[features[5].icon] : undefined
              }
            ]}
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-12 md:py-16 lg:py-24 bg-white overflow-x-hidden">
        <div className="container mb-8 md:mb-12 text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Who&apos;s already traded</h2>
        </div>
        <div className="relative overflow-x-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-16 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-10 h-full w-16 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-4 sm:gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[280px] sm:w-[320px] md:w-[400px] flex-shrink-0 rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
                <p className="mb-4 sm:mb-6 text-base sm:text-lg text-slate-700 italic">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                    {t.author[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{t.author}</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{t.role} @ {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
        <div className="container px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#050611] px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 text-center text-white">
            <div className="absolute inset-0 opacity-10">
              <GridBackground />
            </div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            <div className="absolute -top-[50%] left-1/2 h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/40 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px] rounded-full bg-purple-500/30 blur-[100px]" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Ready for your next deal?</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 px-2">
                Join over 2,400 investors and founders trading digital assets securely.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                <Link className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-white px-6 sm:px-8 text-base sm:text-lg font-medium text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 w-full sm:w-auto" href="/feed">
                  View opportunities
                </Link>
                <Link className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 text-base sm:text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto" href="/wizard">
                  List asset
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
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 hidden md:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
    >
      <Link
        href="/wizard"
        className="flex items-center gap-2 sm:gap-3 rounded-full bg-[#0044CC] px-4 sm:px-6 py-2.5 sm:py-3 text-white transition-colors hover:bg-[#0033AA] text-sm sm:text-base"
      >
        <span className="font-medium hidden sm:inline">List my asset</span>
        <span className="font-medium sm:hidden">List</span>
        <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20 flex-shrink-0">→</span>
      </Link>
    </motion.div>
  );
}

function StickyNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = ['How it works', 'Features', 'Testimonials'];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-sm backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6">
        <Logo 
          variant={scrolled ? 'black' : 'white'} 
          href="/" 
          width={120} 
          height={28}
          className="transition-opacity"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#9EA3B0] hover:text-[#0044CC]' : 'text-white/80 hover:text-white'
                }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className={`text-sm font-medium ${scrolled ? 'text-slate-900' : 'text-white'
              }`}
          >
            Sign in
          </Link>
          <Link
            href="/auth/register?callbackUrl=/feed"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${scrolled
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
          >
            Get started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <nav className="container px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-900 hover:text-[#0044CC] py-2"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-slate-900 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register?callbackUrl=/feed"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium transition-all hover:bg-slate-800"
                >
                  Get started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
