import '@/styles/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import Script from 'next/script';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Context7Provider } from '@/components/providers/Context7Provider';
import { CookieSetter } from '@/components/SEO/CookieSetter';
import {
  CONTEXT7_SESSION_COOKIE,
  CONTEXT7_VISITOR_COOKIE,
  createBootstrapPayload,
  generateSessionId,
  parseSourceFromUrl
} from '@/lib/context7';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'CounterX | Digital Asset Marketplace',
  description: 'Buy and sell digital assets with confidence',
  icons: {
    icon: '/counterx-icon-only.svg',
    apple: '/counterx-icon-only.svg',
    shortcut: '/counterx-icon-only.svg',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session:', error);
    // Continue without session if there's an error (e.g., database connection issue)
  }
  const sessionUser = session?.user as (Session['user'] & { id?: string | null; role?: string | null }) | undefined;
  const cookieStore = cookies();

  // Get existing cookies or generate new IDs
  // Note: We can't set cookies in Server Components, so we'll handle this client-side
  let sessionId = cookieStore.get(CONTEXT7_SESSION_COOKIE)?.value;
  if (!sessionId) {
    sessionId = generateSessionId();
  }

  let visitorId = cookieStore.get(CONTEXT7_VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = generateSessionId();
  }

  const headerStore = headers();
  const referrer = headerStore.get('referer');
  const source = parseSourceFromUrl(referrer);

  const user =
    sessionUser?.id
      ? {
          id: sessionUser.id,
          email: sessionUser.email ?? undefined,
          name: sessionUser.name ?? undefined,
          role: sessionUser.role ?? undefined
        }
      : null;

  const context7Bootstrap = createBootstrapPayload({
    sessionId,
    visitorId,
    user,
    source,
    referrer
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${spaceGrotesk.variable} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <CookieSetter sessionId={sessionId} visitorId={visitorId} />
        {context7Bootstrap.snippet ? (
          <Script id="context7-bootstrap" strategy="afterInteractive">
            {context7Bootstrap.snippet}
          </Script>
        ) : null}
        <SessionProvider>
          <Context7Provider bootstrap={context7Bootstrap}>
            {children}
          </Context7Provider>
        </SessionProvider>
      </body>
    </html>
  );
}

