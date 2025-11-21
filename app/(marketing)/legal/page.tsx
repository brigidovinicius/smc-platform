import Link from 'next/link';
import { Footer } from '../_components/footer';

const docs = [
    {
        title: 'Termos de uso',
        href: '/legal/termos-de-uso',
        summary: 'Regras para uso da plataforma, cadastro, confidencialidade e limitações de responsabilidade.'
    },
    {
        title: 'Política de privacidade',
        href: '/legal/privacidade',
        summary: 'Como coletamos, armazenamos e utilizamos seus dados pessoais dentro da SMC Platform.'
    },
    {
        title: 'Cookies',
        href: '/legal/cookies',
        summary: 'Informações sobre cookies de sessão, analytics e preferências.'
    }
];

export default function LegalHubPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-3xl space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Legal</p>
                    <h1 className="text-4xl font-bold text-slate-900">Central legal da SMC</h1>
                    <p className="text-lg text-slate-600">
                        Consulte as políticas que regem o uso do marketplace, tratamento de dados e cookies. Para casos específicos, fale com{' '}
                        <a className="text-[var(--color-primary)] font-medium" href="mailto:legal@saasmarketcap.com">
                            legal@saasmarketcap.com
                        </a>
                        .
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {docs.map((doc) => (
                        <Link
                            key={doc.href}
                            href={doc.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-900">{doc.title}</h2>
                                <span className="text-sm font-medium text-[var(--color-primary)] transition group-hover:translate-x-1">
                                    Ler →
                                </span>
                            </div>
                            <p className="mt-2 text-slate-600">{doc.summary}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
