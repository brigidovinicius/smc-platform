import type { NextFetchEvent, NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { captureEdgeTelemetry } from '@/lib/context7';
import { PREVIEW_MODE_COOKIE, getPreviewModeFromCookie } from '@/lib/preview-mode';

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
  pages: {
    signIn: '/auth/login'
  }
});

export default async function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  await captureEdgeTelemetry(req).catch(() => undefined);
  
  // Check preview mode for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const previewModeCookie = req.cookies.get(PREVIEW_MODE_COOKIE)?.value;
    const previewMode = getPreviewModeFromCookie(previewModeCookie);
    
    // If in user preview mode, redirect to homepage
    if (previewMode === 'user') {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      // Add a query param to show a message
      url.searchParams.set('preview', 'user');
      return NextResponse.redirect(url);
    }
  }
  
  return authMiddleware(req, event);
}

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*', '/admin/:path*']
};


