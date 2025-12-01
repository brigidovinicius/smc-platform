/**
 * API Route: /api/assets
 * CRUD operations for assets (App Router)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createAsset, listAssets } from '@/src/core/assets/asset.service';
import { getAuthContext } from '@/src/core/auth/auth.service';
import { AssetCreateSchema, AssetQuerySchema } from '@/lib/schemas/asset';
import { notifyAdminOfNewAsset } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const context = await getAuthContext(session);

    const searchParams = request.nextUrl.searchParams;
    const query = {
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      ownerId: searchParams.get('ownerId') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined,
    };

    const validation = AssetQuerySchema.safeParse(query);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: validation.error },
        { status: 400 }
      );
    }

    const result = await listAssets(validation.data, context || undefined);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[API] Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const validation = AssetCreateSchema.safeParse(body);

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

    // Filter out null values (convert to undefined)
    const createData = Object.fromEntries(
      Object.entries(validation.data).filter(([_, v]) => v !== null)
    ) as any;

    const asset = await createAsset(createData, {
      userId: context.userId,
      isAdmin: context.isAdmin,
    });

    // If status is UNDER_REVIEW, notify admin
    if (asset && asset.status === 'UNDER_REVIEW') {
      await notifyAdminOfNewAsset({
        assetId: asset.id,
        assetTitle: asset.title,
        ownerId: context.userId,
        ownerEmail: context.email || undefined,
        status: asset.status,
      }).catch((error) => {
        console.error('[API] Error notifying admin:', error);
      });
    }

    return NextResponse.json(
      { success: true, data: { asset } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Error creating asset:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error creating asset' },
      { status: 500 }
    );
  }
}

