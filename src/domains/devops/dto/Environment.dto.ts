/**
 * Environment DTO
 *
 * Data transfer object for environment data.
 */

import type { EnvironmentType } from '../types/EnvironmentType';
import type { EnvironmentConfiguration } from '../entities/Environment';

/**
 * Environment data transfer object.
 */
export interface EnvironmentDto {
  environmentId: string;
  name: string;
  type: EnvironmentType;
  status: 'active' | 'inactive';
  configuration: EnvironmentConfiguration;
  metadata: EnvironmentMetadataDto;
  createdAt: string;
  updatedAt: string;
}

/**
 * Environment metadata data transfer object.
 */
export interface EnvironmentMetadataDto {
  owner?: string;
  costCenter?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Summary environment data transfer object.
 */
export interface EnvironmentSummaryDto {
  environmentId: string;
  name: string;
  type: EnvironmentType;
  status: 'active' | 'inactive';
}

/**
 * Environment detail data transfer object.
 */
export interface EnvironmentDetailDto extends EnvironmentDto {
  deploymentCount: number;
}