import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import {
  CONTEXT7_SESSION_COOKIE,
  CONTEXT7_VISITOR_COOKIE,
  createBootstrapPayload,
  generateSessionId,
  parseSourceFromUrl
} from '@/lib/context7';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  let sessionId = cookieStore.get(CONTEXT7_SESSION_COOKIE)?.value;
  if (!sessionId) {
    sessionId = generateSessionId();
    cookieStore.set({
      name: CONTEXT7_SESSION_COOKIE,
      value: sessionId,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
  }

  let visitorId = cookieStore.get(CONTEXT7_VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = generateSessionId();
    cookieStore.set({
      name: CONTEXT7_VISITOR_COOKIE,
      value: visitorId,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
  }

  let nextSession = null;
  try {
    nextSession = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session in context7:', error);
    // Continue without session if there's an error
  }
  const sessionUser = nextSession?.user as (Session['user'] & {
    id?: string | null;
    role?: string | null;
  }) | undefined;

  const user =
    sessionUser?.id
      ? {
          id: sessionUser.id,
          email: sessionUser.email ?? undefined,
          name: sessionUser.name ?? undefined,
          role: sessionUser.role ?? undefined
        }
      : null;

  const bootstrap = createBootstrapPayload({
    sessionId,
    visitorId,
    user,
    referrer: req.headers.get('referer'),
    source: parseSourceFromUrl(req.nextUrl.href)
  });

  return NextResponse.json({ success: true, data: bootstrap });
}


