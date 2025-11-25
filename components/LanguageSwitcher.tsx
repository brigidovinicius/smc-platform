'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils/utils';

const languages: Array<{ value: Locale; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'pt', label: 'PT' }
];

type LanguageSwitcherProps = {
  className?: string;
  variant?: 'ghost' | 'select';
};

export function LanguageSwitcher({ className, variant = 'select' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = (event.target.value as Locale) || 'en';
      setLocale(nextLocale);
    },
    [setLocale]
  );

  // Always render the same content during SSR and initial client render
  // Use default locale until component mounts to prevent hydration mismatch
  const displayLocale = mounted ? locale : 'en';
  
  // Use static labels during SSR to prevent hydration mismatch
  const displayText = mounted ? t('common.language') : 'Language';
  const getOptionLabel = (lang: typeof languages[0]) => {
    if (!mounted) return lang.value.toUpperCase(); // Use simple EN/PT during SSR
    return t(`common.languageOptions.${lang.value}`);
  };

  if (variant === 'ghost') {
    return (
      <div 
        className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)}
        suppressHydrationWarning
      >
        <span className="hidden lg:inline">{displayText}:</span>
        <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold">
          {displayLocale.toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <label 
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      suppressHydrationWarning
    >
      <span className="sr-only">{displayText}</span>
      <select
        value={displayLocale}
        onChange={handleChange}
        className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        suppressHydrationWarning
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {getOptionLabel(language)}
          </option>
        ))}
      </select>
    </label>
  );
}

