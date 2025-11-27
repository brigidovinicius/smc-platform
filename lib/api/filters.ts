/**
 * Helpers para filtros e busca em API routes
 */

import type { Prisma } from '@prisma/client';

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Aplica filtro de busca em campos de texto
 */
export function applySearchFilter<T>(
  search: string | undefined,
  fields: (keyof T)[]
): Prisma.StringFilter | undefined {
  if (!search || !fields.length) return undefined;

  return {
    contains: search,
    mode: 'insensitive'
  };
}

/**
 * Valida e normaliza parâmetros de ordenação
 */
export function parseSortParams(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  defaultSort: string = 'createdAt',
  allowedFields: string[] = []
): { orderBy: any } {
  const validSortBy = sortBy && allowedFields.includes(sortBy) 
    ? sortBy 
    : defaultSort;
  
  const validSortOrder = sortOrder === 'asc' || sortOrder === 'desc'
    ? sortOrder
    : 'desc';

  return {
    orderBy: {
      [validSortBy]: validSortOrder
    }
  };
}

/**
 * Valida parâmetros de filtro
 */
export function validateFilterParams(
  params: FilterParams,
  allowedCategories?: string[],
  allowedStatuses?: string[]
): { valid: boolean; error?: string } {
  if (params.category && allowedCategories && !allowedCategories.includes(params.category)) {
    return {
      valid: false,
      error: `Invalid category. Allowed: ${allowedCategories.join(', ')}`
    };
  }

  if (params.status && allowedStatuses && !allowedStatuses.includes(params.status)) {
    return {
      valid: false,
      error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
    };
  }

  return { valid: true };
}

