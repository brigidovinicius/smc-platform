import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { TranslationProvider } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/translations';

type ProviderOptions = {
  locale?: Locale;
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & ProviderOptions
) {
  const { locale = 'en', ...renderOptions } = options ?? {};
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <TranslationProvider locale={locale}>{children}</TranslationProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}


