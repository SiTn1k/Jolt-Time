/**
 * JobDefinitionDto
 *
 * Data transfer object for job definition responses.
 */

import type { SchedulerDefinitionMetadata } from '../types/SchedulerMetadata';

/**
 * Response DTO for a job definition.
 */
export interface JobDefinitionDto {
  definitionId: string;
  name: string;
  description: string;
  handler: string;
  retryLimit: number;
  timeout: number;
  metadata: SchedulerDefinitionMetadata;
}

/**
 * Response DTO for job definition list.
 */
export interface JobDefinitionListDto {
  definitions: JobDefinitionDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for creating a new job definition.
 */
export interface CreateJobDefinitionDto {
  name: string;
  description: string;
  handler: string;
  retryLimit?: number;
  timeout?: number;
  metadata?: SchedulerDefinitionMetadata;
}

/**
 * DTO for updating a job definition.
 */
export interface UpdateJobDefinitionDto {
  name?: string;
  description?: string;
  handler?: string;
  retryLimit?: number;
  timeout?: number;
  metadata?: SchedulerDefinitionMetadata;
}
