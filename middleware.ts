import type { NextFetchEvent } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { captureEdgeTelemetry } from '@/lib/context7';
import { PREVIEW_MODE_COOKIE, getPreviewModeFromCookie } from '@/lib/preview-mode';

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      
      // For /dashboard/admin/* routes, check if user is authenticated AND has ADMIN role
      if (pathname.startsWith('/dashboard/admin')) {
        const role = (token?.role as string)?.toLowerCase();
        return !!token && role === 'admin';
      }
      
      // For /admin/* routes (legacy), check if user is authenticated AND has ADMIN role
      if (pathname.startsWith('/admin')) {
        const role = (token?.role as string)?.toLowerCase();
        return !!token && role === 'admin';
      }
      
      // For /dashboard routes (User Mode), just check if authenticated
      // Admin can access /dashboard too (to view as user)
      if (pathname.startsWith('/dashboard')) {
        return !!token;
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
  const pathname = req.nextUrl.pathname;
  
  // If admin route and not authorized (401), redirect to not-authorized
  if ((pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin')) && response?.status === 401) {
    const url = req.nextUrl.clone();
    url.pathname = '/not-authorized';
    return NextResponse.redirect(url);
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*', '/admin/:path*']
};


