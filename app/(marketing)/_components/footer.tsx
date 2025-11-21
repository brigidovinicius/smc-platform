import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-[var(--color-border)] bg-white pt-16 pb-8">
            <div className="container">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="space-y-4">
                        <Link href="/" className="font-heading text-xl font-semibold text-[var(--color-text)]">
                            <span className="text-[var(--color-primary)]">SMC</span> Market Cap
                        </Link>
                        <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">
                            A plataforma definitiva para avaliar, comprar e vender ativos digitais com dados auditados e segurança jurídica.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders */}
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Plataforma</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/" className="hover:text-[var(--color-primary)]">Home</Link></li>
                            <li><Link href="/marketplace" className="hover:text-[var(--color-primary)]">Marketplace</Link></li>
                            <li><Link href="/vender-ativo" className="hover:text-[var(--color-primary)]">Vender ativo</Link></li>
                            <li><Link href="/precos" className="hover:text-[var(--color-primary)]">Preços</Link></li>
                            <li><Link href="/login" className="hover:text-[var(--color-primary)]">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Recursos</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/recursos" className="hover:text-[var(--color-primary)]">Recursos</Link></li>
                            <li><Link href="/blog" className="hover:text-[var(--color-primary)]">Blog</Link></li>
                            <li><Link href="/calculadora-valuation" className="hover:text-[var(--color-primary)]">Calculadora de Valuation</Link></li>
                            <li><Link href="/faq" className="hover:text-[var(--color-primary)]">FAQ</Link></li>
                            <li><Link href="/suporte" className="hover:text-[var(--color-primary)]">Suporte</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Legal</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/legal" className="hover:text-[var(--color-primary)]">Central legal</Link></li>
                            <li><Link href="/legal/termos-de-uso" className="hover:text-[var(--color-primary)]">Termos de Uso</Link></li>
                            <li><Link href="/legal/privacidade" className="hover:text-[var(--color-primary)]">Privacidade</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-[var(--color-primary)]">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-text-secondary)] md:flex-row">
                    <p>© {new Date().getFullYear()} SaaS Market Cap. Todos os direitos reservados.</p>
                    <p>Feito com 💜 para founders.</p>
                </div>
            </div>
        </footer>
    );
}
