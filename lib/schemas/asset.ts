/**
 * Zod schemas for Asset validation
 */

import { z } from 'zod';

export const AssetTypeEnum = z.enum([
  'ECOMMERCE',
  'SAAS',
  'SOFTWARE',
  'WEBSITE_CONTENT',
  'SOCIAL_PROFILE',
  'NEWSLETTER',
  'COMMUNITY_MEMBERSHIP',
  'COURSE_INFOPRODUCT',
  'HYBRID_BUNDLE',
  'OTHER',
]);

export const AssetStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'PUBLISHED',
]);

// Step 1: Basics
export const AssetBasicsSchema = z.object({
  type: AssetTypeEnum,
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters').max(10000),
  primaryLanguage: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

// Step 2: Business & Performance
export const AssetBusinessSchema = z.object({
  monthlyRevenue: z.number().nonnegative().optional().nullable(),
  monthlyProfit: z.number().optional().nullable(),
  mrr: z.number().nonnegative().optional().nullable(),
  arr: z.number().nonnegative().optional().nullable(),
  churnRate: z.number().min(0).max(100).optional().nullable(),
  cac: z.number().nonnegative().optional().nullable(),
  ltv: z.number().nonnegative().optional().nullable(),
  monthlyVisitors: z.number().int().nonnegative().optional().nullable(),
  emailSubscribers: z.number().int().nonnegative().optional().nullable(),
  socialFollowers: z.number().int().nonnegative().optional().nullable(),
});

// Step 3: Pricing
export const AssetPricingSchema = z.object({
  askingPrice: z.number().positive('Asking price must be greater than 0'),
  currency: z.string().default('USD'),
});

// Combined asset creation schema
export const AssetCreateSchema = AssetBasicsSchema
  .merge(AssetBusinessSchema)
  .merge(AssetPricingSchema)
  .extend({
    status: AssetStatusEnum.default('DRAFT'),
  });

// Asset update schema (all fields optional except ID)
export const AssetUpdateSchema = AssetCreateSchema.partial().extend({
  id: z.string(),
});

// Media upload schema
export const AssetMediaSchema = z.object({
  url: z.string().url(),
  type: z.string(),
  label: z.string().optional(),
});

// Query/filter schema
export const AssetQuerySchema = z.object({
  type: z.string().optional(),
  status: AssetStatusEnum.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  ownerId: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type AssetBasicsInput = z.infer<typeof AssetBasicsSchema>;
export type AssetBusinessInput = z.infer<typeof AssetBusinessSchema>;
export type AssetPricingInput = z.infer<typeof AssetPricingSchema>;
export type AssetCreateInput = z.infer<typeof AssetCreateSchema>;
export type AssetUpdateInput = z.infer<typeof AssetUpdateSchema>;
export type AssetQueryInput = z.infer<typeof AssetQuerySchema>;




