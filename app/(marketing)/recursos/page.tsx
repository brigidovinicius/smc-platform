import Link from 'next/link';
import { Footer } from '../_components/footer';

const resources = [
    {
        title: 'Blog',
        description: 'Artigos editoriais sobre valuation, aquisição de SaaS e operações de M&A digital.',
        href: '/blog'
    },
    {
        title: 'Marketplace',
        description: 'Prévia das oportunidades públicas com filtros por ticket, nicho e múltiplo.',
        href: '/marketplace'
    },
    {
        title: 'Calculadora de Valuation',
        description: 'Projete o valor do seu SaaS rapidamente com parâmetros de MRR e crescimento.',
        href: '/calculadora-valuation'
    },
    {
        title: 'FAQ',
        description: 'Perguntas frequentes sobre como comprar, vender e avaliar ativos digitais.',
        href: '/faq'
    },
    {
        title: 'Vender ativo',
        description: 'Cadastre seu SaaS, marketplace ou newsletter para captação de compradores qualificados.',
        href: '/vender-ativo'
    },
    {
        title: 'Suporte',
        description: 'Fale com o time SMC sobre due diligence, onboarding e questões da plataforma.',
        href: '/suporte'
    }
];

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-3xl space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recursos</p>
                    <h1 className="text-4xl font-bold text-slate-900">Explore os recursos da SMC Platform</h1>
                    <p className="text-lg text-slate-600">
                        Conteúdo, ferramentas e canais para te ajudar a comprar ou vender ativos digitais com segurança jurídica e dados auditados.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {resources.map((resource) => (
                        <Link
                            key={resource.href}
                            href={resource.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-900">{resource.title}</h2>
                                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:translate-x-1 transition">
                                    Abrir →
                                </span>
                            </div>
                            <p className="mt-3 text-slate-600">{resource.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
