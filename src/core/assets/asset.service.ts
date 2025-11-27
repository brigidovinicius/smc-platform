/**
 * Asset Domain Service
 * 
 * Core business logic for asset management.
 * This is the single source of truth for asset operations.
 */

import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import { calculateValuation } from '@/lib/valuation';
import { runVerificationChecks } from '@/lib/verification';

export interface AssetContext {
  userId: string;
  isAdmin: boolean;
}

export interface CreateAssetInput {
  type: string;
  status?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  askingPrice: number;
  currency?: string;
  primaryLanguage?: string;
  websiteUrl?: string;
  monthlyRevenue?: number;
  monthlyProfit?: number;
  mrr?: number;
  arr?: number;
  churnRate?: number;
  cac?: number;
  ltv?: number;
  monthlyVisitors?: number;
  emailSubscribers?: number;
  socialFollowers?: number;
}

export interface UpdateAssetInput {
  type?: string;
  status?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  askingPrice?: number;
  currency?: string;
  primaryLanguage?: string;
  websiteUrl?: string;
  monthlyRevenue?: number;
  monthlyProfit?: number;
  mrr?: number;
  arr?: number;
  churnRate?: number;
  cac?: number;
  ltv?: number;
  monthlyVisitors?: number;
  emailSubscribers?: number;
  socialFollowers?: number;
}

export interface AssetFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  ownerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ModerationInput {
  action: 'APPROVE' | 'REJECT';
  comment?: string;
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
}

/**
 * Create a new asset
 */
export async function createAsset(input: CreateAssetInput, context: AssetContext) {
  // Generate slug
  const baseSlug = slugify(input.title);
  
  // Check if slug exists
  const existingSlug = await prisma.asset.findUnique({
    where: { slug: baseSlug },
  });

  let slug = baseSlug;
  if (existingSlug) {
    let counter = 1;
    while (await prisma.asset.findUnique({ where: { slug: `${baseSlug}-${counter}` } })) {
      counter++;
    }
    slug = `${baseSlug}-${counter}`;
  }

  // Create asset
  const asset = await prisma.asset.create({
    data: {
      ownerId: context.userId,
      type: input.type as any,
      status: (input.status || 'DRAFT') as any,
      title: input.title,
      slug,
      shortDescription: input.shortDescription,
      fullDescription: input.fullDescription,
      askingPrice: input.askingPrice,
      currency: input.currency || 'USD',
      primaryLanguage: input.primaryLanguage,
      websiteUrl: input.websiteUrl || null,
      monthlyRevenue: input.monthlyRevenue,
      monthlyProfit: input.monthlyProfit,
      mrr: input.mrr,
      arr: input.arr,
      churnRate: input.churnRate,
      cac: input.cac,
      ltv: input.ltv,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Create performance record if data provided
  if (input.monthlyVisitors || input.emailSubscribers || input.socialFollowers) {
    await prisma.assetPerformance.create({
      data: {
        assetId: asset.id,
        monthlyVisitors: input.monthlyVisitors,
        emailSubscribers: input.emailSubscribers,
        socialFollowers: input.socialFollowers,
      },
    });
  }

  // Calculate valuation
  const valuation = calculateValuation({
    type: asset.type,
    monthlyProfit: asset.monthlyProfit || undefined,
    monthlyRevenue: asset.monthlyRevenue || undefined,
    mrr: asset.mrr || undefined,
    arr: asset.arr || undefined,
  });

  if (valuation.suggestedMin && valuation.suggestedMax) {
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        suggestedMinPrice: valuation.suggestedMin,
        suggestedMaxPrice: valuation.suggestedMax,
        valuationNote: valuation.explanation,
      },
    });
  }

  // Run verification checks
  const finalAsset = await prisma.asset.findUnique({
    where: { id: asset.id },
    include: { media: true },
  });

  if (finalAsset) {
    const flags = runVerificationChecks({
      type: finalAsset.type,
      askingPrice: finalAsset.askingPrice,
      suggestedMinPrice: finalAsset.suggestedMinPrice || undefined,
      suggestedMaxPrice: finalAsset.suggestedMaxPrice || undefined,
      monthlyRevenue: finalAsset.monthlyRevenue || undefined,
      monthlyProfit: finalAsset.monthlyProfit || undefined,
      websiteUrl: finalAsset.websiteUrl || undefined,
      mediaCount: finalAsset.media.length,
    });

    if (flags.length > 0) {
      await prisma.assetVerification.create({
        data: {
          assetId: asset.id,
          flags: JSON.stringify(flags),
        },
      });
    }
  }

  // Fetch complete asset with all relations
  return await prisma.asset.findUnique({
    where: { id: asset.id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      performance: true,
      verification: true,
      moderation: true,
      media: true,
    },
  });
}

/**
 * Update an existing asset
 */
export async function updateAsset(
  id: string,
  input: UpdateAssetInput,
  context: AssetContext
) {
  // Get existing asset
  const existingAsset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!existingAsset) {
    throw new Error('Asset not found');
  }

  // Only owner or admin can update
  if (existingAsset.ownerId !== context.userId && !context.isAdmin) {
    throw new Error('Forbidden');
  }

  const updateData: Prisma.AssetUpdateInput = {};

  // Build update data (only include fields that are present)
  if (input.type !== undefined) updateData.type = input.type as any;
  if (input.status !== undefined) updateData.status = input.status as any;
  if (input.title !== undefined) updateData.title = input.title;
  if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription;
  if (input.fullDescription !== undefined) updateData.fullDescription = input.fullDescription;
  if (input.askingPrice !== undefined) updateData.askingPrice = input.askingPrice;
  if (input.currency !== undefined) updateData.currency = input.currency;
  if (input.primaryLanguage !== undefined) updateData.primaryLanguage = input.primaryLanguage;
  if (input.websiteUrl !== undefined) updateData.websiteUrl = input.websiteUrl || null;
  if (input.monthlyRevenue !== undefined) updateData.monthlyRevenue = input.monthlyRevenue;
  if (input.monthlyProfit !== undefined) updateData.monthlyProfit = input.monthlyProfit;
  if (input.mrr !== undefined) updateData.mrr = input.mrr;
  if (input.arr !== undefined) updateData.arr = input.arr;
  if (input.churnRate !== undefined) updateData.churnRate = input.churnRate;
  if (input.cac !== undefined) updateData.cac = input.cac;
  if (input.ltv !== undefined) updateData.ltv = input.ltv;

  // Update asset
  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: updateData,
    include: {
      performance: true,
    },
  });

  // Update performance if provided
  if (input.monthlyVisitors !== undefined || input.emailSubscribers !== undefined || input.socialFollowers !== undefined) {
    await prisma.assetPerformance.upsert({
      where: { assetId: updatedAsset.id },
      update: {
        monthlyVisitors: input.monthlyVisitors ?? undefined,
        emailSubscribers: input.emailSubscribers ?? undefined,
        socialFollowers: input.socialFollowers ?? undefined,
      },
      create: {
        assetId: updatedAsset.id,
        monthlyVisitors: input.monthlyVisitors,
        emailSubscribers: input.emailSubscribers,
        socialFollowers: input.socialFollowers,
      },
    });
  }

  // Recalculate valuation if financial data changed
  if (
    input.type !== undefined ||
    input.monthlyProfit !== undefined ||
    input.monthlyRevenue !== undefined ||
    input.mrr !== undefined ||
    input.arr !== undefined
  ) {
    const valuation = calculateValuation({
      type: updatedAsset.type,
      monthlyProfit: updatedAsset.monthlyProfit || undefined,
      monthlyRevenue: updatedAsset.monthlyRevenue || undefined,
      mrr: updatedAsset.mrr || undefined,
      arr: updatedAsset.arr || undefined,
    });

    if (valuation.suggestedMin && valuation.suggestedMax) {
      await prisma.asset.update({
        where: { id },
        data: {
          suggestedMinPrice: valuation.suggestedMin,
          suggestedMaxPrice: valuation.suggestedMax,
          valuationNote: valuation.explanation,
        },
      });
    }
  }

  // Re-run verification checks
  const finalAsset = await prisma.asset.findUnique({
    where: { id },
    include: { media: true },
  });

  if (finalAsset) {
    const flags = runVerificationChecks({
      type: finalAsset.type,
      askingPrice: finalAsset.askingPrice,
      suggestedMinPrice: finalAsset.suggestedMinPrice || undefined,
      suggestedMaxPrice: finalAsset.suggestedMaxPrice || undefined,
      monthlyRevenue: finalAsset.monthlyRevenue || undefined,
      monthlyProfit: finalAsset.monthlyProfit || undefined,
      websiteUrl: finalAsset.websiteUrl || undefined,
      mediaCount: finalAsset.media.length,
    });

    await prisma.assetVerification.upsert({
      where: { assetId: id },
      update: {
        flags: JSON.stringify(flags),
      },
      create: {
        assetId: id,
        flags: JSON.stringify(flags),
      },
    });
  }

  // Fetch complete asset with all relations
  return await prisma.asset.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      performance: true,
      verification: true,
      moderation: true,
      media: true,
      financials: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 12,
      },
    },
  });
}

/**
 * Get asset by ID or slug
 */
export async function getAssetByIdOrSlug(idOrSlug: string, context?: AssetContext) {
  const asset = await prisma.asset.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug },
      ],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      performance: true,
      verification: true,
      moderation: true,
      media: true,
      financials: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 12,
      },
    },
  });

  if (!asset) {
    return null;
  }

  // Only owner or admin can see non-published assets
  if (asset.status !== 'PUBLISHED' && context) {
    if (!context.userId || (asset.ownerId !== context.userId && !context.isAdmin)) {
      return null;
    }
  } else if (asset.status !== 'PUBLISHED' && !context) {
    return null;
  }

  return asset;
}

/**
 * List assets with filters
 */
export async function listAssets(filters: AssetFilters, context?: AssetContext) {
  const where: Prisma.AssetWhereInput = {};
  
  if (filters.type) {
    where.type = filters.type as any;
  }
  
  if (filters.status) {
    where.status = filters.status as any;
  } else if (!context || !context.userId) {
    // Default: only show PUBLISHED assets for public
    where.status = 'PUBLISHED';
  }
  
  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }
  
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.askingPrice = {};
    if (filters.minPrice !== undefined) {
      where.askingPrice.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.askingPrice.lte = filters.maxPrice;
    }
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { shortDescription: { contains: filters.search, mode: 'insensitive' } },
      { fullDescription: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        performance: true,
        _count: {
          select: {
            media: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.asset.count({ where }),
  ]);

  return {
    assets,
    total,
    limit,
    offset,
  };
}

/**
 * Moderate an asset (approve/reject)
 */
export async function moderateAsset(
  id: string,
  input: ModerationInput,
  context: AssetContext
) {
  if (!context.isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }

  const asset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error('Asset not found');
  }

  // Determine new status based on action
  let newStatus: string;
  if (input.action === 'APPROVE') {
    newStatus = 'APPROVED';
  } else if (input.action === 'REJECT') {
    newStatus = 'REJECTED';
  } else {
    throw new Error('Invalid moderation action');
  }

  // Update asset status
  await prisma.asset.update({
    where: { id },
    data: {
      status: newStatus as any,
    },
  });

  // Create or update moderation record
  await prisma.assetModeration.upsert({
    where: { assetId: id },
    update: {
      adminReviewerId: context.userId,
      adminStatusComment: input.comment || null,
      adminSuggestedPrice: input.suggestedPriceMin || input.suggestedPriceMax 
        ? (input.suggestedPriceMin || input.suggestedPriceMax || null)
        : null,
      adminPricingComment: input.suggestedPriceMin && input.suggestedPriceMax
        ? `Suggested range: ${input.suggestedPriceMin} - ${input.suggestedPriceMax}`
        : null,
    },
    create: {
      assetId: id,
      adminReviewerId: context.userId,
      adminStatusComment: input.comment || null,
      adminSuggestedPrice: input.suggestedPriceMin || input.suggestedPriceMax 
        ? (input.suggestedPriceMin || input.suggestedPriceMax || null)
        : null,
      adminPricingComment: input.suggestedPriceMin && input.suggestedPriceMax
        ? `Suggested range: ${input.suggestedPriceMin} - ${input.suggestedPriceMax}`
        : null,
    },
  });

  // Fetch complete asset with all relations
  return await prisma.asset.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      performance: true,
      verification: true,
      moderation: true,
      media: true,
    },
  });
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: string, context: AssetContext) {
  const asset = await prisma.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error('Asset not found');
  }

  // Only owner or admin can delete
  if (asset.ownerId !== context.userId && !context.isAdmin) {
    throw new Error('Forbidden');
  }

  // Hard delete (cascade will handle related records)
  await prisma.asset.delete({
    where: { id },
  });

  return { success: true };
}

