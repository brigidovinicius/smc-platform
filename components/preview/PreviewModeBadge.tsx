'use client';

import { usePreviewMode } from '@/components/providers/PreviewModeProvider';
import { usePathname } from 'next/navigation';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PreviewModeBadge() {
  const { previewMode, setPreviewMode, isUserMode } = usePreviewMode();
  const pathname = usePathname();

  // Don't show badge on admin routes (they have their own UI)
  if (!isUserMode || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/95 dark:bg-yellow-600/95 border-b border-yellow-600 dark:border-yellow-700 shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-yellow-900 dark:text-yellow-100">
              <Eye className="h-4 w-4" />
              <span>Modo Usuário (simulação)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await setPreviewMode('admin');
              }}
              className="text-yellow-900 dark:text-yellow-100 hover:bg-yellow-400 dark:hover:bg-yellow-700"
            >
              <X className="h-4 w-4 mr-1" />
              Retornar ao Admin
            </Button>
          </div>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind the badge */}
      <div className="h-[42px]" />
    </>
  );
}

