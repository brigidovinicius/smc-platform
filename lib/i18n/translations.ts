/**
 * Translation loader for next-intl
 * Loads translations from JSON files
 */

import enCommon from '@/locales/en/common.json';
import ptCommon from '@/locales/pt/common.json';

export type Locale = 'en' | 'pt';

export const locales: Locale[] = ['en', 'pt'];
export const defaultLocale: Locale = 'en';

export const translations = {
  en: enCommon,
  pt: ptCommon
} as const;

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

export function t(key: string, locale: Locale = defaultLocale, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = getTranslations(locale);
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English if translation not found
      if (locale !== defaultLocale) {
        return t(key, defaultLocale, params);
      }
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Simple parameter replacement
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

