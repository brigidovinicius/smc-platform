/**
 * i18n Configuration
 * 
 * This file provides a simple i18n setup for CounterX.
 * For now, it's a basic implementation. Full next-intl integration
 * can be added later when needed.
 */

export type Locale = 'en' | 'pt';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'pt'];

// Simple translation function (will be replaced with next-intl later)
export function getTranslations(locale: Locale = defaultLocale) {
  // For now, return a function that just returns the key
  // This will be replaced with actual translation loading
  return (key: string, params?: Record<string, string | number>) => {
    // Placeholder - actual implementation will load from JSON files
    return key;
  };
}



