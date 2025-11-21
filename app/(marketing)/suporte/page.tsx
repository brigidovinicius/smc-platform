import Link from 'next/link';
import { Footer } from '../_components/footer';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-3xl space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Suporte</p>
                    <h1 className="text-4xl font-bold text-slate-900">Fale com o time SMC</h1>
                    <p className="text-lg text-slate-600">
                        Precisa de ajuda para acessar o marketplace, enviar documentação ou entender o processo de compra e venda? Estamos disponíveis para te apoiar.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Canais oficiais</h2>
                        <p className="mt-2 text-slate-600">Entraremos em contato em até 1 dia útil.</p>
                        <ul className="mt-4 space-y-2 text-slate-700">
                            <li>
                                <a className="text-[var(--color-primary)] font-medium" href="mailto:support@saasmarketcap.com">
                                    support@saasmarketcap.com
                                </a>
                            </li>
                            <li>
                                <a className="text-[var(--color-primary)] font-medium" href="mailto:legal@saasmarketcap.com">
                                    legal@saasmarketcap.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Autoatendimento</h2>
                        <p className="mt-2 text-slate-600">Documentação e respostas rápidas.</p>
                        <ul className="mt-4 space-y-2 text-[var(--color-primary)] font-medium">
                            <li>
                                <Link href="/faq" className="hover:underline">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal" className="hover:underline">
                                    Central legal
                                </Link>
                            </li>
                            <li>
                                <Link href="/recursos" className="hover:underline">
                                    Recursos
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
