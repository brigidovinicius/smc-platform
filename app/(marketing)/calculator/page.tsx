import Link from 'next/link';
import { Footer } from '../_components/footer';
import { Calculator, Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function CalculatorPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Calculadora</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Calculadora de Valuation
                        </h1>
                        <p className="text-xl text-slate-600">
                            Descubra quanto vale o seu SaaS em poucos minutos usando nossa metodologia proprietária.
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-12 mb-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
                                <Calculator className="h-10 w-10 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Calculadora em desenvolvimento
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Estamos trabalhando em uma calculadora interativa que permitirá estimar o valuation do
                                seu SaaS baseado em métricas como MRR, churn, CAC, LTV e crescimento.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-6 rounded-xl bg-slate-50">
                                <Sparkles className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-2">Valuation Automático</h3>
                                <p className="text-sm text-slate-600">
                                    Cálculo baseado em múltiplos de mercado e comparáveis recentes
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-slate-50">
                                <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-2">Métricas em Tempo Real</h3>
                                <p className="text-sm text-slate-600">
                                    Análise de MRR, churn, CAC, LTV e outros indicadores chave
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-slate-50">
                                <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-2">Resultado Instantâneo</h3>
                                <p className="text-sm text-slate-600">
                                    Receba uma estimativa de valuation em segundos
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                            <p className="text-sm text-slate-700 mb-4">
                                <strong>Enquanto isso:</strong> Você pode usar nossa plataforma completa para obter um
                                valuation detalhado e profissional do seu ativo.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/vender-ativo"
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-center"
                                >
                                    Cadastrar meu ativo
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition text-center"
                                >
                                    Ver planos
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Preview */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                            Como funcionará a calculadora
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-2">Insira suas métricas</h3>
                                        <p className="text-slate-600">
                                            Informe MRR atual, taxa de churn, CAC, LTV, crescimento mensal e outras
                                            métricas relevantes do seu SaaS.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-2">Análise automática</h3>
                                        <p className="text-slate-600">
                                            Nosso algoritmo compara seus dados com transações recentes do mercado e
                                            aplica múltiplos ajustados por setor e risco.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-2">Receba o resultado</h3>
                                        <p className="text-slate-600">
                                            Obtenha uma faixa de valuation estimada com justificativa detalhada e
                                            recomendações para melhorar seu múltiplo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-12 border border-indigo-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Quer ser notificado quando a calculadora estiver pronta?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Envie um email para{' '}
                            <a
                                href="mailto:support@saasmarketcap.com?subject=Notificação Calculadora"
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                support@saasmarketcap.com
                            </a>{' '}
                            e te avisaremos assim que lançarmos.
                        </p>
                        <Link
                            href="/suporte"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                        >
                            Entrar em contato
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
