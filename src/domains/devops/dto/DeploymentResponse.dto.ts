/**
 * Deployment Response DTO
 *
 * Response data transfer objects for deployment API responses.
 */

import type { DeploymentDto, DeploymentSummaryDto, DeploymentDetailDto } from './Deployment.dto';

/**
 * Deployment response DTO.
 */
export type DeploymentResponseDto = DeploymentDto;

/**
 * Deployment summary response DTO.
 */
export type DeploymentSummaryResponseDto = DeploymentSummaryDto;

/**
 * Deployment detail response DTO.
 */
export type DeploymentDetailResponseDto = DeploymentDetailDto;

/**
 * Paginated deployment response.
 */
export interface DeploymentPaginatedResponseDto {
  items: DeploymentDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}