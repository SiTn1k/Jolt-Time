/**
 * Admin Response DTO
 *
 * General response DTOs for admin domain operations.
 */

import type { AdminAccountResponseDto } from './AdminAccount.dto';
import type { AdminRoleResponseDto } from './AdminRole.dto';
import type { AdminPermissionResponseDto } from './AdminPermission.dto';
import type { AdminStatistics } from '../types/AdminStatistics';

/**
 * Generic admin operation response.
 */
export interface AdminOperationResponseDto {
  /** Whether the operation was successful */
  success: boolean;

  /** Response message */
  message: string;

  /** Timestamp of the operation */
  timestamp: string;
}

/**
 * Admin login response DTO.
 */
export interface AdminLoginResponseDto {
  /** Admin account data */
  admin: AdminAccountResponseDto;

  /** Session token */
  sessionToken?: string;

  /** Session expiry */
  expiresAt?: string;
}

/**
 * Admin statistics response DTO.
 */
export interface AdminStatisticsResponseDto {
  /** Statistics data */
  statistics: AdminStatistics;

  /** Timestamp of the statistics */
  generatedAt: string;
}

/**
 * Admin bulk operation request DTO.
 */
export interface AdminBulkOperationDto {
  /** List of admin IDs to operate on */
  adminIds: string[];

  /** Operation to perform */
  operation: 'activate' | 'deactivate' | 'suspend' | 'delete';

  /** Reason for the operation */
  reason?: string;
}

/**
 * Admin bulk operation response DTO.
 */
export interface AdminBulkOperationResponseDto {
  /** Number of admins affected */
  affectedCount: number;

  /** List of admin IDs that were affected */
  affectedIds: string[];

  /** List of admin IDs that failed */
  failedIds: string[];

  /** Error messages for failed operations */
  errors: Record<string, string>;
}

/**
 * Admin search request DTO.
 */
export interface AdminSearchRequestDto {
  /** Search query */
  query?: string;

  /** Filter by status */
  status?: string;

  /** Filter by role type */
  roleType?: string;

  /** Filter by department */
  department?: string;

  /** Pagination params */
  page?: number;
  pageSize?: number;
}

/**
 * Admin search response DTO.
 */
export interface AdminSearchResponseDto {
  /** List of matching admins */
  results: AdminAccountResponseDto[];

  /** Total matches */
  total: number;

  /** Search query used */
  query: string;
}