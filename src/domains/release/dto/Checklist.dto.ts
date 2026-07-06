/**
 * Checklist DTO
 *
 * Data transfer objects for checklist operations.
 */

import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/ReleaseMetadata';

/**
 * DTO for checklist data.
 */
export interface ReleaseChecklistDto {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  owner: string;
  completedAt: string | null;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for checklist response.
 */
export interface ChecklistResponseDto {
  checklist: ReleaseChecklistDto;
}

/**
 * DTO for checklist list response.
 */
export interface ChecklistListResponseDto {
  checklists: ReleaseChecklistDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Validation rules for checklist creation.
 */
export const CREATE_CHECKLIST_VALIDATION = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  owner: {
    required: false,
    maxLength: 100,
  },
  status: {
    required: false,
    allowedValues: ['pending', 'in_progress', 'completed', 'blocked', 'skipped'],
  },
} as const;
