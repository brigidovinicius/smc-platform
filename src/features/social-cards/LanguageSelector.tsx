'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from './socialCards.i18n';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex gap-1 border rounded-md p-0.5">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentLanguage === 'en'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('pt')}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentLanguage === 'pt'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          PT
        </button>
      </div>
    </div>
  );
}

