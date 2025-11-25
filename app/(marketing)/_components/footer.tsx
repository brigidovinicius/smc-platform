'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();

  const platformLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/feed', label: t('nav.listings') },
    { href: '/wizard', label: t('nav.newAsset') },
    { href: '/pricing', label: t('nav.pricing') },
    { href: '/auth/login', label: t('nav.login') }
  ];

  const resourceLinks = [
    { href: '/resources', label: t('marketing.footer.resources') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/calculator', label: 'Valuation Calculator' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: t('nav.support') }
  ];

  const legalLinks = [
    { href: '/legal', label: t('marketing.footer.legalCenter') },
    { href: '/legal/terms', label: t('marketing.footer.terms') },
    { href: '/legal/privacy', label: t('marketing.footer.privacy') },
    { href: '/legal/cookies', label: t('marketing.footer.cookies') }
  ];

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-white)] pt-16 pb-8">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo variant="black" href="/" width={140} height={32} />
            <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">
              {t('marketing.footer.description')}
            </p>
            <div className="flex gap-4 pt-2">
              <div className="h-8 w-8 rounded-full bg-slate-100" aria-hidden />
              <div className="h-8 w-8 rounded-full bg-slate-100" aria-hidden />
              <div className="h-8 w-8 rounded-full bg-slate-100" aria-hidden />
            </div>
          </div>

          <FooterColumn title={t('marketing.footer.platform')} links={platformLinks} />
          <FooterColumn title={t('marketing.footer.resources')} links={resourceLinks} />
          <FooterColumn title={t('marketing.footer.legal')} links={legalLinks} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-text-secondary)] md:flex-row">
          <p suppressHydrationWarning>© {new Date().getFullYear()} CounterX.io. All rights reserved.</p>
          <p suppressHydrationWarning>{t('common.madeWithLove')}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-[var(--color-text)]">{title}</h4>
      <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-[var(--color-primary)]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
