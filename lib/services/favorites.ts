import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { offer: { include: { asset: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function isFavorite(userId: string, offerId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_offerId: {
        userId,
        offerId
      }
    }
  });
  return !!favorite;
}

export async function addFavorite(userId: string, offerId: string) {
  try {
    return await prisma.favorite.create({
      data: {
        userId,
        offerId
      },
      include: { offer: { include: { asset: true } } }
    });
  } catch (error: any) {
    // If already exists, return existing
    if (error.code === 'P2002') {
      return prisma.favorite.findUnique({
        where: {
          userId_offerId: {
            userId,
            offerId
          }
        }
      });
    }
    throw error;
  }
}

export async function removeFavorite(userId: string, offerId: string) {
  return prisma.favorite.delete({
    where: {
      userId_offerId: {
        userId,
        offerId
      }
    }
  });
}

export async function getFavoriteOfferIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { offerId: true }
  });
  return favorites.map((f) => f.offerId);
}

