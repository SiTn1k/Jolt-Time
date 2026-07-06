/**
 * IProductionRepository Interface
 *
 * Interface for Production domain repository.
 * Defines all persistence operations for Production entities.
 */

import type {
  ProductionCertificate,
  ProductionCertificateRecord,
} from '../entities/ProductionCertificate';
import type {
  ProductionChecklist,
  ProductionChecklistRecord,
} from '../entities/ProductionChecklist';
import type {
  ProductionSnapshot,
  ProductionSnapshotRecord,
} from '../entities/ProductionSnapshot';
import type { CertificateId } from '../value-objects/CertificateId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { CertificationStatus } from '../types/CertificationStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for certificates.
 */
export interface ProductionCertificateFilterParams {
  status?: CertificationStatus;
  version?: string;
  approvedBy?: string;
}

/**
 * Filter parameters for checklists.
 */
export interface ProductionChecklistFilterParams {
  status?: ChecklistStatus;
  owner?: string;
  category?: string;
}

/**
 * Production repository interface.
 * Defines all persistence operations for Production entities.
 */
export interface IProductionRepository {
  // ============ Certificate Operations ============

  /**
   * Creates a new certificate.
   * @param certificate The certificate to create
   * @returns The created certificate
   */
  createCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate>;

  /**
   * Finds a certificate by its ID.
   * @param id The certificate ID to find
   * @returns The certificate if found, null otherwise
   */
  findCertificateById(id: CertificateId): Promise<ProductionCertificate | null>;

  /**
   * Updates an existing certificate.
   * @param certificate The certificate to update
   * @returns The updated certificate
   */
  updateCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate>;

  /**
   * Deletes a certificate.
   * @param id The certificate ID to delete
   */
  deleteCertificate(id: CertificateId): Promise<void>;

  /**
   * Lists certificates with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of certificates
   */
  listCertificates(
    params: PaginationParams,
    filters?: ProductionCertificateFilterParams
  ): Promise<PaginatedResult<ProductionCertificate>>;

  /**
   * Counts total certificates with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching certificates
   */
  countCertificates(filters?: ProductionCertificateFilterParams): Promise<number>;

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  createChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist>;

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  findChecklistById(id: ChecklistId): Promise<ProductionChecklist | null>;

  /**
   * Updates an existing checklist.
   * @param checklist The checklist to update
   * @returns The updated checklist
   */
  updateChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist>;

  /**
   * Deletes a checklist.
   * @param id The checklist ID to delete
   */
  deleteChecklist(id: ChecklistId): Promise<void>;

  /**
   * Lists checklists with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of checklists
   */
  listChecklists(
    params: PaginationParams,
    filters?: ProductionChecklistFilterParams
  ): Promise<PaginatedResult<ProductionChecklist>>;

  /**
   * Counts total checklists with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching checklists
   */
  countChecklists(filters?: ProductionChecklistFilterParams): Promise<number>;

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  createSnapshot(snapshot: ProductionSnapshot): Promise<ProductionSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<ProductionSnapshot | null>;

  /**
   * Lists all snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(params: PaginationParams): Promise<PaginatedResult<ProductionSnapshot>>;

  /**
   * Deletes a snapshot.
   * @param id The snapshot ID to delete
   */
  deleteSnapshot(id: SnapshotId): Promise<void>;

  /**
   * Counts total snapshots.
   * @returns Total count of snapshots
   */
  countSnapshots(): Promise<number>;
}
