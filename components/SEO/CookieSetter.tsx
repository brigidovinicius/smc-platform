'use client';

import { useEffect } from 'react';
import { CONTEXT7_SESSION_COOKIE, CONTEXT7_VISITOR_COOKIE, generateSessionId } from '@/lib/context7';

export function CookieSetter({ sessionId, visitorId }: { sessionId: string; visitorId: string }) {
  useEffect(() => {
    // Set cookies client-side
    const setCookie = (name: string, value: string, maxAge: number) => {
      document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    };

    // Only set if not already set
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    if (!getCookie(CONTEXT7_SESSION_COOKIE)) {
      setCookie(CONTEXT7_SESSION_COOKIE, sessionId, 60 * 60 * 24 * 30);
    }

    if (!getCookie(CONTEXT7_VISITOR_COOKIE)) {
      setCookie(CONTEXT7_VISITOR_COOKIE, visitorId, 60 * 60 * 24 * 365);
    }
  }, [sessionId, visitorId]);

  return null;
}

