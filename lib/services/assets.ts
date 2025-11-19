import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const DEFAULT_PAGE_SIZE = 12;

type ListParams = {
  page?: number;
  pageSize?: number;
  category?: string;
};

export async function listAssets(params: ListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? DEFAULT_PAGE_SIZE);
  const where: Prisma.SaaSAssetWhereInput = {};

  if (params.category) {
    where.category = params.category;
  }

  const [items, total] = await Promise.all([
    prisma.saaSAsset.findMany({
      where,
      include: { owner: true, offers: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.saaSAsset.count({ where })
  ]);

  return {
    items,
    page,
    pageSize,
    total
  };
}

export function getAssetById(id: string) {
  return prisma.saaSAsset.findUnique({
    where: { id },
    include: { owner: true, offers: true }
  });
}

export function getAssetBySlug(slug: string) {
  return prisma.saaSAsset.findUnique({
    where: { slug },
    include: { owner: true, offers: true }
  });
}

export function createAsset(data: Prisma.SaaSAssetCreateInput) {
  return prisma.saaSAsset.create({ data });
}

export function updateAsset(id: string, data: Prisma.SaaSAssetUpdateInput) {
  return prisma.saaSAsset.update({ where: { id }, data });
}
