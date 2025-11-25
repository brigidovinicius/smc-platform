'use client';

import { TranslationProvider } from '@/lib/i18n/context';
import type { ReactNode } from 'react';

type Props = {
  locale?: 'en' | 'pt';
  children: ReactNode;
};

export function TranslationProviderClient({ locale, children }: Props) {
  return <TranslationProvider locale={locale}>{children}</TranslationProvider>;
}

