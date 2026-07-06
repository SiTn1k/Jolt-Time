/**
 * Release DTO
 *
 * Data transfer objects for release operations.
 */

import type { ReleaseStatus } from '../types/ReleaseStatus';
import type { ReleaseStage } from '../types/ReleaseStage';
import type { ReleaseMetadata } from '../types/ReleaseMetadata';

/**
 * DTO for release candidate data.
 */
export interface ReleaseCandidateDto {
  releaseId: string;
  version: string;
  status: ReleaseStatus;
  stage: ReleaseStage;
  createdAt: string;
  approvedAt: string | null;
  metadata: ReleaseMetadata;
  updatedAt: string;
}

/**
 * DTO for release candidate response.
 */
export interface ReleaseResponseDto {
  release: ReleaseCandidateDto;
}

/**
 * DTO for release candidate list response.
 */
export interface ReleaseListResponseDto {
  releases: ReleaseCandidateDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Validation rules for release creation.
 */
export const CREATE_RELEASE_VALIDATION = {
  version: {
    required: true,
    pattern: /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/,
    description: 'Semantic version (e.g., 1.0.0, 1.0.0-beta.1)',
  },
  status: {
    required: false,
    allowedValues: ['draft', 'pending_approval', 'approved', 'rejected', 'published', 'archived'],
  },
  stage: {
    required: false,
    allowedValues: ['support', 'internal_alpha', 'closed_alpha', 'open_alpha', 'release_candidate', 'production'],
  },
} as const;
