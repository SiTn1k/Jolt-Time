/**
 * Milestone DTO
 *
 * Data transfer objects for milestone operations.
 */

import type { MilestoneStatus } from '../types/MilestoneStatus';
import type { MilestoneMetadata } from '../types/AlphaMetadata';

/**
 * DTO for milestone data.
 */
export interface MilestoneDto {
  milestoneId: string;
  title: string;
  status: MilestoneStatus;
  targetDate: string | null;
  completedAt: string | null;
  metadata: MilestoneMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for milestone response.
 */
export interface MilestoneResponseDto {
  milestone: MilestoneDto;
}

/**
 * DTO for milestone list response.
 */
export interface MilestoneListResponseDto {
  milestones: MilestoneDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Validation rules for milestone creation.
 */
export const CREATE_MILESTONE_VALIDATION = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  targetDate: {
    required: false,
    isDate: true,
  },
  status: {
    required: false,
    allowedValues: ['planned', 'in_progress', 'completed', 'delayed', 'cancelled'],
  },
} as const;
