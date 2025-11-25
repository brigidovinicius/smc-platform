import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const locales = ['en', 'pt'];
const defaultLocale = 'en';

function detectLocale(request) {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;
  const preferred = header.split(',').map((part) => part.split(';')[0].trim());
  const match = preferred.find((lang) => locales.includes(lang.split('-')[0]));
  return match ? match.split('-')[0] : defaultLocale;
}

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname || '/';
    
    // Apply locale cookie
    const locale = req.cookies.get('NEXT_LOCALE')?.value || detectLocale(req);
    const response = NextResponse.next();

    if (!req.cookies.get('NEXT_LOCALE')) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      });
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname || '/';
        
        // Only protect dashboard and offers routes
        const isProtectedRoute = 
          pathname.startsWith('/dashboard') || 
          pathname.startsWith('/offers');

        if (isProtectedRoute) {
          return !!token;
        }

        // Allow access to all other routes
        return true;
      }
    },
    pages: {
      signIn: '/auth/login'
    }
  }
);

export const config = {
  matcher: ['/((?!_next|api|static|.*\\..*|favicon.ico).*)']
};
