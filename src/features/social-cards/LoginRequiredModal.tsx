'use client';

import { useSession, signIn } from 'next-auth/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, getTranslation } from './socialCards.i18n';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function LoginRequiredModal({ isOpen, onClose, language }: LoginRequiredModalProps) {
  const { data: session } = useSession();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  if (!isOpen) return null;

  const handleLogin = () => {
    const callbackUrl = window.location.href;
    signIn('google', { callbackUrl });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-background rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {language === 'pt' ? 'Login Necessário' : 'Login Required'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'pt'
                ? 'Para baixar e compartilhar seu card, você precisa fazer login. Suas informações já preenchidas serão salvas.'
                : 'To download and share your card, you need to log in. Your filled information will be saved.'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleLogin} className="flex-1">
              {language === 'pt' ? 'Entrar com Google' : 'Sign in with Google'}
            </Button>
            <Button onClick={onClose} variant="outline">
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

