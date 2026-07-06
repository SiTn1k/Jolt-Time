/**
 * ProductionCertificate Entity
 *
 * Domain entity representing a production certification certificate.
 */

import { CertificateId } from '../value-objects/CertificateId';
import { CertificationStatus } from '../types/CertificationStatus';
import type { CertificateMetadata } from '../types/ProductionMetadata';
import { ProductionStatus } from '../types/ProductionStatus';

/**
 * ProductionCertificate entity props for constructor.
 */
export interface ProductionCertificateProps {
  certificateId: CertificateId;
  version: string;
  status: CertificationStatus;
  issuedAt: Date;
  approvedBy: string;
  metadata: CertificateMetadata;
  productionStatus?: ProductionStatus;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of ProductionCertificate.
 */
export interface ProductionCertificateRecord {
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
 * JSON serialization representation of ProductionCertificate.
 */
export interface ProductionCertificateJSON {
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
 * ProductionCertificate entity class.
 * Immutable domain entity representing a production certification.
 */
export class ProductionCertificate {
  public readonly certificateId: CertificateId;
  public readonly version: string;
  public readonly status: CertificationStatus;
  public readonly issuedAt: Date;
  public readonly approvedBy: string;
  public readonly metadata: CertificateMetadata;
  public readonly productionStatus: ProductionStatus;
  public readonly expiresAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new ProductionCertificate instance.
   */
  constructor(props: ProductionCertificateProps) {
    this.certificateId = props.certificateId;
    this.version = props.version;
    this.status = props.status;
    this.issuedAt = props.issuedAt;
    this.approvedBy = props.approvedBy;
    this.metadata = props.metadata;
    this.productionStatus = props.productionStatus ?? ProductionStatus.NOT_STARTED;
    this.expiresAt = props.expiresAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new ProductionCertificate entity.
   */
  public static create(params: {
    certificateId?: CertificateId;
    version: string;
    approvedBy: string;
    metadata?: CertificateMetadata;
    productionStatus?: ProductionStatus;
    expiresAt?: Date;
  }): ProductionCertificate {
    const now = new Date();
    return new ProductionCertificate({
      certificateId: params.certificateId ?? CertificateId.create(),
      version: params.version,
      status: CertificationStatus.NOT_CERTIFIED,
      issuedAt: now,
      approvedBy: params.approvedBy,
      metadata: params.metadata ?? {},
      productionStatus: params.productionStatus ?? ProductionStatus.NOT_STARTED,
      expiresAt: params.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a ProductionCertificate from stored data.
   */
  public static fromStorage(record: ProductionCertificateRecord): ProductionCertificate {
    return new ProductionCertificate({
      certificateId: CertificateId.reconstruct(record.certificateId),
      version: record.version,
      status: record.status,
      issuedAt: new Date(record.issuedAt),
      approvedBy: record.approvedBy,
      metadata: record.metadata,
      productionStatus: record.productionStatus,
      expiresAt: record.expiresAt ? new Date(record.expiresAt) : null,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the certificate is valid (not expired and certified).
   */
  public get isValid(): boolean {
    if (this.status !== CertificationStatus.CERTIFIED) {
      return false;
    }
    if (this.expiresAt && this.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  /**
   * Checks if the certificate is expired.
   */
  public get isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return this.expiresAt < new Date();
  }

  /**
   * Checks if the certificate is active in production.
   */
  public get isInProduction(): boolean {
    return this.productionStatus === ProductionStatus.IN_PRODUCTION;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<ProductionCertificateProps, 'certificateId' | 'issuedAt' | 'createdAt'>>): ProductionCertificate {
    return new ProductionCertificate({
      certificateId: this.certificateId,
      version: params.version ?? this.version,
      status: params.status ?? this.status,
      issuedAt: this.issuedAt,
      approvedBy: params.approvedBy ?? this.approvedBy,
      metadata: params.metadata ?? this.metadata,
      productionStatus: params.productionStatus ?? this.productionStatus,
      expiresAt: params.expiresAt !== undefined ? params.expiresAt : this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as certified.
   */
  public markCertified(): ProductionCertificate {
    return this.copyWith({
      status: CertificationStatus.CERTIFIED,
    });
  }

  /**
   * Creates a copy marked as revoked.
   */
  public markRevoked(): ProductionCertificate {
    return this.copyWith({
      status: CertificationStatus.REVOKED,
    });
  }

  /**
   * Serializes the ProductionCertificate to a plain object.
   */
  public toJSON(): ProductionCertificateJSON {
    return {
      certificateId: this.certificateId.value,
      version: this.version,
      status: this.status,
      issuedAt: this.issuedAt.toISOString(),
      approvedBy: this.approvedBy,
      metadata: this.metadata,
      productionStatus: this.productionStatus,
      expiresAt: this.expiresAt?.toISOString() ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ProductionCertificateRecord {
    return {
      certificateId: this.certificateId.value,
      version: this.version,
      status: this.status,
      issuedAt: this.issuedAt.toISOString(),
      approvedBy: this.approvedBy,
      metadata: this.metadata,
      productionStatus: this.productionStatus,
      expiresAt: this.expiresAt?.toISOString() ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
