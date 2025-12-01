'use client';

import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { SocialCardsSection } from '@/src/features/social-cards';

export default function SocialCardsContent() {
  return (
    <MarketingPageLayout
      title="Social Card Generator"
      description="Create shareable cards about your business: performance, identity, or journey. Customize colors, add photos, and share your achievements."
      showHero={true}
    >
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <SocialCardsSection isStandalonePage={true} />
        </div>
      </section>
    </MarketingPageLayout>
  );
}

