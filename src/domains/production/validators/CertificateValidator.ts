/**
 * Certificate Validator
 *
 * Validates certificate data according to production certification rules.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of certificate validation.
 */
export interface CertificateValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for certificate data.
 */
export class CertificateValidator {
  /**
   * Validates a certificate ID format.
   */
  public static isValidCertificateId(certificateId: string | null | undefined): boolean {
    if (!certificateId || certificateId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(certificateId);
  }

  /**
   * Validates a version string.
   */
  public static isValidVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    // Version format: x.y.z or x.y.z-beta/alpha/rc
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z]+)?$/;
    return versionRegex.test(version);
  }

  /**
   * Validates an approvedBy field.
   */
  public static isValidApprovedBy(approvedBy: string | null | undefined): boolean {
    if (!approvedBy || approvedBy.trim().length === 0) {
      return false;
    }
    return approvedBy.length >= 2 && approvedBy.length <= 100;
  }

  /**
   * Validates a complete certificate.
   */
  public static validate(data: {
    certificateId?: string;
    version?: string;
    approvedBy?: string;
  }): CertificateValidationResult {
    const errors: string[] = [];

    if (data.certificateId !== undefined) {
      if (!data.certificateId || data.certificateId.trim().length === 0) {
        errors.push('Certificate ID is required');
      } else if (!UUID_REGEX.test(data.certificateId)) {
        errors.push('Certificate ID must be a valid UUID');
      }
    }

    if (data.version !== undefined) {
      if (!data.version || data.version.trim().length === 0) {
        errors.push('Version is required');
      } else if (!this.isValidVersion(data.version)) {
        errors.push('Version must be in format x.y.z or x.y.z-suffix');
      }
    }

    if (data.approvedBy !== undefined) {
      if (!data.approvedBy || data.approvedBy.trim().length === 0) {
        errors.push('Approved by is required');
      } else if (!this.isValidApprovedBy(data.approvedBy)) {
        errors.push('Approved by must be between 2 and 100 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates certificate data and throws if invalid.
   */
  public static validateOrThrow(data: {
    certificateId?: string;
    version?: string;
    approvedBy?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Certificate validation failed: ${result.errors.join('; ')}`);
    }
  }
}
