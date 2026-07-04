/**
 * BackupResponseDto
 *
 * Data Transfer Object for backup response operations.
 */

import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { RestoreStatus } from '../types/RestoreStatus';
import type { BackupStatistics } from '../types/BackupStatistics';
import type { BackupSnapshotDto } from './BackupSnapshot.dto';
import type { BackupJobDto } from './BackupJob.dto';
import type { RestorePointDto } from './RestorePoint.dto';

/**
 * DTO for backup operation response.
 */
export interface BackupResponseDto {
  success: boolean;
  message: string;
  snapshot?: BackupSnapshotDto;
  error?: string;
}

/**
 * DTO for restore operation response.
 */
export interface RestoreResponseDto {
  success: boolean;
  message: string;
  restorePoint?: RestorePointDto;
  error?: string;
}

/**
 * DTO for backup statistics response.
 */
export interface BackupStatisticsDto {
  totalSnapshots: number;
  totalStorageBytes: number;
  successfulBackups: number;
  failedBackups: number;
  averageBackupDurationMs: number;
  lastSuccessfulBackup: string | null;
  lastBackupAttempt: string | null;
  storageByProvider: Record<string, number>;
  backupsByType: Record<string, number>;
}

/**
 * DTO for backup status overview.
 */
export interface BackupStatusDto {
  snapshot: BackupSnapshotDto | null;
  job: BackupJobDto | null;
  recentRestorePoints: RestorePointDto[];
  statistics: BackupStatisticsDto;
}

/**
 * DTO for backup operation status check.
 */
export interface BackupOperationStatusDto {
  operationType: 'snapshot' | 'restore';
  status: BackupStatus | RestoreStatus;
  progress: number;
  startedAt: string;
  estimatedCompletion?: string;
  currentStep?: string;
  error?: string;
}
