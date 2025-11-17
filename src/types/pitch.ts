export interface PitchStep {
  id: string;
  title: string;
  content: string;
  optional?: boolean;
}

export interface ListingPitch {
  highlightTier: 'OURO' | 'PRATA' | 'BRONZE' | 'NORMAL';
  steps: PitchStep[];
  visibility: 'publico' | 'anonimo';
  ownerId: string;
}
