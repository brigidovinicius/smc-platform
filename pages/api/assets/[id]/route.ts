/**
 * API Route: /api/assets/[id]
 * Operations on specific assets (GET, PUT, DELETE)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, requireMethod, getUserFromSession, successResponse, errorResponse } from '@/lib/api/helpers';
import type { ApiResponse } from '@/lib/api/helpers';
import prisma from '@/lib/prisma';
import { AssetUpdateSchema, AssetStatusEnum } from '@/lib/schemas/asset';
import { calculateValuation } from '@/lib/valuation';
import { runVerificationChecks } from '@/lib/verification';
import { notifyAdminOfNewAsset, notifyOwnerAssetPublished } from '@/lib/notifications';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// GET: Get single asset by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>, assetId: string) {
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
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
    return errorResponse(res, 'Asset not found', 404, 'NOT_FOUND');
  }

  // Check if user can view this asset
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user?.email 
    ? await prisma.user.findUnique({ 
        where: { email: session.user.email },
      })
    : null;

  // Check if user is admin
  let isAdmin = false;
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    isAdmin = profile?.role === 'ADMIN';
  }

  // Only owner or admin can see non-published assets
  if (asset.status !== 'PUBLISHED' && (!user || (user.id !== asset.ownerId && !isAdmin))) {
    return errorResponse(res, 'Asset not found', 404, 'NOT_FOUND');
  }

  return successResponse(res, { asset });
}

// PUT: Update asset
async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>, assetId: string) {
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // Get existing asset
  const existingAsset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!existingAsset) {
    return errorResponse(res, 'Asset not found', 404, 'NOT_FOUND');
  }

  // Get user profile to check role
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  // Only owner or admin can update
  const isAdmin = profile?.role === 'ADMIN';
  if (existingAsset.ownerId !== user.id && !isAdmin) {
    return errorResponse(res, 'Forbidden', 403, 'FORBIDDEN');
  }

  // Validate body (partial update)
  const validation = AssetUpdateSchema.safeParse({ ...req.body, id: assetId });
  if (!validation.success) {
    return errorResponse(
      res,
      `Validation error: ${validation.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  const data = validation.data;
  const updateData: any = {};

  // Build update data (only include fields that are present)
  if (data.type !== undefined) updateData.type = data.type;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
  if (data.fullDescription !== undefined) updateData.fullDescription = data.fullDescription;
  if (data.askingPrice !== undefined) updateData.askingPrice = data.askingPrice;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.primaryLanguage !== undefined) updateData.primaryLanguage = data.primaryLanguage;
  if (data.websiteUrl !== undefined) updateData.websiteUrl = data.websiteUrl || null;
  if (data.monthlyRevenue !== undefined) updateData.monthlyRevenue = data.monthlyRevenue;
  if (data.monthlyProfit !== undefined) updateData.monthlyProfit = data.monthlyProfit;
  if (data.mrr !== undefined) updateData.mrr = data.mrr;
  if (data.arr !== undefined) updateData.arr = data.arr;
  if (data.churnRate !== undefined) updateData.churnRate = data.churnRate;
  if (data.cac !== undefined) updateData.cac = data.cac;
  if (data.ltv !== undefined) updateData.ltv = data.ltv;

  // Update asset
  const updatedAsset = await prisma.asset.update({
    where: { id: assetId },
    data: updateData,
    include: {
      performance: true,
    },
  });

  // Update performance if provided
  if (data.monthlyVisitors !== undefined || data.emailSubscribers !== undefined || data.socialFollowers !== undefined) {
    await prisma.assetPerformance.upsert({
      where: { assetId: updatedAsset.id },
      update: {
        monthlyVisitors: data.monthlyVisitors ?? undefined,
        emailSubscribers: data.emailSubscribers ?? undefined,
        socialFollowers: data.socialFollowers ?? undefined,
      },
      create: {
        assetId: updatedAsset.id,
        monthlyVisitors: data.monthlyVisitors,
        emailSubscribers: data.emailSubscribers,
        socialFollowers: data.socialFollowers,
      },
    });
  }

  // Recalculate valuation if financial data changed
  if (
    data.type !== undefined ||
    data.monthlyProfit !== undefined ||
    data.monthlyRevenue !== undefined ||
    data.mrr !== undefined ||
    data.arr !== undefined
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
        where: { id: assetId },
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
    where: { id: assetId },
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
      where: { assetId: assetId },
      update: {
        flags: JSON.stringify(flags),
      },
      create: {
        assetId: assetId,
        flags: JSON.stringify(flags),
      },
    });
  }

  // Handle status transitions
  const previousStatus = existingAsset.status;
  if (data.status && data.status !== previousStatus) {
    if ((data.status === 'SUBMITTED' || data.status === 'PENDING_REVIEW') && previousStatus === 'DRAFT') {
      await notifyAdminOfNewAsset({
        assetId: assetId,
        assetTitle: updatedAsset.title,
        ownerId: updatedAsset.ownerId,
        status: data.status,
        previousStatus,
      });
    }

    if (data.status === 'PUBLISHED' && previousStatus !== 'PUBLISHED') {
      const owner = await prisma.user.findUnique({
        where: { id: updatedAsset.ownerId },
        select: { email: true },
      });

      await notifyOwnerAssetPublished({
        assetId: assetId,
        assetTitle: updatedAsset.title,
        ownerId: updatedAsset.ownerId,
        ownerEmail: owner?.email || undefined,
        status: data.status,
        previousStatus,
      });
    }
  }

  // Fetch complete asset with all relations
  const completeAsset = await prisma.asset.findUnique({
    where: { id: assetId },
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

  return successResponse(res, { asset: completeAsset });
}

// DELETE: Delete asset (soft delete or hard delete)
async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>, assetId: string) {
  const user = await getUserFromSession(req, res);
  if (!user) return;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    return errorResponse(res, 'Asset not found', 404, 'NOT_FOUND');
  }

  // Get user profile to check role
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  // Only owner or admin can delete
  const isAdmin = profile?.role === 'ADMIN';
  if (asset.ownerId !== user.id && !isAdmin) {
    return errorResponse(res, 'Forbidden', 403, 'FORBIDDEN');
  }

  // Hard delete (cascade will handle related records)
  await prisma.asset.delete({
    where: { id: assetId },
  });

  return successResponse(res, { message: 'Asset deleted successfully' });
}

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (!requireMethod(req, res, ['GET', 'PUT', 'DELETE'])) {
    return;
  }

  const assetId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!assetId || typeof assetId !== 'string') {
    return errorResponse(res, 'Asset ID is required', 400, 'VALIDATION_ERROR');
  }

  if (req.method === 'GET') {
    return handleGet(req, res, assetId);
  }

  if (req.method === 'PUT') {
    return handlePut(req, res, assetId);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, assetId);
  }
});

