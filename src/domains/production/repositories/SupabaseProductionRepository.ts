/**
 * Supabase Production Repository
 *
 * Full implementation of the Production repository for persistence.
 * Uses Supabase for storage, returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IProductionRepository,
  ProductionCertificateFilterParams,
  ProductionChecklistFilterParams,
} from '../interfaces/IProductionRepository';
import type { ProductionCertificate, ProductionCertificateRecord } from '../entities/ProductionCertificate';
import type { ProductionChecklist, ProductionChecklistRecord } from '../entities/ProductionChecklist';
import type { ProductionSnapshot, ProductionSnapshotRecord } from '../entities/ProductionSnapshot';
import type { CertificateId } from '../value-objects/CertificateId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseProductionRepository');

/**
 * Supabase implementation of the Production Repository.
 * Implements IProductionRepository for Production entity persistence.
 */
export class SupabaseProductionRepository implements IProductionRepository {
  private readonly certificatesTableName = 'production_certificates';
  private readonly checklistsTableName = 'production_checklists';
  private readonly snapshotsTableName = 'production_snapshots';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseProductionRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Helper to get client with proper typing for database operations.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get db(): any {
    return this.client;
  }

  // ============ Certificate Operations ============

  /**
   * Creates a new certificate.
   */
  async createCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate> {
    logger.debug('Creating certificate', { certificateId: certificate.certificateId.value });
    try {
      const record = certificate.toRecord();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client as any)
        .from(this.certificatesTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create certificate', error);
        throw RepositoryError.createFailed('ProductionCertificate', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ProductionCertificate', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ProductionCertificateRecord;
      return ProductionCertificate.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating certificate', err as Error);
      throw RepositoryError.createFailed('ProductionCertificate', err as Error);
    }
  }

  /**
   * Finds a certificate by its ID.
   */
  async findCertificateById(id: CertificateId): Promise<ProductionCertificate | null> {
    logger.debug('Finding certificate by ID', { certificateId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.certificatesTableName)
        .select('*')
        .eq('certificateId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find certificate', error);
        throw RepositoryError.queryFailed('findCertificateById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as ProductionCertificateRecord;
      return ProductionCertificate.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding certificate', err as Error);
      throw RepositoryError.queryFailed('findCertificateById', err as Error);
    }
  }

  /**
   * Updates an existing certificate.
   */
  async updateCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate> {
    logger.debug('Updating certificate', { certificateId: certificate.certificateId.value });
    try {
      const record = certificate.toRecord();
      const { data, error } = await this.db
        .from(this.certificatesTableName)
        .update(record)
        .eq('certificateId', certificate.certificateId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update certificate', error);
        throw RepositoryError.updateFailed('ProductionCertificate', certificate.certificateId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('ProductionCertificate', certificate.certificateId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as ProductionCertificateRecord;
      return ProductionCertificate.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating certificate', err as Error);
      throw RepositoryError.updateFailed('ProductionCertificate', certificate.certificateId.value, err as Error);
    }
  }

  /**
   * Deletes a certificate.
   */
  async deleteCertificate(id: CertificateId): Promise<void> {
    logger.debug('Deleting certificate', { certificateId: id.value });
    try {
      const { error } = await this.db
        .from(this.certificatesTableName)
        .delete()
        .eq('certificateId', id.value);

      if (error) {
        logger.error('Failed to delete certificate', error);
        throw RepositoryError.deleteFailed('ProductionCertificate', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting certificate', err as Error);
      throw RepositoryError.deleteFailed('ProductionCertificate', id.value, err as Error);
    }
  }

  /**
   * Lists certificates with pagination and filtering.
   */
  async listCertificates(
    params: PaginationParams,
    filters?: ProductionCertificateFilterParams
  ): Promise<PaginatedResult<ProductionCertificate>> {
    logger.debug('Listing certificates', { params, filters });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.db
        .from(this.certificatesTableName)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.version) {
        query = query.eq('version', filters.version);
      }
      if (filters?.approvedBy) {
        query = query.eq('approvedBy', filters.approvedBy);
      }

      const { data, error, count } = await query
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list certificates', error);
        throw RepositoryError.queryFailed('listCertificates', error as Error);
      }

      const records = (data || []) as unknown as ProductionCertificateRecord[];
      const certificates = records.map((record) => ProductionCertificate.fromStorage(record));
      const total = count || 0;

      return {
        items: certificates,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing certificates', err as Error);
      throw RepositoryError.queryFailed('listCertificates', err as Error);
    }
  }

  /**
   * Counts total certificates with optional filtering.
   */
  async countCertificates(filters?: ProductionCertificateFilterParams): Promise<number> {
    logger.debug('Counting certificates', { filters });
    try {
      let query = this.db
        .from(this.certificatesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.version) {
        query = query.eq('version', filters.version);
      }
      if (filters?.approvedBy) {
        query = query.eq('approvedBy', filters.approvedBy);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count certificates', error);
        throw RepositoryError.queryFailed('countCertificates', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting certificates', err as Error);
      throw RepositoryError.queryFailed('countCertificates', err as Error);
    }
  }

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   */
  async createChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist> {
    logger.debug('Creating checklist', { checklistId: checklist.checklistId.value });
    try {
      const record = checklist.toRecord();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client as any)
        .from(this.checklistsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create checklist', error);
        throw RepositoryError.createFailed('ProductionChecklist', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ProductionChecklist', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ProductionChecklistRecord;
      return ProductionChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating checklist', err as Error);
      throw RepositoryError.createFailed('ProductionChecklist', err as Error);
    }
  }

  /**
   * Finds a checklist by its ID.
   */
  async findChecklistById(id: ChecklistId): Promise<ProductionChecklist | null> {
    logger.debug('Finding checklist by ID', { checklistId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.checklistsTableName)
        .select('*')
        .eq('checklistId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find checklist', error);
        throw RepositoryError.queryFailed('findChecklistById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as ProductionChecklistRecord;
      return ProductionChecklist.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding checklist', err as Error);
      throw RepositoryError.queryFailed('findChecklistById', err as Error);
    }
  }

  /**
   * Updates an existing checklist.
   */
  async updateChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist> {
    logger.debug('Updating checklist', { checklistId: checklist.checklistId.value });
    try {
      const record = checklist.toRecord();
      const { data, error } = await this.db
        .from(this.checklistsTableName)
        .update(record)
        .eq('checklistId', checklist.checklistId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update checklist', error);
        throw RepositoryError.updateFailed('ProductionChecklist', checklist.checklistId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('ProductionChecklist', checklist.checklistId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as ProductionChecklistRecord;
      return ProductionChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating checklist', err as Error);
      throw RepositoryError.updateFailed('ProductionChecklist', checklist.checklistId.value, err as Error);
    }
  }

  /**
   * Deletes a checklist.
   */
  async deleteChecklist(id: ChecklistId): Promise<void> {
    logger.debug('Deleting checklist', { checklistId: id.value });
    try {
      const { error } = await this.db
        .from(this.checklistsTableName)
        .delete()
        .eq('checklistId', id.value);

      if (error) {
        logger.error('Failed to delete checklist', error);
        throw RepositoryError.deleteFailed('ProductionChecklist', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting checklist', err as Error);
      throw RepositoryError.deleteFailed('ProductionChecklist', id.value, err as Error);
    }
  }

  /**
   * Lists checklists with pagination and filtering.
   */
  async listChecklists(
    params: PaginationParams,
    filters?: ProductionChecklistFilterParams
  ): Promise<PaginatedResult<ProductionChecklist>> {
    logger.debug('Listing checklists', { params, filters });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.db
        .from(this.checklistsTableName)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { data, error, count } = await query
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list checklists', error);
        throw RepositoryError.queryFailed('listChecklists', error as Error);
      }

      const records = (data || []) as unknown as ProductionChecklistRecord[];
      const checklists = records.map((record) => ProductionChecklist.fromStorage(record));
      const total = count || 0;

      return {
        items: checklists,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing checklists', err as Error);
      throw RepositoryError.queryFailed('listChecklists', err as Error);
    }
  }

  /**
   * Counts total checklists with optional filtering.
   */
  async countChecklists(filters?: ProductionChecklistFilterParams): Promise<number> {
    logger.debug('Counting checklists', { filters });
    try {
      let query = this.db
        .from(this.checklistsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count checklists', error);
        throw RepositoryError.queryFailed('countChecklists', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting checklists', err as Error);
      throw RepositoryError.queryFailed('countChecklists', err as Error);
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   */
  async createSnapshot(snapshot: ProductionSnapshot): Promise<ProductionSnapshot> {
    logger.debug('Creating snapshot', { snapshotId: snapshot.snapshotId.value });
    try {
      const record = snapshot.toRecord();
      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create snapshot', error);
        throw RepositoryError.createFailed('ProductionSnapshot', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ProductionSnapshot', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ProductionSnapshotRecord;
      return ProductionSnapshot.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating snapshot', err as Error);
      throw RepositoryError.createFailed('ProductionSnapshot', err as Error);
    }
  }

  /**
   * Finds a snapshot by its ID.
   */
  async findSnapshotById(id: SnapshotId): Promise<ProductionSnapshot | null> {
    logger.debug('Finding snapshot by ID', { snapshotId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .select('*')
        .eq('snapshotId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find snapshot', error);
        throw RepositoryError.queryFailed('findSnapshotById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as ProductionSnapshotRecord;
      return ProductionSnapshot.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding snapshot', err as Error);
      throw RepositoryError.queryFailed('findSnapshotById', err as Error);
    }
  }

  /**
   * Lists all snapshots with pagination.
   */
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<ProductionSnapshot>> {
    logger.debug('Listing snapshots', { params });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await this.db
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list snapshots', error);
        throw RepositoryError.queryFailed('listSnapshots', error as Error);
      }

      const records = (data || []) as unknown as ProductionSnapshotRecord[];
      const snapshots = records.map((record) => ProductionSnapshot.fromStorage(record));
      const total = count || 0;

      return {
        items: snapshots,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing snapshots', err as Error);
      throw RepositoryError.queryFailed('listSnapshots', err as Error);
    }
  }

  /**
   * Deletes a snapshot.
   */
  async deleteSnapshot(id: SnapshotId): Promise<void> {
    logger.debug('Deleting snapshot', { snapshotId: id.value });
    try {
      const { error } = await this.db
        .from(this.snapshotsTableName)
        .delete()
        .eq('snapshotId', id.value);

      if (error) {
        logger.error('Failed to delete snapshot', error);
        throw RepositoryError.deleteFailed('ProductionSnapshot', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting snapshot', err as Error);
      throw RepositoryError.deleteFailed('ProductionSnapshot', id.value, err as Error);
    }
  }

  /**
   * Counts total snapshots.
   */
  async countSnapshots(): Promise<number> {
    logger.debug('Counting snapshots');
    try {
      const { count, error } = await this.db
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        logger.error('Failed to count snapshots', error);
        throw RepositoryError.queryFailed('countSnapshots', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting snapshots', err as Error);
      throw RepositoryError.queryFailed('countSnapshots', err as Error);
    }
  }
}
