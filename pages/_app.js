import { SessionProvider } from 'next-auth/react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Layout from '@/components/Layout';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap'
});

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const defaultGetLayout = (page) => <Layout>{page}</Layout>;
  const getLayout = Component.getLayout || defaultGetLayout;

  return (
    <SessionProvider session={session}>
      <div className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {getLayout(<Component {...pageProps} />)}
        <SpeedInsights />
      </div>
    </SessionProvider>
  );
}
