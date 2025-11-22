'use client';

import { useState } from 'react';
import { Footer } from '../_components/footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
    {
        question: 'Como o valuation automático é calculado?',
        answer:
            'Usamos múltiplos baseados em transações recentes, ajustados por MRR, churn, CAC, LTV, crescimento e risco setorial. Cada input gera um relatório com justificativa do múltiplo sugerido.'
    },
    {
        question: 'Posso cadastrar ativos que ainda não geram receita recorrente?',
        answer:
            'Sim. Para ativos em estágio inicial consideramos GMV, usuários ativos, leads e provas de tração. Você recebe orientações claras sobre o que precisa evoluir antes de abrir negociação.'
    },
    {
        question: 'Como os compradores são verificados?',
        answer:
            'Aplicamos KYC, pedimos prova de fundos e histórico de operações. Só liberamos acesso completo aos dados após acordo de confidencialidade e aceite dos termos da plataforma.'
    },
    {
        question: 'Existe comissão sobre a venda?',
        answer:
            'Trabalhamos com success fee escalonado conforme o tamanho da transação. Não há custo para listar ativos; você só paga quando fecha negócio dentro do SMC.'
    },
    {
        question: 'Consigo negociar em sigilo?',
        answer:
            'Sim. Você controla quem acessa o data-room, habilita blur automático e pode assinar NDA digital antes de revelar informações críticas.'
    },
    {
        question: 'Quais mercados e modelos o SMC cobre?',
        answer:
            'SaaS B2B/B2C, apps mobile, marketplaces, newsletters pagas, APIs e plataformas de conteúdo digital. Expandimos os filtros constantemente.'
    },
    {
        question: 'Como funciona o pagamento após o closing?',
        answer:
            'Trabalhamos com instrumentos de escrow e parceiros jurídicos para custodiar o valor até que as transferências de ativos sejam confirmadas.'
    },
    {
        question: 'Posso listar vários ativos ao mesmo tempo?',
        answer:
            'Pode. Cada ativo recebe um dossiê independente e tem indicadores próprios. Operamos com limites apenas para garantir qualidade do inventário.'
    },
    {
        question: 'O SMC fornece suporte jurídico ou contábil?',
        answer:
            'Temos parceiros especializados e templates prontos para contratos de compra e venda, reorganização societária e transferência de IP.'
    },
    {
        question: 'Qual o prazo médio para fechar uma venda?',
        answer:
            'A média atual é de 34 dias, mas depende do ticket, da qualidade dos dados e da velocidade de resposta entre as partes.'
    },
    {
        question: 'É seguro conectar minhas métricas?',
        answer:
            'Sim, utilizamos criptografia de ponta a ponta e acesso apenas de leitura às suas contas Stripe/Paddle. Você mantém controle total sobre seus dados.'
    },
    {
        question: 'Como funciona a avaliação?',
        answer:
            'Nossa metodologia utiliza múltiplos de mercado baseados em receita recorrente (MRR/ARR), churn, CAC, LTV e crescimento. O sistema compara seu ativo com transações similares recentes para sugerir uma faixa de valuation.'
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">FAQ</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Perguntas Frequentes
                        </h1>
                        <p className="text-xl text-slate-600">
                            Tire suas dúvidas sobre o SaaS Market Cap e como funciona nossa plataforma.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition"
                                >
                                    <h3 className="text-lg font-semibold text-slate-900 pr-8">{item.question}</h3>
                                    {openIndex === index ? (
                                        <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-12 border border-indigo-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ainda tem dúvidas?</h2>
                        <p className="text-slate-600 mb-6">
                            Nossa equipe está pronta para ajudar. Entre em contato e responderemos em até 1 dia útil.
                        </p>
                        <a
                            href="mailto:support@saasmarketcap.com"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            Falar com suporte
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
