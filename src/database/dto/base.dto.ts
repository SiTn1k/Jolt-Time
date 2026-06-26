/**
 * Base DTO
 *
 * Base Data Transfer Object types.
 */

/**
 * Base create DTO marker interface.
 */
export interface BaseCreateDto {
  readonly id?: string;
  readonly createdAt?: Date;
}

/**
 * Base update DTO marker interface.
 */
export interface BaseUpdateDto {
  readonly updatedAt?: Date;
}

/**
 * Base response DTO marker interface.
 */
export interface BaseResponseDto {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Pagination request DTO.
 */
export interface PaginationDto {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Cursor pagination request DTO.
 */
export interface CursorPaginationDto {
  cursor?: string;
  limit?: number;
}

/**
 * Paginated response DTO.
 */
export interface PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Cursor paginated response DTO.
 */
export interface CursorPaginatedResponseDto<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Search request DTO.
 */
export interface SearchDto {
  term: string;
  fields: string[];
  exactMatch?: boolean;
}

/**
 * Filter DTO for query filtering.
 */
export interface FilterDto {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'notIn' | 'isNull' | 'isNotNull';
  value: unknown;
}

/**
 * Sort DTO for query sorting.
 */
export interface SortDto {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Query options DTO combining all query parameters.
 */
export interface QueryOptionsDto {
  filters?: FilterDto[];
  sorts?: SortDto[];
  pagination?: PaginationDto;
  cursorPagination?: CursorPaginationDto;
  search?: SearchDto;
  select?: string[];
}

/**
 * Timestamp DTO helper.
 */
export interface TimestampDto {
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Soft deletable DTO helper.
 */
export interface SoftDeletableDto extends TimestampDto {
  deletedAt?: Date | string;
  isDeleted: boolean;
}