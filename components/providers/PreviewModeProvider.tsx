'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { PreviewMode } from '@/lib/preview-mode';
import { PREVIEW_MODE_COOKIE, PREVIEW_MODE_DEFAULT, getPreviewModeFromCookie } from '@/lib/preview-mode';

interface PreviewModeContextType {
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => Promise<void>;
  isUserMode: boolean;
  isAdminMode: boolean;
}

const PreviewModeContext = createContext<PreviewModeContextType | undefined>(undefined);

export function PreviewModeProvider({ children, initialMode }: { children: ReactNode; initialMode?: PreviewMode }) {
  const [previewMode, setPreviewModeState] = useState<PreviewMode>(initialMode || PREVIEW_MODE_DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Function to read cookie from document
  const readCookie = useCallback((): PreviewMode => {
    if (typeof document === 'undefined') return PREVIEW_MODE_DEFAULT;
    
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${PREVIEW_MODE_COOKIE}=`))
      ?.split('=')[1];
    
    return getPreviewModeFromCookie(cookieValue);
  }, []);

  // Sync with cookie on mount
  useEffect(() => {
    const mode = readCookie();
    setPreviewModeState(mode);
  }, [readCookie]);

  // Redirect if in user mode and trying to access admin routes
  useEffect(() => {
    if (previewMode === 'user' && pathname?.startsWith('/admin')) {
      router.push('/');
    }
  }, [previewMode, pathname, router]);

  const setPreviewMode = async (mode: PreviewMode) => {
    if (isLoading) return; // Prevent multiple simultaneous calls
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/preview-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode }),
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to update preview mode');
      }

      const data = await response.json();
      const newMode = data.data?.mode || mode;
      
      // Update state immediately
      setPreviewModeState(newMode);

      // Handle navigation based on mode change
      if (newMode === 'user') {
        // If switching to user mode and on admin route, redirect
        if (pathname?.startsWith('/admin')) {
          router.push('/');
        } else {
          // Refresh to ensure all components update
          router.refresh();
        }
      } else if (newMode === 'admin') {
        // If switching back to admin mode from homepage, go to admin
        if (pathname === '/' || !pathname?.startsWith('/admin')) {
          router.push('/admin/assets');
        } else {
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error setting preview mode:', error);
      // Show user-friendly error
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar modo de visualização';
      alert(errorMessage);
      // Revert to current cookie value
      const currentMode = readCookie();
      setPreviewModeState(currentMode);
    } finally {
      setIsLoading(false);
    }
  };

  const value: PreviewModeContextType = {
    previewMode,
    setPreviewMode,
    isUserMode: previewMode === 'user',
    isAdminMode: previewMode === 'admin',
  };

  return (
    <PreviewModeContext.Provider value={value}>
      {children}
    </PreviewModeContext.Provider>
  );
}

export function usePreviewMode() {
  const context = useContext(PreviewModeContext);
  if (context === undefined) {
    throw new Error('usePreviewMode must be used within a PreviewModeProvider');
  }
  return context;
}

