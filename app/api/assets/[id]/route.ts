/**
 * API Route: /api/assets/[id]
 * Operations on specific assets (App Router)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  getAssetByIdOrSlug,
  updateAsset,
  deleteAsset,
  moderateAsset,
} from '@/src/core/assets/asset.service';
import { getAuthContext, requireAdmin } from '@/src/core/auth/auth.service';
import { AssetUpdateSchema } from '@/lib/schemas/asset';
import { notifyAdminOfNewAsset, notifyOwnerAssetPublished } from '@/lib/notifications';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const context = await getAuthContext(session);

    const asset = await getAssetByIdOrSlug(params.id, context || undefined);

    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { asset },
    });
  } catch (error: any) {
    console.error('[API] Error fetching asset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const context = await getAuthContext(session);

    if (!context) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = AssetUpdateSchema.safeParse({ ...body, id: params.id });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    // Get existing asset to check status transitions
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id },
    });

    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Filter out null values (convert to undefined)
    const updateData = Object.fromEntries(
      Object.entries(validation.data).filter(([_, v]) => v !== null && v !== undefined)
    ) as any;

    const updatedAsset = await updateAsset(
      params.id,
      updateData,
      {
        userId: context.userId,
        isAdmin: context.isAdmin,
      }
    );

    // Handle status transitions
    const previousStatus = existingAsset.status;
    if (body.status && body.status !== previousStatus && updatedAsset) {
      if ((body.status === 'SUBMITTED' || body.status === 'PENDING_REVIEW') && previousStatus === 'DRAFT') {
        await notifyAdminOfNewAsset({
          assetId: params.id,
          assetTitle: updatedAsset.title,
          ownerId: updatedAsset.ownerId,
          status: body.status,
          previousStatus,
        }).catch((error) => {
          console.error('[API] Error notifying admin:', error);
        });
      }

      if (body.status === 'PUBLISHED' && previousStatus !== 'PUBLISHED') {
        const owner = await prisma.user.findUnique({
          where: { id: updatedAsset.ownerId },
          select: { email: true },
        });

        await notifyOwnerAssetPublished({
          assetId: params.id,
          assetTitle: updatedAsset.title,
          ownerId: updatedAsset.ownerId,
          ownerEmail: owner?.email || undefined,
          status: body.status,
          previousStatus,
        }).catch((error) => {
          console.error('[API] Error notifying owner:', error);
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { asset: updatedAsset },
    });
  } catch (error: any) {
    console.error('[API] Error updating asset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating asset' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const context = await getAuthContext(session);

    if (!context) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await deleteAsset(params.id, {
      userId: context.userId,
      isAdmin: context.isAdmin,
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Asset deleted successfully' },
    });
  } catch (error: any) {
    console.error('[API] Error deleting asset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting asset' },
      { status: error.message === 'Forbidden' ? 403 : error.message === 'Asset not found' ? 404 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const adminContext = await requireAdmin(session);

    const body = await request.json();

    // Validate moderation input
    if (!body.action || !['APPROVE', 'REJECT'].includes(body.action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid moderation action. Must be APPROVE or REJECT' },
        { status: 400 }
      );
    }

    const asset = await moderateAsset(
      params.id,
      {
        action: body.action,
        comment: body.comment || undefined,
        suggestedPriceMin: body.suggestedPriceMin || undefined,
        suggestedPriceMax: body.suggestedPriceMax || undefined,
      },
      {
        userId: adminContext.userId,
        isAdmin: true,
      }
    );

    return NextResponse.json({
      success: true,
      data: { asset },
    });
  } catch (error: any) {
    console.error('[API] Error moderating asset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error moderating asset' },
      { status: error.message === 'Forbidden: Admin access required' ? 403 : error.message === 'Asset not found' ? 404 : 500 }
    );
  }
}

