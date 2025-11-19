import type { Prisma, Profile } from '@prisma/client';
import prisma from '@/lib/prisma';

export function getProfileByUserId(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
    include: { user: true }
  });
}

export function createProfile(data: Prisma.ProfileCreateInput): Promise<Profile> {
  return prisma.profile.create({ data });
}

export function updateProfile(userId: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
  return prisma.profile.update({
    where: { userId },
    data
  });
}

export function listProfiles() {
  return prisma.profile.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
}
