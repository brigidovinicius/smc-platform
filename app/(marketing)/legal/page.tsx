import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/app/(marketing)/_components/footer';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Legal Center | CounterX',
    description: 'Review CounterX policies governing marketplace use, data handling, privacy, terms of use, and cookies. Contact legal@counterx.io for specific cases.',
    url: `${SITE_CONFIG.url}/legal`,
    keywords: ['legal', 'terms', 'privacy policy', 'cookies policy', 'legal documents', 'terms of use'],
    noIndex: false,
  });
}

const docs = [
    {
        title: 'Terms of Use',
        href: '/legal/termos-de-uso',
        summary: 'Rules for platform use, registration, confidentiality, and liability limitations.'
    },
    {
        title: 'Privacy Policy',
        href: '/legal/privacidade',
        summary: 'How we collect, store, and use your personal data within the CounterX Platform.'
    },
    {
        title: 'Cookies',
        href: '/legal/cookies',
        summary: 'Information about session cookies, analytics, and preferences.'
    }
];

export default function LegalHubPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-20">
                <div className="max-w-3xl space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Legal</p>
                    <h1 className="text-4xl font-bold text-slate-900">CounterX Legal Center</h1>
                    <p className="text-lg text-slate-600">
                        Review the policies governing marketplace use, data handling, and cookies. For specific cases, contact{' '}
                        <a className="text-[var(--color-primary)] font-medium" href="mailto:legal@counterx.io">
                            legal@counterx.io
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
                                    Read →
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
