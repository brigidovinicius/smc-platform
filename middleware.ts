import type { NextFetchEvent } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { captureEdgeTelemetry } from '@/lib/context7';
import { PREVIEW_MODE_COOKIE, getPreviewModeFromCookie } from '@/lib/preview-mode';

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // For admin routes, check if user is authenticated AND has ADMIN role
      if (req.nextUrl.pathname.startsWith('/admin')) {
        const role = (token?.role as string)?.toLowerCase();
        return !!token && role === 'admin';
      }
      // For other protected routes, just check if authenticated
      return !!token;
    }
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
  
  const response = await authMiddleware(req, event);
  
  // If admin route and not authorized, redirect to not-authorized or home
  if (req.nextUrl.pathname.startsWith('/admin') && response?.status === 401) {
    const url = req.nextUrl.clone();
    url.pathname = '/not-authorized';
    return NextResponse.redirect(url);
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*', '/admin/:path*']
};


