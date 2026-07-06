/**
 * Certificate DTO
 *
 * Data transfer objects for certificate operations.
 */

import type { CertificateMetadata } from '../types/ProductionMetadata';
import type { CertificationStatus } from '../types/CertificationStatus';
import type { ProductionStatus } from '../types/ProductionStatus';

/**
 * DTO for certificate data.
 */
export interface CertificateDto {
  certificateId: string;
  version: string;
  status: CertificationStatus;
  issuedAt: string;
  approvedBy: string;
  metadata: CertificateMetadata;
  productionStatus: ProductionStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for certificate response.
 */
export interface CertificateResponseDto {
  certificate: CertificateDto;
}

/**
 * DTO for certificate list response.
 */
export interface CertificateListResponseDto {
  certificates: CertificateDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for creating a certificate.
 */
export interface CreateCertificateDto {
  version: string;
  approvedBy: string;
  metadata?: CertificateMetadata;
  productionStatus?: ProductionStatus;
  expiresAt?: string;
}

/**
 * DTO for updating a certificate.
 */
export interface UpdateCertificateDto {
  version?: string;
  status?: CertificationStatus;
  approvedBy?: string;
  metadata?: CertificateMetadata;
  productionStatus?: ProductionStatus;
  expiresAt?: string | null;
}

/**
 * Validation rules for creating a certificate.
 */
export const CREATE_CERTIFICATE_VALIDATION = {
  version: {
    required: true,
    pattern: /^\d+\.\d+\.\d+(-[a-zA-Z]+)?$/,
    message: 'Version must be in format x.y.z or x.y.z-suffix',
  },
  approvedBy: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
} as const;
