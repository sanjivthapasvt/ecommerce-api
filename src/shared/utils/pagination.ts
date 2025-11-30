export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Computes offset and sanitized values for pagination.
 */
export function getPagination(input: PaginationInput = {}): PaginationOptions {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;

  const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
  const limit = input.limit && input.limit > 0 ? input.limit : DEFAULT_LIMIT;

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

/**
 * Formats paginated results with metadata.
 */
export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
