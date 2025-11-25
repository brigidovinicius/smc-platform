'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { t as translate, defaultLocale, type Locale } from '@/lib/i18n/translations';

type TranslationContextValue = {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const TranslationContext = createContext<TranslationContextValue>({
  locale: defaultLocale,
  t: (key: string) => key,
  setLocale: () => undefined
});

type TranslationProviderProps = {
  locale?: Locale;
  children: ReactNode;
};

const readLocaleFromCookie = (): Locale | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const value = match[1];
  return (value === 'pt' ? 'pt' : 'en') as Locale;
};

export function TranslationProvider({ locale: initialLocale, children }: TranslationProviderProps) {
  // Always start with initialLocale or defaultLocale to prevent hydration mismatch
  // Never read from cookie during initial render - only after mount
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? defaultLocale);
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side after mount
  useEffect(() => {
    setIsClient(true);
    const cookieLocale = readLocaleFromCookie();
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    } else if (initialLocale && initialLocale !== locale && !cookieLocale) {
      setLocaleState(initialLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      setLocaleState(nextLocale);
      if (typeof document !== 'undefined') {
        document.cookie = `${COOKIE_NAME}=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE}`;
      }
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale: isClient ? locale : (initialLocale ?? defaultLocale), // Use initial locale during SSR
      t: (key: string, params?: Record<string, string | number>) => {
        const currentLocale = isClient ? locale : (initialLocale ?? defaultLocale);
        return translate(key, currentLocale, params);
      },
      setLocale
    }),
    [locale, setLocale, isClient, initialLocale]
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  return useContext(TranslationContext);
}

