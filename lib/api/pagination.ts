/**
 * Helpers para paginação em API routes
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/**
 * Valida e normaliza parâmetros de paginação da query
 * Sempre retorna valores não-opcionais com defaults
 */
export function parsePaginationParams(query: any): { page: number; pageSize: number } {
  const page = query.page 
    ? Math.max(1, parseInt(String(query.page), 10)) || DEFAULT_PAGE
    : DEFAULT_PAGE;
  
  const pageSize = query.pageSize || query.page_size || query.limit
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(String(query.pageSize || query.page_size || query.limit), 10)) || DEFAULT_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

/**
 * Calcula metadados de paginação
 */
export function calculatePagination(
  page: number,
  pageSize: number,
  total: number
) {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * Cria resposta paginada padronizada
 */
export function createPaginatedResponse<T>(
  items: T[],
  pagination: ReturnType<typeof calculatePagination>
): PaginatedResponse<T> {
  return {
    items,
    pagination
  };
}

