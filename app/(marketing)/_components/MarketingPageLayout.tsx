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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = [
    { label: 'Como funciona', href: '/#como-funciona' },
    { label: 'Recursos', href: '/#recursos' },
    { label: 'Depoimentos', href: '/#depoimentos' }
  ];

  return (
    <div className="relative overflow-hidden bg-[#FAFAFA] min-h-screen">
      {/* Sticky Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/80 shadow-sm backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold">
            <span className={scrolled ? 'text-slate-900' : 'text-white'}>SMC</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-900 hover:text-indigo-600 py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-900 py-2"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register?callbackUrl=/feed"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium transition-all hover:bg-slate-800"
                  >
                    Começar
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section (se showHero = true) */}
      {showHero && (
        <section className="relative min-h-[50vh] sm:min-h-[60vh] overflow-hidden bg-[#050611] text-white">
          <GridBackground />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
          <div className="absolute -top-[20%] -left-[10%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] md:h-[800px] md:w-[800px] rounded-full bg-purple-500/30 blur-[120px] animate-pulse" />
          <div className="absolute top-[10%] -right-[10%] h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] md:h-[600px] md:w-[600px] rounded-full bg-blue-500/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="container relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              {title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Pronto para o próximo deal?</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 px-2">
                Junte-se a mais de 2.400 investidores e founders negociando ativos digitais com segurança.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                <Link
                  href="/feed"
                  className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-white px-6 sm:px-8 text-base sm:text-lg font-medium text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 w-full sm:w-auto"
                >
                  Ver oportunidades
                </Link>
                <Link
                  href="/wizard"
                  className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 text-base sm:text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto"
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


