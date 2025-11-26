import type { Lead, Asset } from '@prisma/client';
import { recordLeadEvent } from '@/lib/context7';

interface LeadWithAsset extends Lead {
  asset?: Pick<Asset, 'id' | 'title' | 'slug'>;
}

/**
 * Hook interno para tratar efeitos colaterais após a criação de um lead.
 * Mantemos simples por enquanto e deixamos comentários sobre futuras integrações.
 */
export async function handleNewLeadSideEffects(lead: LeadWithAsset) {
  // eslint-disable-next-line no-console
  console.log('[Lead] New lead created', {
    id: lead.id,
    assetId: lead.assetId,
    assetSlug: lead.asset?.slug,
    email: lead.email,
    status: lead.status,
  });

  await recordLeadEvent({
    leadId: lead.id,
    assetId: lead.assetId,
    email: lead.email,
    status: lead.status,
    metadata: {
      assetSlug: lead.asset?.slug,
      assetTitle: lead.asset?.title
    }
  });
}


