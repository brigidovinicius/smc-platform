'use client';

import { SocialCardGenerator } from './SocialCardGenerator';
import { PerformanceCardInput } from './socialCards.types';

interface SocialCardsSectionProps {
  initialPerformanceData?: Partial<PerformanceCardInput>;
  isStandalonePage?: boolean;
}

export function SocialCardsSection({ initialPerformanceData, isStandalonePage = false }: SocialCardsSectionProps) {
  if (isStandalonePage) {
    // Quando é página standalone, não precisa do título extra nem border
    return <SocialCardGenerator initialPerformanceData={initialPerformanceData} />;
  }

  // Quando é usado como seção em outra página (mantém compatibilidade)
  return (
    <div className="mt-12 border-t pt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Social Card Generator</h2>
        <p className="text-sm text-muted-foreground">
          Create shareable cards about your business in different styles: performance, identity, or journey.
        </p>
      </div>
      <SocialCardGenerator initialPerformanceData={initialPerformanceData} />
    </div>
  );
}

