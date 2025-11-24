import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
    return (
        <footer className="border-t border-[#9EA3B0]/20 bg-white pt-16 pb-8">
            <div className="container">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="space-y-4">
                        <Logo variant="black" href="/" width={140} height={32} />
                        <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">
                            The definitive platform to evaluate, buy, and sell digital assets with audited data and legal security.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders */}
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                            <div className="h-8 w-8 rounded-full bg-slate-100" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Platform</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/" className="hover:text-[var(--color-primary)]">Home</Link></li>
                            <li><Link href="/feed" className="hover:text-[var(--color-primary)]">Feed</Link></li>
                            <li><Link href="/wizard" className="hover:text-[var(--color-primary)]">List asset</Link></li>
                            <li><Link href="/pricing" className="hover:text-[var(--color-primary)]">Pricing</Link></li>
                            <li><Link href="/auth/login" className="hover:text-[var(--color-primary)]">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Resources</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/recursos" className="hover:text-[var(--color-primary)]">Resources</Link></li>
                            <li><Link href="/blog" className="hover:text-[var(--color-primary)]">Blog</Link></li>
                            <li><Link href="/calculator" className="hover:text-[var(--color-primary)]">Valuation Calculator</Link></li>
                            <li><Link href="/faq" className="hover:text-[var(--color-primary)]">FAQ</Link></li>
                            <li><Link href="/suporte" className="hover:text-[var(--color-primary)]">Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-[var(--color-text)]">Legal</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li><Link href="/legal" className="hover:text-[var(--color-primary)]">Legal center</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-[var(--color-primary)]">Terms of Use</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-[var(--color-primary)]">Privacy</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-[var(--color-primary)]">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-text-secondary)] md:flex-row">
                    <p>© {new Date().getFullYear()} CounterX.io. All rights reserved.</p>
                    <p>Made with 💜 for founders.</p>
                </div>
            </div>
        </footer>
    );
}
