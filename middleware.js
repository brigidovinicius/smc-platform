/**
 * Next.js Middleware - Route Protection
 * 
 * Protects private routes using NextAuth middleware.
 * Only authenticated users can access protected routes.
 * 
 * Protected routes:
 * - /dashboard/** (all dashboard pages)
 * - /offers/** (all offer pages)
 * 
 * Unprotected routes (public):
 * - / (homepage)
 * - /blog/** (blog pages)
 * - /auth/** (authentication pages)
 * 
 * @module middleware
 */

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
  pages: {
    signIn: '/auth/login'
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*']
};
