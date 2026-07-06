/**
 * HardeningChecklist DTO
 *
 * Data transfer objects for hardening checklist operations.
 */

import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/HardeningMetadata';

/**
 * DTO for hardening checklist data.
 */
export interface HardeningChecklistDto {
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
 * DTO for hardening checklist response.
 */
export interface HardeningChecklistResponseDto {
  checklist: HardeningChecklistDto;
}

/**
 * DTO for hardening checklist list response.
 */
export interface HardeningChecklistListResponseDto {
  checklists: HardeningChecklistDto[];
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
    minLength: 3,
    maxLength: 200,
    description: 'Checklist title (3-200 characters)',
  },
  status: {
    required: false,
    allowedValues: ['pending', 'in_progress', 'completed', 'blocked', 'skipped'],
  },
  owner: {
    required: false,
    maxLength: 100,
    description: 'Owner responsible for this item (max 100 characters)',
  },
} as const;
