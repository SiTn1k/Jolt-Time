/**
 * CertificationStatus Type
 *
 * Defines the certification status for production readiness.
 */

/**
 * Certification status values.
 */
export enum CertificationStatus {
  /** Not certified */
  NOT_CERTIFIED = 'not_certified',
  /** Under review */
  UNDER_REVIEW = 'under_review',
  /** Certified */
  CERTIFIED = 'certified',
  /** Revoked */
  REVOKED = 'revoked',
  /** Expired */
  EXPIRED = 'expired',
}

/**
 * Status display names.
 */
export const CERTIFICATION_STATUS_DISPLAY: Record<CertificationStatus, string> = {
  [CertificationStatus.NOT_CERTIFIED]: 'Not Certified',
  [CertificationStatus.UNDER_REVIEW]: 'Under Review',
  [CertificationStatus.CERTIFIED]: 'Certified',
  [CertificationStatus.REVOKED]: 'Revoked',
  [CertificationStatus.EXPIRED]: 'Expired',
};

/**
 * Checks if a status represents a valid certification.
 */
export function isValidCertification(status: CertificationStatus): boolean {
  return status === CertificationStatus.CERTIFIED;
}

/**
 * Checks if a status represents an active certification.
 */
export function isActiveCertification(status: CertificationStatus): boolean {
  return status === CertificationStatus.UNDER_REVIEW || status === CertificationStatus.CERTIFIED;
}
