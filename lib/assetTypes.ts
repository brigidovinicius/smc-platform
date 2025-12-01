/**
 * Centralized Asset Type Mapping
 * 
 * This file provides a single source of truth for asset type labels,
 * descriptions, and related metadata. Use these mappings everywhere
 * (forms, filters, admin, etc.) to avoid duplication.
 */

export enum AssetType {
  ECOMMERCE = 'ECOMMERCE',
  SAAS = 'SAAS',
  SOFTWARE = 'SOFTWARE',
  WEBSITE_CONTENT = 'WEBSITE_CONTENT',
  SOCIAL_PROFILE = 'SOCIAL_PROFILE',
  NEWSLETTER = 'NEWSLETTER',
  COMMUNITY_MEMBERSHIP = 'COMMUNITY_MEMBERSHIP',
  COURSE_INFOPRODUCT = 'COURSE_INFOPRODUCT',
  HYBRID_BUNDLE = 'HYBRID_BUNDLE',
  OTHER = 'OTHER',
}

export const ASSET_TYPE_LABELS: Record<string, string> = {
  ECOMMERCE: 'Ecommerce',
  SAAS: 'Software / SaaS',
  SOFTWARE: 'Software',
  WEBSITE_CONTENT: 'Websites & Content',
  SOCIAL_PROFILE: 'Social Media Profiles',
  NEWSLETTER: 'Newsletters & Email Lists',
  COMMUNITY_MEMBERSHIP: 'Communities & Memberships',
  COURSE_INFOPRODUCT: 'Courses & Info Products',
  HYBRID_BUNDLE: 'Hybrid / Bundle',
  OTHER: 'Other',
};

export const ASSET_TYPE_DESCRIPTIONS: Record<string, string> = {
  ECOMMERCE: 'Online stores, dropshipping, marketplace seller accounts.',
  SAAS: 'Recurring revenue products, B2B or B2C SaaS.',
  SOFTWARE: 'Licensed software, desktop apps, tools not strictly SaaS.',
  WEBSITE_CONTENT: 'Blogs, niche content sites, affiliate sites, review portals.',
  SOCIAL_PROFILE: 'Instagram, TikTok, YouTube, X, Facebook pages or profiles.',
  NEWSLETTER: 'Standalone newsletters or qualified email lists.',
  COMMUNITY_MEMBERSHIP: 'Paid communities, Discord/Telegram/Slack groups.',
  COURSE_INFOPRODUCT: 'Courses, digital products, templates, info products.',
  HYBRID_BUNDLE: 'Bundles: e.g. SaaS + community, ecommerce + IG + email list.',
  OTHER: 'Any digital asset that does not fit the predefined categories.',
};

export const ASSET_TYPE_OPTIONS = Object.values(AssetType).map((type) => ({
  value: type,
  label: ASSET_TYPE_LABELS[type] || type,
  description: ASSET_TYPE_DESCRIPTIONS[type] || '',
}));

/**
 * Get human-readable label for an asset type
 */
export function getAssetTypeLabel(type: string): string {
  return ASSET_TYPE_LABELS[type] || type;
}

/**
 * Get description for an asset type
 */
export function getAssetTypeDescription(type: string): string {
  return ASSET_TYPE_DESCRIPTIONS[type] || '';
}

/**
 * Check if asset type is valid
 */
export function isValidAssetType(type: string): boolean {
  return type in ASSET_TYPE_LABELS;
}




