'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  image?: string;
  gradient?: string;
}

interface FeatureCardsProps {
  features: Feature[];
  className?: string;
}

export function FeatureCards({ features, className = '' }: FeatureCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`grid gap-4 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px] ${className}`}
    >
      {/* Large Item 1 - Valuation */}
      <motion.div
        variants={itemVariants}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 md:col-span-2 border border-blue-100"
      >
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center h-full">
          <div>
            {features[0]?.icon && (() => {
              const Icon = features[0].icon!;
              return (
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                  <Icon size={28} />
                </div>
              );
            })()}
            <h3 className="mb-3 text-2xl font-bold text-slate-900">{features[0]?.title}</h3>
            <p className="text-slate-600 text-base leading-relaxed">{features[0]?.description}</p>
          </div>
          {features[0]?.image && (
            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-white/50 shadow-inner">
              <Image
                src={features[0].image}
                alt={features[0].title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* Tall Item - Deal Room */}
      <motion.div
        variants={itemVariants}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 md:row-span-2 border border-purple-100"
      >
        <div className="relative z-10 h-full flex flex-col">
          {features[2]?.icon && (() => {
            const Icon = features[2].icon!;
            return (
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-500/30">
                <Icon size={28} />
              </div>
            );
          })()}
          <h3 className="mb-3 text-xl font-bold text-slate-900">{features[2]?.title}</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">{features[2]?.description}</p>

          {features[2]?.image && (
            <div className="relative flex-1 min-h-[200px] w-full overflow-hidden rounded-xl bg-white/50 shadow-inner mb-4">
              <Image
                src={features[2].image}
                alt={features[2].title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}

          <div className="mt-auto rounded-xl bg-white/80 border border-purple-100 p-4 group-hover:border-purple-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-xs font-medium text-slate-600">Deal Room Ativo</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-purple-100" />
              <div className="h-2 w-3/4 rounded-full bg-purple-100" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* Small Item 1 - Due Diligence */}
      <motion.div
        variants={itemVariants}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 border border-indigo-100"
      >
        <div className="flex flex-col h-full">
          {features[1]?.icon && (() => {
            const Icon = features[1].icon!;
            return (
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                <Icon size={28} />
              </div>
            );
          })()}
          <h3 className="mb-3 text-lg font-bold text-slate-900">{features[1]?.title}</h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{features[1]?.description}</p>
          {features[1]?.image && (
            <div className="relative h-32 w-full mt-auto overflow-hidden rounded-xl bg-white/50 shadow-inner">
              <Image
                src={features[1].image}
                alt={features[1].title}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* Small Item 2 - Insights */}
      <motion.div
        variants={itemVariants}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 border border-pink-100"
      >
        {features[5]?.icon && (() => {
          const Icon = features[5].icon!;
          return (
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500 text-white shadow-lg shadow-pink-500/30">
              <Icon size={28} />
            </div>
          );
        })()}
        <h3 className="mb-3 text-lg font-bold text-slate-900">{features[5]?.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{features[5]?.description}</p>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}
