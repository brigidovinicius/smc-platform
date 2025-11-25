/**
 * API Route: /api/assets
 * CRUD operations for assets
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, requireMethod, getUserFromSession, successResponse, errorResponse } from '@/lib/api/helpers';
import type { ApiResponse } from '@/lib/api/helpers';
import prisma from '@/lib/prisma';
import { AssetCreateSchema, AssetQuerySchema, AssetStatusEnum } from '@/lib/schemas/asset';
import { slugify } from '@/lib/slugify';
import { calculateValuation } from '@/lib/valuation';
import { runVerificationChecks } from '@/lib/verification';
import { notifyAdminOfNewAsset } from '@/lib/notifications';
import { z } from 'zod';

// GET: List assets (with filters)
async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const query = AssetQuerySchema.safeParse(req.query);
  
  if (!query.success) {
    return errorResponse(res, 'Invalid query parameters', 400, 'VALIDATION_ERROR');
  }

  const { type, status, minPrice, maxPrice, ownerId, limit, offset } = query.data;

  // Build where clause
  const where: any = {};
  
  if (type) {
    where.type = type;
  }
  
  if (status) {
    where.status = status;
  } else {
    // Default: only show PUBLISHED assets for public, or all for authenticated users
    const user = await getUserFromSession(req, res);
    if (!user) {
      where.status = 'PUBLISHED';
    }
  }
  
  if (ownerId) {
    where.ownerId = ownerId;
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.askingPrice = {};
    if (minPrice !== undefined) {
      where.askingPrice.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.askingPrice.lte = maxPrice;
    }
  }

  // Fetch assets
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

  return successResponse(res, {
    assets,
    total,
    limit,
    offset,
  });
}

// POST: Create new asset
async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // Validate body
  const validation = AssetCreateSchema.safeParse(req.body);
  if (!validation.success) {
    return errorResponse(
      res,
      `Validation error: ${validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  const data = validation.data;

  // Generate slug
  const baseSlug = slugify(data.title);
  
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
      ownerId: user.id,
      type: data.type,
      status: data.status || 'DRAFT',
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      askingPrice: data.askingPrice,
      currency: data.currency || 'USD',
      primaryLanguage: data.primaryLanguage,
      websiteUrl: data.websiteUrl || null,
      monthlyRevenue: data.monthlyRevenue,
      monthlyProfit: data.monthlyProfit,
      mrr: data.mrr,
      arr: data.arr,
      churnRate: data.churnRate,
      cac: data.cac,
      ltv: data.ltv,
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
  if (data.monthlyVisitors || data.emailSubscribers || data.socialFollowers) {
    await prisma.assetPerformance.create({
      data: {
        assetId: asset.id,
        monthlyVisitors: data.monthlyVisitors,
        emailSubscribers: data.emailSubscribers,
        socialFollowers: data.socialFollowers,
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
  const flags = runVerificationChecks({
    type: asset.type,
    askingPrice: asset.askingPrice,
    suggestedMinPrice: asset.suggestedMinPrice || undefined,
    suggestedMaxPrice: asset.suggestedMaxPrice || undefined,
    monthlyRevenue: asset.monthlyRevenue || undefined,
    monthlyProfit: asset.monthlyProfit || undefined,
    websiteUrl: asset.websiteUrl || undefined,
    mediaCount: 0,
  });

  if (flags.length > 0) {
    await prisma.assetVerification.create({
      data: {
        assetId: asset.id,
        flags: JSON.stringify(flags),
      },
    });
  }

  // If status is SUBMITTED or PENDING_REVIEW, notify admin
  if (asset.status === 'SUBMITTED' || asset.status === 'PENDING_REVIEW') {
    await notifyAdminOfNewAsset({
      assetId: asset.id,
      assetTitle: asset.title,
      ownerId: user.id,
      ownerEmail: user.email || undefined,
      status: asset.status,
    });
  }

  // Fetch updated asset with all relations
  const updatedAsset = await prisma.asset.findUnique({
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
      media: true,
    },
  });

  return successResponse(res, { asset: updatedAsset }, 201);
}

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (!requireMethod(req, res, ['GET', 'POST'])) {
    return;
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }
});

