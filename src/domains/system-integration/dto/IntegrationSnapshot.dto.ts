/**
 * IntegrationSnapshot DTOs
 *
 * Data transfer objects for integration snapshot operations.
 */

import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Create integration snapshot request DTO.
 */
export interface CreateIntegrationSnapshotDto {
  /** List of registered module IDs */
  registeredModules?: string[];

  /** List of healthy module IDs */
  healthyModules?: string[];

  /** List of failed module IDs */
  failedModules?: string[];

  /** Snapshot metadata */
  metadata?: Partial<IntegrationMetadata>;
}

/**
 * Integration snapshot response DTO.
 */
export interface IntegrationSnapshotResponseDto {
  /** Unique snapshot identifier */
  snapshotId: string;

  /** Snapshot creation timestamp */
  createdAt: string;

  /** List of registered module IDs */
  registeredModules: string[];

  /** List of healthy module IDs */
  healthyModules: string[];

  /** List of failed module IDs */
  failedModules: string[];

  /** Total registered count */
  registeredCount: number;

  /** Total healthy count */
  healthyCount: number;

  /** Total failed count */
  failedCount: number;

  /** Health percentage */
  healthPercentage: number;

  /** Snapshot metadata */
  metadata: IntegrationMetadata;
}

/**
 * Integration snapshot list response with pagination.
 */
export interface IntegrationSnapshotListResponseDto {
  /** List of integration snapshots */
  snapshots: IntegrationSnapshotResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
