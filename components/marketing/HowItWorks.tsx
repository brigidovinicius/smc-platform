'use client';

import { motion } from 'framer-motion';
import { LucideIcon, CheckCircle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  highlight?: string;
  icon?: string;
}

interface HowItWorksProps {
  steps: Step[];
  iconMap?: Record<string, LucideIcon>;
  className?: string;
}

export function HowItWorks({ steps, iconMap = {}, className = '' }: HowItWorksProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`relative ${className}`}
    >
      {/* Vertical Line - Desktop */}
      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 hidden md:block" />

      <div className="space-y-12 md:space-y-24">
        {steps.map((step, index) => {
          const Icon = step.icon && iconMap[step.icon] ? iconMap[step.icon] : CheckCircle;
          const isEven = index % 2 === 1;

          return (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className={`flex flex-col gap-8 md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center`}
            >
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30 mb-4 md:hidden">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-2xl md:text-3xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed max-w-xl">{step.description}</p>
              </div>

              {/* Number Circle - Desktop */}
              <div className="relative flex items-center justify-center md:w-24">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
                  className="hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl font-bold text-white shadow-xl shadow-indigo-500/40 md:flex z-10 ring-4 ring-white"
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Icon Card */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100 p-8 flex items-center justify-center group hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
