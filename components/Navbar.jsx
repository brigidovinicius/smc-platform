'use client';

import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@/lib/i18n/context';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <Logo variant="primary" href="/" className="navbar-logo" width={120} height={28} />
        <nav className="navbar-links" role="navigation" aria-label={t('nav.home')}>
          <Link href="/feed" aria-label={t('nav.listings')}>{t('nav.listings')}</Link>
          <Link href="/dashboard" aria-label={t('nav.dashboard')}>{t('nav.dashboard')}</Link>
          <Link href="/wizard" aria-label={t('nav.newAsset')}>{t('nav.newAsset')}</Link>
          <Link href="/profile" aria-label={t('nav.profile')}>{t('nav.profile')}</Link>
        </nav>
      </div>

      <div className="navbar-right">
        <LanguageSwitcher className="hidden md:flex" />
        {status === 'loading' && (
          <span className="navbar-text" aria-live="polite" aria-label={t('common.loading')}>
            {t('common.loading')}
          </span>
        )}

        {status === 'unauthenticated' && (
          <button 
            className="button primary" 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            aria-label={t('auth.signInWithGoogle')}
          >
            {t('auth.signIn')}
          </button>
        )}

        {status === 'authenticated' && session?.user && (
          <div className="navbar-user" role="group" aria-label="User information">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={`Avatar of ${session.user.name || 'user'}`}
                className="navbar-avatar"
                width={40}
                height={40}
                style={{ borderRadius: '9999px', objectFit: 'cover' }}
                priority
                aria-hidden="false"
              />
            )}
            <div className="navbar-user-info" aria-label={`User: ${session.user.name}, Email: ${session.user.email}`}>
              <span className="navbar-user-name">{session.user.name}</span>
              <span className="navbar-user-email">{session.user.email}</span>
            </div>
            <button 
              className="button ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              aria-label={t('auth.signOut')}
            >
              {t('auth.signOut')}
            </button>
          </div>
        )}
        <LanguageSwitcher className="md:hidden mt-2" variant="ghost" />
      </div>
    </header>
  );
}
