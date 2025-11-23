'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';
import { cn } from '@/lib/utils';

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  title?: string;
  description?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  stats?: HeroStat[];
  image?: string;
  imageAlt?: string;
  className?: string;
}

export function Hero({
  title = 'Compre e venda ativos digitais com confiança',
  description = 'Marketplace profissional para SaaS, newsletters e ativos digitais. Valuation automático, due diligence assistida e transações seguras.',
  ctaPrimary = { label: 'Começar Grátis', href: '/auth/register' },
  ctaSecondary = { label: 'Ver Oportunidades', href: '/feed' },
  stats,
  image,
  imageAlt = 'Hero image',
  className
}: HeroProps) {
  return (
    <section className={cn('relative overflow-hidden py-24 md:py-32', className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
      
      {/* Sparkles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10">
        <div className={cn('mx-auto', image ? 'grid gap-12 lg:grid-cols-2 lg:items-center' : 'max-w-4xl text-center')}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Marketplace profissional de ativos digitais
            </span>
          </motion.div>

          <div className={cn('space-y-8', image && 'lg:pr-8')}>
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                'font-bold tracking-tight text-slate-900',
                image 
                  ? 'text-4xl md:text-5xl lg:text-6xl text-left'
                  : 'mb-6 text-5xl md:text-6xl lg:text-7xl'
              )}
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'text-slate-600',
                image
                  ? 'text-lg md:text-xl text-left'
                  : 'mb-10 text-xl md:text-2xl'
              )}
            >
              {description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                'flex gap-4',
                image ? 'justify-start' : 'flex-col items-center justify-center sm:flex-row'
              )}
            >
              <Button asChild size="lg" className="group">
                <Link href={ctaPrimary.href}>
                  {ctaPrimary.label}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={cn(
                  'grid gap-8 border-t border-slate-200 pt-12',
                  image ? 'grid-cols-2' : 'mt-16 grid-cols-2 md:grid-cols-4'
                )}
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl border border-white/10 bg-white/80 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

