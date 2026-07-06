/**
 * Production Response DTO
 *
 * Data transfer objects for production operations.
 */

import type { CertificateDto } from './Certificate.dto';
import type { ChecklistDto } from './Checklist.dto';
import type { SnapshotDto } from './Snapshot.dto';
import type { ProductionStatistics } from '../types/ProductionStatistics';
import type { ProductionStatus } from '../types/ProductionStatus';

/**
 * DTO for production status response.
 */
export interface ProductionStatusResponseDto {
  status: ProductionStatus;
  statistics: ProductionStatistics;
  latestCertificate?: CertificateDto;
  latestSnapshot?: SnapshotDto;
}

/**
 * DTO for production overview response.
 */
export interface ProductionOverviewResponseDto {
  status: ProductionStatus;
  statistics: ProductionStatistics;
  recentCertificates: CertificateDto[];
  recentChecklists: ChecklistDto[];
  recentSnapshots: SnapshotDto[];
}

/**
 * DTO for production readiness response.
 */
export interface ProductionReadinessResponseDto {
  isReady: boolean;
  readinessPercentage: number;
  criticalBlockers: string[];
  warnings: string[];
  recommendations: string[];
  statistics: ProductionStatistics;
}
