/**
 * Certificate Mapper
 *
 * Maps between ProductionCertificate entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type {
  ProductionCertificate,
  ProductionCertificateRecord,
} from '../entities/ProductionCertificate';
import type {
  CertificateDto,
  CertificateResponseDto,
  CertificateListResponseDto,
} from '../dto/Certificate.dto';

/**
 * Mapper for converting between ProductionCertificate entity and DTOs.
 */
export class CertificateMapper {
  /**
   * Converts a ProductionCertificate entity to CertificateDto.
   */
  public static toDto(certificate: ProductionCertificate): CertificateDto {
    return {
      certificateId: certificate.certificateId.value,
      version: certificate.version,
      status: certificate.status,
      issuedAt: certificate.issuedAt.toISOString(),
      approvedBy: certificate.approvedBy,
      metadata: certificate.metadata,
      productionStatus: certificate.productionStatus,
      expiresAt: certificate.expiresAt?.toISOString() ?? null,
      createdAt: certificate.createdAt.toISOString(),
      updatedAt: certificate.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ProductionCertificate entity to CertificateResponseDto.
   */
  public static toResponse(certificate: ProductionCertificate): CertificateResponseDto {
    return {
      certificate: this.toDto(certificate),
    };
  }

  /**
   * Converts a ProductionCertificate entity to a database record format.
   */
  public static toRecord(certificate: ProductionCertificate): ProductionCertificateRecord {
    return certificate.toRecord();
  }

  /**
   * Converts a database record to CertificateDto.
   */
  public static fromRecordToDto(record: ProductionCertificateRecord): CertificateDto {
    return {
      certificateId: record.certificateId,
      version: record.version,
      status: record.status,
      issuedAt: record.issuedAt,
      approvedBy: record.approvedBy,
      metadata: record.metadata,
      productionStatus: record.productionStatus,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of ProductionCertificate entities to CertificateListResponseDto.
   */
  public static toListResponse(
    certificates: ProductionCertificate[],
    total: number,
    page: number,
    pageSize: number
  ): CertificateListResponseDto {
    return {
      certificates: certificates.map((certificate) => this.toDto(certificate)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
