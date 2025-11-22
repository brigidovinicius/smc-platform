'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '../_components/footer';
import { Check, X } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: 'Grátis',
        description: 'Para explorar o marketplace e conhecer a plataforma',
        features: [
            'Acesso ao feed público de ofertas',
            'Visualização de memorandos básicos',
            'Calculadora de valuation',
            'Acesso ao blog e recursos',
            'Suporte via email'
        ],
        limitations: [
            'Sem acesso a data-room completo',
            'Sem criação de ofertas',
            'Sem dashboard de métricas',
            'Sem suporte prioritário'
        ],
        cta: 'Começar grátis',
        ctaHref: '/auth/register',
        popular: false
    },
    {
        name: 'Founder',
        price: 'R$ 297',
        period: '/mês',
        description: 'Para founders que querem vender seus ativos',
        features: [
            'Tudo do plano Free',
            'Criação ilimitada de ofertas',
            'Valuation automático completo',
            'Dashboard de métricas e readiness',
            'Deal-room com blur e NDA digital',
            'Acesso a compradores verificados',
            'Suporte prioritário',
            'Relatórios exportáveis (PDF, Excel)',
            'Checklist de due diligence'
        ],
        limitations: [],
        cta: 'Começar agora',
        ctaHref: '/auth/register?plan=founder',
        popular: true
    },
    {
        name: 'Investor',
        price: 'R$ 497',
        period: '/mês',
        description: 'Para investidores e compradores ativos',
        features: [
            'Tudo do plano Founder',
            'Acesso completo a data-rooms',
            'Filtros avançados e alertas',
            'Comparação lado a lado de ofertas',
            'Histórico de métricas e cohort',
            'Acesso a memorandos completos',
            'Suporte dedicado',
            'API para integração',
            'Relatórios customizados'
        ],
        limitations: [],
        cta: 'Falar com vendas',
        ctaHref: '/suporte',
        popular: false
    }
];

const comparisonFeatures = [
    {
        category: 'Acesso',
        features: [
            { name: 'Feed público de ofertas', free: true, founder: true, investor: true },
            { name: 'Memorandos básicos', free: true, founder: true, investor: true },
            { name: 'Memorandos completos', free: false, founder: true, investor: true },
            { name: 'Data-room completo', free: false, founder: true, investor: true }
        ]
    },
    {
        category: 'Criação e Gestão',
        features: [
            { name: 'Criar ofertas', free: false, founder: true, investor: true },
            { name: 'Valuation automático', free: false, founder: true, investor: true },
            { name: 'Dashboard de métricas', free: false, founder: true, investor: true },
            { name: 'Deal-room com blur/NDA', free: false, founder: true, investor: true }
        ]
    },
    {
        category: 'Análise',
        features: [
            { name: 'Filtros básicos', free: true, founder: true, investor: true },
            { name: 'Filtros avançados', free: false, founder: false, investor: true },
            { name: 'Comparação de ofertas', free: false, founder: false, investor: true },
            { name: 'Histórico de métricas', free: false, founder: false, investor: true }
        ]
    },
    {
        category: 'Suporte',
        features: [
            { name: 'Email', free: true, founder: true, investor: true },
            { name: 'Suporte prioritário', free: false, founder: true, investor: true },
            { name: 'Suporte dedicado', free: false, founder: false, investor: true },
            { name: 'API e integrações', free: false, founder: false, investor: true }
        ]
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Planos</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Planos flexíveis para todos os perfis
                    </h1>
                    <p className="text-xl text-slate-600">
                        Escolha o plano ideal para sua jornada de compra ou venda de ativos digitais.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid gap-8 md:grid-cols-3 mb-20">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl border-2 p-8 bg-white shadow-sm transition hover:shadow-lg ${
                                plan.popular
                                    ? 'border-indigo-500 shadow-indigo-100 scale-105'
                                    : 'border-slate-200'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Mais Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-slate-500 text-lg">{plan.period}</span>
                                    )}
                                </div>
                                <p className="text-slate-600">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                                {plan.limitations.map((limitation, idx) => (
                                    <li key={idx} className="flex items-start gap-3 opacity-60">
                                        <X className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-500 line-through">{limitation}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.ctaHref}
                                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition ${
                                    plan.popular
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Comparação detalhada de recursos
                    </h2>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="text-left p-6 font-semibold text-slate-900">Recurso</th>
                                        <th className="text-center p-6 font-semibold text-slate-900">Free</th>
                                        <th className="text-center p-6 font-semibold text-slate-900">Founder</th>
                                        <th className="text-center p-6 font-semibold text-slate-900">Investor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonFeatures.map((category, catIdx) => (
                                        <React.Fragment key={catIdx}>
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="p-4 bg-slate-100 font-semibold text-slate-900"
                                                >
                                                    {category.category}
                                                </td>
                                            </tr>
                                            {category.features.map((feature, featIdx) => (
                                                <tr
                                                    key={featIdx}
                                                    className="border-b border-slate-100 hover:bg-slate-50"
                                                >
                                                    <td className="p-6 text-slate-700">{feature.name}</td>
                                                    <td className="p-6 text-center">
                                                        {feature.free ? (
                                                            <Check className="h-5 w-5 text-indigo-500 mx-auto" />
                                                        ) : (
                                                            <X className="h-5 w-5 text-slate-300 mx-auto" />
                                                        )}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {feature.founder ? (
                                                            <Check className="h-5 w-5 text-indigo-500 mx-auto" />
                                                        ) : (
                                                            <X className="h-5 w-5 text-slate-300 mx-auto" />
                                                        )}
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {feature.investor ? (
                                                            <Check className="h-5 w-5 text-indigo-500 mx-auto" />
                                                        ) : (
                                                            <X className="h-5 w-5 text-slate-300 mx-auto" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Perguntas frequentes sobre planos
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Posso mudar de plano a qualquer momento?
                            </h3>
                            <p className="text-slate-600">
                                Sim. Você pode fazer upgrade ou downgrade a qualquer momento. As mudanças são aplicadas
                                imediatamente e valores proporcionais são ajustados.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Existe comissão sobre vendas além da mensalidade?
                            </h3>
                            <p className="text-slate-600">
                                Sim. Além da mensalidade, aplicamos uma success fee escalonada quando você fecha uma
                                venda através da plataforma. O valor varia conforme o ticket da transação.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                O plano Free tem limitações de uso?
                            </h3>
                            <p className="text-slate-600">
                                O plano Free permite explorar o marketplace e visualizar ofertas públicas. Para criar
                                ofertas ou acessar data-rooms completos, é necessário fazer upgrade.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Há desconto para pagamento anual?
                            </h3>
                            <p className="text-slate-600">
                                Sim. Oferecemos 20% de desconto para pagamentos anuais. Entre em contato com nosso
                                time de vendas para mais informações.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-12 border border-indigo-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Ainda tem dúvidas sobre qual plano escolher?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Nossa equipe está pronta para ajudar você a encontrar o plano ideal para suas necessidades.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/suporte"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            Falar com vendas
                        </Link>
                        <Link
                            href="/faq"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition"
                        >
                            Ver FAQ completo
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
