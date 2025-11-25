export const LEAD_BUYER_TYPES = [
  { value: 'INVESTOR', label: 'Investidor' },
  { value: 'COMPANY', label: 'Empresa' },
  { value: 'INDIVIDUAL', label: 'Pessoa Física' },
  { value: 'OTHER', label: 'Outro' },
] as const;

export const LEAD_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Novo' },
  { value: 'IN_CONTACT', label: 'Em contato' },
  { value: 'PROPOSAL_SENT', label: 'Proposta enviada' },
  { value: 'WON', label: 'Ganhou' },
  { value: 'LOST', label: 'Perdido' },
] as const;

export type LeadBuyerTypeValue = (typeof LEAD_BUYER_TYPES)[number]['value'];
export type LeadStatusValue = (typeof LEAD_STATUS_OPTIONS)[number]['value'];

export function normalizeLeadBuyerType(value?: string | null): LeadBuyerTypeValue {
  if (!value) return 'OTHER';
  const upper = value.toUpperCase() as LeadBuyerTypeValue;
  const exists = LEAD_BUYER_TYPES.some((type) => type.value === upper);
  return exists ? upper : 'OTHER';
}

export function normalizeLeadStatus(value?: string | null): LeadStatusValue | undefined {
  if (!value) return undefined;
  const upper = value.toUpperCase() as LeadStatusValue;
  const exists = LEAD_STATUS_OPTIONS.some((status) => status.value === upper);
  return exists ? upper : undefined;
}

