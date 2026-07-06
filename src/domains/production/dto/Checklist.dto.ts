/**
 * Checklist DTO
 *
 * Data transfer objects for checklist operations.
 */

import type { ChecklistMetadata } from '../types/ProductionMetadata';
import type { ChecklistStatus } from '../types/ChecklistStatus';

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
 * DTO for creating a checklist item.
 */
export interface CreateChecklistDto {
  title: string;
  status?: ChecklistStatus;
  owner?: string;
  metadata?: ChecklistMetadata;
}

/**
 * DTO for updating a checklist item.
 */
export interface UpdateChecklistDto {
  title?: string;
  status?: ChecklistStatus;
  owner?: string;
  metadata?: ChecklistMetadata;
}

/**
 * Validation rules for creating a checklist item.
 */
export const CREATE_CHECKLIST_VALIDATION = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  owner: {
    required: false,
    maxLength: 100,
  },
} as const;
