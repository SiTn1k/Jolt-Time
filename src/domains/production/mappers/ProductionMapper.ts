/**
 * Production Mapper
 *
 * Maps between Production domain entities and various DTOs.
 * No database logic - pure transformation only.
 */

import type { ProductionCertificate } from '../entities/ProductionCertificate';
import type { ProductionChecklist } from '../entities/ProductionChecklist';
import type { ProductionSnapshot } from '../entities/ProductionSnapshot';
import type { ProductionStatistics } from '../types/ProductionStatistics';
import type { ProductionStatus } from '../types/ProductionStatus';
import type { ProductionStatusResponseDto } from '../dto/ProductionResponse.dto';
import { CertificateMapper } from './CertificateMapper';
import { ChecklistMapper } from './ChecklistMapper';
import { SnapshotMapper } from './SnapshotMapper';

/**
 * Mapper for production-level operations.
 */
export class ProductionMapper {
  /**
   * Creates a production status response DTO.
   */
  public static toStatusResponse(
    status: ProductionStatus,
    statistics: ProductionStatistics,
    latestCertificate?: ProductionCertificate,
    latestSnapshot?: ProductionSnapshot
  ): ProductionStatusResponseDto {
    return {
      status,
      statistics,
      latestCertificate: latestCertificate
        ? CertificateMapper.toDto(latestCertificate)
        : undefined,
      latestSnapshot: latestSnapshot
        ? SnapshotMapper.toDto(latestSnapshot)
        : undefined,
    };
  }

  /**
   * Creates an overview response DTO.
   */
  public static toOverviewResponse(
    status: ProductionStatus,
    statistics: ProductionStatistics,
    recentCertificates: ProductionCertificate[],
    recentChecklists: ProductionChecklist[],
    recentSnapshots: ProductionSnapshot[]
  ): {
    status: ProductionStatus;
    statistics: ProductionStatistics;
    recentCertificates: ReturnType<typeof CertificateMapper.toDto>[];
    recentChecklists: ReturnType<typeof ChecklistMapper.toDto>[];
    recentSnapshots: ReturnType<typeof SnapshotMapper.toDto>[];
  } {
    return {
      status,
      statistics,
      recentCertificates: recentCertificates.map((c) => CertificateMapper.toDto(c)),
      recentChecklists: recentChecklists.map((c) => ChecklistMapper.toDto(c)),
      recentSnapshots: recentSnapshots.map((s) => SnapshotMapper.toDto(s)),
    };
  }
}
