'use client';

import { ReactNode } from 'react';
import { GridBackground } from '@/components/marketing';
import { Footer } from './footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
  const { t } = useTranslation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = [
    { label: t('marketing.nav.howItWorks'), href: '/#how-it-works' },
    { label: t('marketing.nav.features'), href: '/#features' },
    { label: t('marketing.nav.testimonials'), href: '/#testimonials' }
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
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-slate-600 hover:text-[#0044CC]' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher className="text-white" variant="ghost" />
            <Link
              href="/auth/login"
              className={`text-sm font-medium ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
            {t('marketing.cta.signIn')}
            </Link>
            <Link
              href="/auth/register?callbackUrl=/feed"
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                scrolled
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
            {t('marketing.cta.getStarted')}
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
                    className="block text-sm font-medium text-slate-900 hover:text-[#0044CC] py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              <LanguageSwitcher className="pt-2" />
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-900 py-2"
                  >
                  {t('marketing.cta.signIn')}
                  </Link>
                  <Link
                    href="/auth/register?callbackUrl=/feed"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium transition-all hover:bg-slate-800"
                  >
                  {t('marketing.cta.getStarted')}
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
          <div className="absolute top-[10%] -right-[10%] h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] md:h-[600px] md:w-[600px] rounded-full bg-blue-500/30 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="container relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              {title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
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

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Ready for your next deal?</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 px-2">
                Join over 2,400 investors and founders trading digital assets securely.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                <Link
                  href="/feed"
                  className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-white px-6 sm:px-8 text-base sm:text-lg font-medium text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 w-full sm:w-auto"
                >
                  View opportunities
                </Link>
                <Link
                  href="/wizard"
                  className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 text-base sm:text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto"
                >
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


