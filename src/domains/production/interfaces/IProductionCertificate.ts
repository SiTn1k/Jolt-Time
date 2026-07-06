/**
 * IProductionCertificate Interface
 *
 * Interface for ProductionCertificate domain entity.
 */

import type { CertificateId } from '../value-objects/CertificateId';
import type { CertificationStatus } from '../types/CertificationStatus';
import type { ProductionStatus } from '../types/ProductionStatus';
import type { CertificateMetadata } from '../types/ProductionMetadata';

/**
 * ProductionCertificate entity interface.
 */
export interface IProductionCertificate {
  /** Unique certificate identifier */
  readonly certificateId: CertificateId;
  /** Version string */
  readonly version: string;
  /** Certification status */
  readonly status: CertificationStatus;
  /** Date when certificate was issued */
  readonly issuedAt: Date;
  /** Who approved the certificate */
  readonly approvedBy: string;
  /** Additional metadata */
  readonly metadata: CertificateMetadata;
  /** Current production status */
  readonly productionStatus: ProductionStatus;
  /** Expiration date if applicable */
  readonly expiresAt: Date | null;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /** Whether the certificate is valid */
  readonly isValid: boolean;
  /** Whether the certificate is expired */
  readonly isExpired: boolean;
  /** Whether the certificate is in production */
  readonly isInProduction: boolean;

  /**
   * Checks if the certificate is valid (not expired and certified).
   */
  isValidCertificate(): boolean;
}
