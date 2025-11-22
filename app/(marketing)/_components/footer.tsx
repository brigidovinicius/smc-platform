import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white pt-20 pb-12">
            <div className="container">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="space-y-6">
                        <Link href="/" className="font-heading text-2xl font-bold text-slate-900">
                            <span className="text-indigo-600">SMC</span> Market Cap
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                            A plataforma definitiva para avaliar, comprar e vender ativos digitais com dados auditados e segurança jurídica.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders with hover effects */}
                            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 transition-colors hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer" />
                            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 transition-colors hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer" />
                            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 transition-colors hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-900">Plataforma</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link href="/" className="transition-colors hover:text-indigo-600">Home</Link></li>
                            <li><Link href="/marketplace" className="transition-colors hover:text-indigo-600">Marketplace</Link></li>
                            <li><Link href="/vender-ativo" className="transition-colors hover:text-indigo-600">Vender ativo</Link></li>
                            <li><Link href="/planos" className="transition-colors hover:text-indigo-600">Planos</Link></li>
                            <li><Link href="/login" className="transition-colors hover:text-indigo-600">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-900">Recursos</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link href="/recursos" className="transition-colors hover:text-indigo-600">Recursos</Link></li>
                            <li><Link href="/blog" className="transition-colors hover:text-indigo-600">Blog</Link></li>
                            <li><Link href="/calculadora-valuation" className="transition-colors hover:text-indigo-600">Calculadora de Valuation</Link></li>
                            <li><Link href="/faq" className="transition-colors hover:text-indigo-600">FAQ</Link></li>
                            <li><Link href="/suporte" className="transition-colors hover:text-indigo-600">Suporte</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-slate-900">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link href="/legal" className="transition-colors hover:text-indigo-600">Central legal</Link></li>
                            <li><Link href="/legal/termos-de-uso" className="transition-colors hover:text-indigo-600">Termos de Uso</Link></li>
                            <li><Link href="/legal/privacidade" className="transition-colors hover:text-indigo-600">Privacidade</Link></li>
                            <li><Link href="/legal/cookies" className="transition-colors hover:text-indigo-600">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 text-sm text-slate-400 md:flex-row">
                    <p>© {new Date().getFullYear()} SaaS Market Cap. Todos os direitos reservados.</p>
                    <p className="flex items-center gap-1">
                        Feito com <span className="text-red-500">♥</span> para founders.
                    </p>
                </div>
            </div>
        </footer>
    );
}
