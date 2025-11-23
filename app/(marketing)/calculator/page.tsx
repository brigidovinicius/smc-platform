'use client';

import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export default function CalculatorPage() {
  const [mrr, setMrr] = useState('');
  const [growth, setGrowth] = useState('');
  const [churn, setChurn] = useState('');

  const calculateValuation = () => {
    const mrrValue = parseFloat(mrr) || 0;
    const growthValue = parseFloat(growth) || 0;
    const churnValue = parseFloat(churn) || 0;

    if (mrrValue === 0) return null;

    // Fórmula simplificada de valuation
    const arr = mrrValue * 12;
    let multiple = 3.5; // Múltiplo base

    // Ajustes baseados em crescimento
    if (growthValue > 20) multiple += 0.5;
    if (growthValue > 50) multiple += 0.5;

    // Ajustes baseados em churn
    if (churnValue < 5) multiple += 0.5;
    if (churnValue > 10) multiple -= 0.5;

    const valuation = arr * multiple;

    return {
      arr,
      multiple: multiple.toFixed(1),
      valuation: valuation.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0
      })
    };
  };

  const result = calculateValuation();

  return (
    <MarketingPageLayout
      title="Calculadora de Valuation"
      description="Descubra quanto vale o seu SaaS em poucos minutos com nossa calculadora inteligente"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Informe suas métricas</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        MRR (Receita Recorrente Mensal)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          value={mrr}
                          onChange={(e) => setMrr(e.target.value)}
                          placeholder="Ex: 10000"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Crescimento Mensal (%)
                      </label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          value={growth}
                          onChange={(e) => setGrowth(e.target.value)}
                          placeholder="Ex: 15"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Churn Rate Mensal (%)
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          value={churn}
                          onChange={(e) => setChurn(e.target.value)}
                          placeholder="Ex: 5"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Result */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                      <Calculator size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Valuation Estimado</h2>
                  </div>

                  {result ? (
                    <div className="space-y-6">
                      <div className="bg-white/80 rounded-xl p-6 border border-indigo-100">
                        <p className="text-sm text-slate-600 mb-2">ARR</p>
                        <p className="text-3xl font-bold text-slate-900">
                          {result.arr.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0
                          })}
                        </p>
                      </div>

                      <div className="bg-white/80 rounded-xl p-6 border border-indigo-100">
                        <p className="text-sm text-slate-600 mb-2">Múltiplo Aplicado</p>
                        <p className="text-3xl font-bold text-indigo-600">{result.multiple}x</p>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                        <p className="text-sm text-white/80 mb-2">Valuation Estimado</p>
                        <p className="text-4xl font-bold">{result.valuation}</p>
                      </div>

                      <p className="text-xs text-slate-500 text-center">
                        * Esta é uma estimativa baseada em múltiplos de mercado. Para uma avaliação completa, cadastre seu ativo na plataforma.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500">Preencha os campos ao lado para calcular</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
