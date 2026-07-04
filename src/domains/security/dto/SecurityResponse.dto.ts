/**
 * Security Response DTO
 *
 * Data Transfer Object for security domain responses.
 */

import type { SecurityStatistics } from '../types/SecurityStatistics';
import type { SecurityIncidentResponseDto } from './SecurityIncident.dto';
import type { SecurityPolicyResponseDto } from './SecurityPolicy.dto';
import type { SecuritySessionResponseDto } from './SecuritySession.dto';

/**
 * DTO for security statistics response.
 */
export interface SecurityStatisticsResponseDto {
  statistics: SecurityStatistics;
}

/**
 * DTO for security incidents list response.
 */
export interface SecurityIncidentsListResponseDto {
  incidents: SecurityIncidentResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for security policies list response.
 */
export interface SecurityPoliciesListResponseDto {
  policies: SecurityPolicyResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for security sessions list response.
 */
export interface SecuritySessionsListResponseDto {
  sessions: SecuritySessionResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
