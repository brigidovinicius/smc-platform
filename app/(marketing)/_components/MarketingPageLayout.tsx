'use client';

import { ReactNode } from 'react';
import { GridBackground } from '@/components/marketing';
import { Footer } from './footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MarketingPageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
}

export function MarketingPageLayout({
  children,
  title,
  description,
  showHero = false
}: MarketingPageLayoutProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
      {/* Sticky Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/80 shadow-sm backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className={scrolled ? 'text-slate-900' : 'text-white'}>SMC</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#como-funciona"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'
              }`}
            >
              Como funciona
            </Link>
            <Link
              href="/#recursos"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'
              }`}
            >
              Recursos
            </Link>
            <Link
              href="/#depoimentos"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'
              }`}
            >
              Depoimentos
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className={`text-sm font-medium ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
              Entrar
            </Link>
            <Link
              href="/auth/register?callbackUrl=/feed"
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                scrolled
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (se showHero = true) */}
      {showHero && (
        <section className="relative min-h-[60vh] overflow-hidden bg-[#050611] text-white">
          <GridBackground />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
          <div className="absolute -top-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" />
          <div className="absolute top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="container relative z-10 py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              {title && (
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xl text-slate-300 leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <main className={showHero ? '' : 'pt-24'}>
        {children}
      </main>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#050611] px-8 py-20 text-center text-white md:px-20">
            <div className="absolute inset-0 opacity-10">
              <GridBackground />
            </div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            <div className="absolute -top-[50%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/40 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/30 blur-[100px]" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold md:text-5xl">Pronto para o próximo deal?</h2>
              <p className="text-xl text-slate-400">
                Junte-se a mais de 2.400 investidores e founders negociando ativos digitais com segurança.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/feed"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-medium text-slate-900 transition-all hover:bg-slate-100 hover:scale-105"
                >
                  Ver oportunidades
                </Link>
                <Link
                  href="/wizard"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
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

