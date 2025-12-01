import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import SocialCardsContent from './SocialCardsContent';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Gerador de Cards Sociais | CounterX',
    description: 'Crie cards sociais compartilháveis sobre seu negócio: performance, identidade ou jornada. Personalize cores, adicione fotos e compartilhe suas conquistas.',
    url: `${SITE_CONFIG.url}/social-cards`,
    keywords: ['social cards', 'card generator', 'shareable cards', 'business cards', 'SaaS cards', 'founder cards'],
  });
}

export default function SocialCardsPage() {
  return <SocialCardsContent />;
}

