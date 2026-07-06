/**
 * Checklist DTO
 *
 * Data transfer objects for checklist operations.
 */

import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/AlphaMetadata';

/**
 * DTO for checklist data.
 */
export interface ChecklistDto {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  completedAt: string | null;
  owner: string;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for checklist response.
 */
export interface ChecklistResponseDto {
  checklist: ChecklistDto;
}

/**
 * DTO for checklist list response.
 */
export interface ChecklistListResponseDto {
  checklists: ChecklistDto[];
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
