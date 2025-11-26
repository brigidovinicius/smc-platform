import type { NextFetchEvent } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { withAuth } from 'next-auth/middleware';
import { captureEdgeTelemetry } from '@/lib/context7';

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
  return authMiddleware(req, event);
}

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*']
};


