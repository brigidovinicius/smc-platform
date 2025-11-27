/**
 * Legacy asset service - DEPRECATED
 * 
 * This file is kept for backward compatibility but should be migrated to use
 * src/core/assets/asset.service.ts instead.
 * 
 * @deprecated Use src/core/assets/asset.service.ts
 */

import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const DEFAULT_PAGE_SIZE = 12;

type ListParams = {
  page?: number;
  pageSize?: number;
  category?: string;
};

/**
 * @deprecated Use src/core/assets/asset.service.ts listAssets
 */
export async function listAssets(params: ListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? DEFAULT_PAGE_SIZE);
  const where: Prisma.AssetWhereInput = {};

  if (params.category) {
    // Map legacy category to type if needed
    where.type = params.category as any;
  }

  const [items, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: { 
        owner: true,
        // Note: offers relation doesn't exist on Asset, only on SaaSAsset
        // This is a breaking change that needs to be handled
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.asset.count({ where })
  ]);

  return {
    items,
    page,
    pageSize,
    total
  };
}

/**
 * @deprecated Use src/core/assets/asset.service.ts getAssetByIdOrSlug
 */
export async function getAssetById(id: string) {
  return prisma.asset.findUnique({
    where: { id },
    include: { 
      owner: true,
      // Note: offers relation doesn't exist on Asset
    }
  });
}

/**
 * @deprecated Use src/core/assets/asset.service.ts getAssetByIdOrSlug
 */
export async function getAssetBySlug(slug: string) {
  return prisma.asset.findUnique({
    where: { slug },
    include: { 
      owner: true,
      // Note: offers relation doesn't exist on Asset
    }
  });
}

/**
 * @deprecated Use src/core/assets/asset.service.ts createAsset
 */
export async function createAsset(data: Prisma.AssetCreateInput) {
  return prisma.asset.create({ data });
}

/**
 * @deprecated Use src/core/assets/asset.service.ts updateAsset
 */
export async function updateAsset(id: string, data: Prisma.AssetUpdateInput) {
  return prisma.asset.update({ where: { id }, data });
}
