/**
 * API Route: /api/admin/assets
 * Admin-only asset listing (App Router)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { requireAdmin } from '@/src/core/auth/auth.service';
import { listAssets } from '@/src/core/assets/asset.service';
import { parsePaginationParams, calculatePagination, createPaginatedResponse } from '@/lib/api/pagination';
import { parseSortParams, validateFilterParams } from '@/lib/api/filters';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminContext = await requireAdmin(session);

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize')) || 20));
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') || undefined;

    // Validação de filtros
    const filterValidation = validateFilterParams(
      { category: category as string },
      ['SaaS', 'E-commerce', 'Marketplace', 'Newsletter', 'Course']
    );
    
    if (!filterValidation.valid) {
      return NextResponse.json(
        { success: false, error: filterValidation.error, code: 'INVALID_FILTER' },
        { status: 400 }
      );
    }

    // Build filters
    const filters: any = {
      type: category ? category : undefined,
      status: status ? status : undefined,
      search: search || undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };

    const result = await listAssets(filters, {
      userId: adminContext.userId,
      isAdmin: true,
    });

    // Serialize Decimal to string/number for JSON serialization
    const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
    ));

    const pagination = calculatePagination(page, pageSize, result.total);
    const response = createPaginatedResponse(serialize(result.assets), pagination);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error('[API] Error fetching admin assets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error fetching assets',
        code: error.message === 'Forbidden: Admin access required' ? 'FORBIDDEN' : 'INTERNAL_ERROR'
      },
      { status: error.message === 'Forbidden: Admin access required' ? 403 : 500 }
    );
  }
}

