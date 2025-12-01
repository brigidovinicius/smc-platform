import { SocialCardTheme, SocialCardThemeId } from './socialCards.types';

export const SOCIAL_CARD_THEMES: Record<SocialCardThemeId, SocialCardTheme> = {
  NEOFINANCE: {
    id: 'NEOFINANCE',
    name: 'NeoFinance (Default)',
    description: 'Blue primary, clean white background, modern SaaS style.',
    primaryColor: '#005CFF',
    backgroundColor: '#FFFFFF',
    textColor: '#0A0A0A',
    softBackgroundColor: '#F8F9FA',
    secondaryTextColor: '#667085',
  },
  DARK: {
    id: 'DARK',
    name: 'Dark Mode',
    description: 'Dark background, high contrast metrics.',
    primaryColor: '#2563EB',
    backgroundColor: '#0A0A0A',
    textColor: '#F9FAFB',
    softBackgroundColor: '#111827',
    secondaryTextColor: '#9CA3AF',
  },
  LIGHT_MINIMAL: {
    id: 'LIGHT_MINIMAL',
    name: 'Light Minimal',
    description: 'Soft grey background, very minimal and clean.',
    primaryColor: '#111827',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    softBackgroundColor: '#F3F4F6',
    secondaryTextColor: '#6B7280',
  },
  VIBRANT: {
    id: 'VIBRANT',
    name: 'Vibrant',
    description: 'More colorful, social-media friendly.',
    primaryColor: '#EC4899',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    softBackgroundColor: '#FEF2F2',
    secondaryTextColor: '#6B7280',
  },
};

export function getSocialCardTheme(themeId: SocialCardThemeId): SocialCardTheme {
  return SOCIAL_CARD_THEMES[themeId] ?? SOCIAL_CARD_THEMES.NEOFINANCE;
}

