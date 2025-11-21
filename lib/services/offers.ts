// @ts-nocheck
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const DEFAULT_PAGE_SIZE = 12;

type ListParams = {
  page?: number;
  pageSize?: number;
  status?: Prisma.OfferWhereInput['status'];
};

export async function listOffers(params: ListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? DEFAULT_PAGE_SIZE);
  const where: Prisma.OfferWhereInput = {};

  if (params.status) {
    where.status = params.status;
  } else {
    where.status = 'ACTIVE';
  }

  const [items, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      include: { asset: true, seller: true, buyer: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.offer.count({ where })
  ]);

  return {
    items,
    page,
    pageSize,
    total
  };
}

export function getOfferById(id: string) {
  return prisma.offer.findUnique({
    where: { id },
    include: { asset: true, seller: true, buyer: true }
  });
}

export function getOfferBySlug(slug: string) {
  return prisma.offer.findFirst({
    where: { asset: { slug }, status: 'ACTIVE' },
    include: { asset: true, seller: true, buyer: true }
  });
}

export function createOffer(data: Prisma.OfferCreateInput) {
  return prisma.offer.create({ data });
}

export function updateOffer(id: string, data: Prisma.OfferUpdateInput) {
  return prisma.offer.update({ where: { id }, data });
}
