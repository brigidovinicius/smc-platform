/**
 * Lead Domain Service
 * 
 * Core business logic for lead management.
 */

import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { handleNewLeadSideEffects } from '@/lib/leads/sideEffects';

export interface LeadContext {
  userId?: string;
  isAdmin?: boolean;
}

export interface CreateLeadInput {
  assetId: string;
  name: string;
  email: string;
  buyerType?: string;
  budgetRange?: string;
  message: string;
  source?: string;
}

export interface LeadFilters {
  assetId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Create a new lead
 */
export async function createLead(input: CreateLeadInput, context?: LeadContext) {
  // Verify asset exists
  const asset = await prisma.asset.findUnique({
    where: { id: input.assetId },
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

  if (!asset) {
    throw new Error('Asset not found');
  }

  // Create lead
  const lead = await prisma.lead.create({
    data: {
      assetId: input.assetId,
      name: input.name,
      email: input.email,
      buyerType: (input.buyerType || 'OTHER') as any,
      budgetRange: input.budgetRange || null,
      message: input.message,
      source: input.source || 'marketplace',
      status: 'NEW',
    },
    include: {
      asset: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  // Handle side effects (notifications, etc.)
  // Convert to LeadWithAsset format
  const leadWithAsset = {
    ...lead,
    asset: lead.asset ? {
      id: lead.asset.id,
      title: lead.asset.title,
      slug: lead.asset.slug,
    } : undefined,
  };

  await handleNewLeadSideEffects(leadWithAsset).catch((error) => {
    // Log but don't fail the lead creation
    console.error('[Lead Service] Error in side effects:', error);
  });

  return lead;
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string, context?: LeadContext) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      asset: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!lead) {
    return null;
  }

  // Only asset owner or admin can view leads
  if (context) {
    if (context.isAdmin) {
      return lead;
    }
    if (context.userId && lead.asset.ownerId === context.userId) {
      return lead;
    }
  }

  return null;
}

/**
 * List leads with filters
 */
export async function listLeads(filters: LeadFilters, context?: LeadContext) {
  const where: Prisma.LeadWhereInput = {};

  if (filters.assetId) {
    where.assetId = filters.assetId;
  }

  if (filters.status) {
    where.status = filters.status as any;
  }

  // If not admin, only show leads for user's assets
  if (context && !context.isAdmin && context.userId) {
    const userAssets = await prisma.asset.findMany({
      where: { ownerId: context.userId },
      select: { id: true },
    });
    where.assetId = {
      in: userAssets.map((a) => a.id),
    };
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            slug: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    total,
    limit,
    offset,
  };
}

/**
 * Advance lead status
 */
export async function advanceLeadStatus(
  id: string,
  newStatus: string,
  context: LeadContext
) {
  if (!context.userId) {
    throw new Error('Unauthorized');
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      asset: true,
    },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  // Only asset owner or admin can update lead status
  if (!context.isAdmin && lead.asset.ownerId !== context.userId) {
    throw new Error('Forbidden');
  }

  return await prisma.lead.update({
    where: { id },
    data: {
      status: newStatus as any,
    },
    include: {
      asset: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}

