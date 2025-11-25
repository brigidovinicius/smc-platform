import type { Lead, Asset } from '@prisma/client';

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

  // TODO: Futuras integrações
  // - Enviar email para o time interno ou advisor
  // - Disparar webhooks para automações (n8n, Make, GoHighLevel)
  // - Criar registros em CRMs ou plataformas de atendimento
}

