/**
 * Supabase Security Repository
 *
 * Production Supabase implementation of the Security repository.
 * Handles all persistence operations for security entities.
 *
 * IMPORTANT: Security is a FOUNDATION layer. It ONLY stores incidents, policies, and sessions.
 * Security MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 * Security MUST NEVER ban users, grant permissions, or enforce access control.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { SortOrder } from '../../../shared/constants';
import { RepositoryError } from '../../../database/errors/repository.error';
import type { ISecurityRepository, SecurityIncidentFilterParams, SecurityPolicyFilterParams, SecuritySessionFilterParams } from '../interfaces/ISecurityRepository';
import { SecurityIncident, type SecurityIncidentRecord } from '../entities/SecurityIncident';
import { SecurityPolicy, type SecurityPolicyRecord } from '../entities/SecurityPolicy';
import { SecuritySession, type SecuritySessionRecord } from '../entities/SecuritySession';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { IncidentId } from '../value-objects/IncidentId';
import type { PolicyId } from '../value-objects/PolicyId';
import type { SecuritySessionId } from '../value-objects/SecuritySessionId';

/**
 * Supabase implementation of the Security Repository.
 * Implements ISecurityRepository for security entity persistence.
 *
 * IMPORTANT: Security is a FOUNDATION layer. It ONLY stores records.
 * Security MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */
export class SupabaseSecurityRepository implements ISecurityRepository {
  private readonly client: SupabaseClient;
  private readonly logger: ILogger;
  private readonly tableNames = {
    incidents: 'security_incidents',
    policies: 'security_policies',
    sessions: 'security_sessions',
  } as const;

  /**
   * Creates a new SupabaseSecurityRepository instance.
   * @param client Optional Supabase client
   * @param logger Optional logger instance
   */
  constructor(client?: SupabaseClient, logger?: ILogger) {
    this.client = client ?? getSupabaseClient();
    this.logger = logger ?? getLogger().child({ module: 'SupabaseSecurityRepository' });
  }

  // ============ Security Incident Operations ============

  /**
   * Creates a new security incident.
   */
  async createIncident(incident: SecurityIncident): Promise<SecurityIncident> {
    try {
      this.logger.debug('Creating security incident', { incidentId: incident.incidentId.value });

      const record = this.incidentToRecord(incident);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableNames.incidents) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create security incident', error);
        throw RepositoryError.createFailed('SecurityIncident', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('SecurityIncident', new Error('No data returned after insert'));
      }

      const createdIncident = SecurityIncident.fromDatabase(this.recordToIncidentRecord(data));
      this.logger.info('Security incident created successfully', { incidentId: createdIncident.incidentId.value });
      return createdIncident;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating security incident', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('SecurityIncident', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds an incident by its ID.
   */
  async findIncidentById(id: IncidentId): Promise<SecurityIncident | null> {
    try {
      this.logger.debug('Finding incident by ID', { incidentId: id.value });

      const { data, error } = await this.client
        .from(this.tableNames.incidents)
        .select('*')
        .eq('incident_id', id.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Incident not found by ID', { incidentId: id.value });
          return null;
        }
        this.logger.error('Failed to find incident by ID', error);
        throw new RepositoryError({
          message: `Failed to find incident: ${id.value}`,
          operation: 'SELECT',
          cause: error,
          context: { incidentId: id.value },
        });
      }

      if (!data) {
        return null;
      }

      return SecurityIncident.fromDatabase(this.recordToIncidentRecord(data));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding incident by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding incident: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Lists incidents with pagination and filtering.
   */
  async listIncidents(
    params: PaginationParams,
    filters?: SecurityIncidentFilterParams
  ): Promise<PaginatedResult<SecurityIncident>> {
    try {
      this.logger.debug('Listing incidents', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this.client
        .from(this.tableNames.incidents)
        .select('*', { count: 'exact' });

      query = this.applyIncidentFilters(query, filters);

      const sortDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list incidents', error);
        throw new RepositoryError({
          message: 'Failed to list incidents',
          operation: 'SELECT',
          cause: error,
        });
      }

      const incidents = (data || []).map((record) => SecurityIncident.fromDatabase(this.recordToIncidentRecord(record)));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: incidents,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing incidents', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error listing incidents',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Counts incidents with optional filtering.
   */
  async countIncidents(filters?: SecurityIncidentFilterParams): Promise<number> {
    try {
      this.logger.debug('Counting incidents', { filters });

      let query = this.client
        .from(this.tableNames.incidents)
        .select('*', { count: 'exact', head: true });

      query = this.applyIncidentFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        this.logger.error('Failed to count incidents', error);
        throw new RepositoryError({
          message: 'Failed to count incidents',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error counting incidents', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error counting incidents',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds incidents by actor ID.
   */
  async findIncidentsByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<SecurityIncident>> {
    const paginationParams = params || { page: 1, pageSize: 20 };
    return this.listIncidents(paginationParams, { actorId });
  }

  // ============ Security Policy Operations ============

  /**
   * Creates a new security policy.
   */
  async createPolicy(policy: SecurityPolicy): Promise<SecurityPolicy> {
    try {
      this.logger.debug('Creating security policy', { policyId: policy.policyId.value });

      const record = this.policyToRecord(policy);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableNames.policies) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create security policy', error);
        throw RepositoryError.createFailed('SecurityPolicy', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('SecurityPolicy', new Error('No data returned after insert'));
      }

      const createdPolicy = SecurityPolicy.fromDatabase(this.recordToPolicyRecord(data));
      this.logger.info('Security policy created successfully', { policyId: createdPolicy.policyId.value });
      return createdPolicy;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating security policy', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('SecurityPolicy', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds a policy by its ID.
   */
  async findPolicyById(id: PolicyId): Promise<SecurityPolicy | null> {
    try {
      this.logger.debug('Finding policy by ID', { policyId: id.value });

      const { data, error } = await this.client
        .from(this.tableNames.policies)
        .select('*')
        .eq('policy_id', id.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Policy not found by ID', { policyId: id.value });
          return null;
        }
        this.logger.error('Failed to find policy by ID', error);
        throw new RepositoryError({
          message: `Failed to find policy: ${id.value}`,
          operation: 'SELECT',
          cause: error,
          context: { policyId: id.value },
        });
      }

      if (!data) {
        return null;
      }

      return SecurityPolicy.fromDatabase(this.recordToPolicyRecord(data));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding policy by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding policy: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Lists policies with pagination and filtering.
   */
  async listPolicies(
    params: PaginationParams,
    filters?: SecurityPolicyFilterParams
  ): Promise<PaginatedResult<SecurityPolicy>> {
    try {
      this.logger.debug('Listing policies', { params, filters });

      const { page, pageSize, sortBy = 'policy_name', sortOrder = SortOrder.ASC } = params;
      const offset = (page - 1) * pageSize;

      let query = this.client
        .from(this.tableNames.policies)
        .select('*', { count: 'exact' });

      query = this.applyPolicyFilters(query, filters);

      const sortDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list policies', error);
        throw new RepositoryError({
          message: 'Failed to list policies',
          operation: 'SELECT',
          cause: error,
        });
      }

      const policies = (data || []).map((record) => SecurityPolicy.fromDatabase(this.recordToPolicyRecord(record)));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: policies,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing policies', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error listing policies',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Counts policies with optional filtering.
   */
  async countPolicies(filters?: SecurityPolicyFilterParams): Promise<number> {
    try {
      this.logger.debug('Counting policies', { filters });

      let query = this.client
        .from(this.tableNames.policies)
        .select('*', { count: 'exact', head: true });

      query = this.applyPolicyFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        this.logger.error('Failed to count policies', error);
        throw new RepositoryError({
          message: 'Failed to count policies',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error counting policies', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error counting policies',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Updates a policy.
   */
  async updatePolicy(id: PolicyId, updates: Partial<SecurityPolicy>): Promise<SecurityPolicy> {
    try {
      this.logger.debug('Updating policy', { policyId: id.value });

      const updateRecord: Record<string, unknown> = {};

      if (updates.policyName !== undefined) {
        updateRecord.policy_name = updates.policyName;
      }
      if (updates.enabled !== undefined) {
        updateRecord.enabled = updates.enabled;
      }
      if (updates.configuration !== undefined) {
        updateRecord.configuration = updates.configuration;
      }
      if (updates.metadata !== undefined) {
        updateRecord.metadata = updates.metadata;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableNames.policies) as any)
        .update(updateRecord)
        .eq('policy_id', id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update policy', error);
        throw RepositoryError.updateFailed('SecurityPolicy', id.value, this.toError(error));
      }

      if (!data) {
        throw RepositoryError.entityNotFound('SecurityPolicy', id.value, this.tableNames.policies);
      }

      const updatedPolicy = SecurityPolicy.fromDatabase(this.recordToPolicyRecord(data));
      this.logger.info('Security policy updated successfully', { policyId: updatedPolicy.policyId.value });
      return updatedPolicy;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating policy', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.updateFailed('SecurityPolicy', id.value, err instanceof Error ? err : undefined);
    }
  }

  // ============ Security Session Operations ============

  /**
   * Creates a new security session.
   */
  async createSession(session: SecuritySession): Promise<SecuritySession> {
    try {
      this.logger.debug('Creating security session', { sessionId: session.sessionId.value });

      const record = this.sessionToRecord(session);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableNames.sessions) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create security session', error);
        throw RepositoryError.createFailed('SecuritySession', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('SecuritySession', new Error('No data returned after insert'));
      }

      const createdSession = SecuritySession.fromDatabase(this.recordToSessionRecord(data));
      this.logger.info('Security session created successfully', { sessionId: createdSession.sessionId.value });
      return createdSession;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating security session', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('SecuritySession', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds a session by its ID.
   */
  async findSessionById(id: SecuritySessionId): Promise<SecuritySession | null> {
    try {
      this.logger.debug('Finding session by ID', { sessionId: id.value });

      const { data, error } = await this.client
        .from(this.tableNames.sessions)
        .select('*')
        .eq('session_id', id.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Session not found by ID', { sessionId: id.value });
          return null;
        }
        this.logger.error('Failed to find session by ID', error);
        throw new RepositoryError({
          message: `Failed to find session: ${id.value}`,
          operation: 'SELECT',
          cause: error,
          context: { sessionId: id.value },
        });
      }

      if (!data) {
        return null;
      }

      return SecuritySession.fromDatabase(this.recordToSessionRecord(data));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding session by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding session: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Lists sessions with pagination and filtering.
   */
  async listSessions(
    params: PaginationParams,
    filters?: SecuritySessionFilterParams
  ): Promise<PaginatedResult<SecuritySession>> {
    try {
      this.logger.debug('Listing sessions', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this.client
        .from(this.tableNames.sessions)
        .select('*', { count: 'exact' });

      query = this.applySessionFilters(query, filters);

      const sortDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list sessions', error);
        throw new RepositoryError({
          message: 'Failed to list sessions',
          operation: 'SELECT',
          cause: error,
        });
      }

      const sessions = (data || []).map((record) => SecuritySession.fromDatabase(this.recordToSessionRecord(record)));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: sessions,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing sessions', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error listing sessions',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Counts sessions with optional filtering.
   */
  async countSessions(filters?: SecuritySessionFilterParams): Promise<number> {
    try {
      this.logger.debug('Counting sessions', { filters });

      let query = this.client
        .from(this.tableNames.sessions)
        .select('*', { count: 'exact', head: true });

      query = this.applySessionFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        this.logger.error('Failed to count sessions', error);
        throw new RepositoryError({
          message: 'Failed to count sessions',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error counting sessions', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error counting sessions',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds sessions by actor ID.
   */
  async findSessionsByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<SecuritySession>> {
    const paginationParams = params || { page: 1, pageSize: 20 };
    return this.listSessions(paginationParams, { actorId });
  }

  /**
   * Updates a session.
   */
  async updateSession(id: SecuritySessionId, updates: Partial<SecuritySession>): Promise<SecuritySession> {
    try {
      this.logger.debug('Updating session', { sessionId: id.value });

      const updateRecord: Record<string, unknown> = {};

      if (updates.status !== undefined) {
        updateRecord.status = updates.status;
      }
      if (updates.expiresAt !== undefined) {
        updateRecord.expires_at = updates.expiresAt instanceof Date ? updates.expiresAt.toISOString() : updates.expiresAt;
      }
      if (updates.metadata !== undefined) {
        updateRecord.metadata = updates.metadata;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableNames.sessions) as any)
        .update(updateRecord)
        .eq('session_id', id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update session', error);
        throw RepositoryError.updateFailed('SecuritySession', id.value, this.toError(error));
      }

      if (!data) {
        throw RepositoryError.entityNotFound('SecuritySession', id.value, this.tableNames.sessions);
      }

      const updatedSession = SecuritySession.fromDatabase(this.recordToSessionRecord(data));
      this.logger.info('Security session updated successfully', { sessionId: updatedSession.sessionId.value });
      return updatedSession;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating session', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.updateFailed('SecuritySession', id.value, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Expires old sessions.
   */
  async expireSessions(olderThan: Date): Promise<number> {
    try {
      this.logger.debug('Expiring old sessions', { olderThan: olderThan.toISOString() });

      const updateRecord = {
        status: 'expired',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error, count } = await (this.client.from(this.tableNames.sessions) as any)
        .update(updateRecord)
        .eq('status', 'active')
        .lt('expires_at', olderThan.toISOString());

      if (error) {
        this.logger.error('Failed to expire old sessions', error);
        throw new RepositoryError({
          message: 'Failed to expire old sessions',
          operation: 'UPDATE',
          cause: error,
        });
      }

      const expiredCount = count || 0;
      this.logger.info('Sessions expired', { count: expiredCount });
      return expiredCount;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error expiring sessions', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error expiring sessions',
        operation: 'UPDATE',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  // ============ Private Helper Methods ============

  /**
   * Converts a SecurityIncident entity to a database record.
   */
  private incidentToRecord(incident: SecurityIncident): Omit<SecurityIncidentRecord, never> {
    return {
      incident_id: incident.incidentId.value,
      incident_type: incident.incidentType,
      severity: incident.severity,
      status: incident.status,
      actor_id: incident.actorId,
      source: incident.source,
      description: incident.description,
      created_at: incident.createdAt.toISOString(),
      metadata: incident.metadata,
    };
  }

  /**
   * Converts a raw database record to a SecurityIncidentRecord format.
   */
  private recordToIncidentRecord(record: unknown): SecurityIncidentRecord {
    const r = record as {
      incident_id: string;
      incident_type: string;
      severity: string;
      status: string;
      actor_id: string;
      source: string;
      description: string;
      created_at: string;
      metadata?: Record<string, unknown>;
    };
    return {
      incident_id: r.incident_id,
      incident_type: r.incident_type,
      severity: r.severity,
      status: r.status,
      actor_id: r.actor_id,
      source: r.source,
      description: r.description,
      created_at: r.created_at,
      metadata: r.metadata,
    };
  }

  /**
   * Converts a SecurityPolicy entity to a database record.
   */
  private policyToRecord(policy: SecurityPolicy): Omit<SecurityPolicyRecord, never> {
    return {
      policy_id: policy.policyId.value,
      policy_name: policy.policyName,
      policy_type: policy.policyType,
      enabled: policy.enabled,
      configuration: policy.configuration,
      metadata: policy.metadata,
    };
  }

  /**
   * Converts a raw database record to a SecurityPolicyRecord format.
   */
  private recordToPolicyRecord(record: unknown): SecurityPolicyRecord {
    const r = record as {
      policy_id: string;
      policy_name: string;
      policy_type: string;
      enabled: boolean;
      configuration?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    };
    return {
      policy_id: r.policy_id,
      policy_name: r.policy_name,
      policy_type: r.policy_type,
      enabled: r.enabled,
      configuration: r.configuration,
      metadata: r.metadata,
    };
  }

  /**
   * Converts a SecuritySession entity to a database record.
   */
  private sessionToRecord(session: SecuritySession): Omit<SecuritySessionRecord, never> {
    return {
      session_id: session.sessionId.value,
      actor_id: session.actorId,
      status: session.status,
      ip_address: session.ipAddress,
      device: session.device,
      created_at: session.createdAt.toISOString(),
      expires_at: session.expiresAt.toISOString(),
      metadata: session.metadata,
    };
  }

  /**
   * Converts a raw database record to a SecuritySessionRecord format.
   */
  private recordToSessionRecord(record: unknown): SecuritySessionRecord {
    const r = record as {
      session_id: string;
      actor_id: string;
      status: string;
      ip_address: string;
      device: string;
      created_at: string;
      expires_at: string;
      metadata?: Record<string, unknown>;
    };
    return {
      session_id: r.session_id,
      actor_id: r.actor_id,
      status: r.status,
      ip_address: r.ip_address,
      device: r.device,
      created_at: r.created_at,
      expires_at: r.expires_at,
      metadata: r.metadata,
    };
  }

  /**
   * Applies filters to an incident query builder.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyIncidentFilters(query: any, filters?: SecurityIncidentFilterParams): any {
    if (!filters) return query;

    if (filters.actorId) {
      query = query.eq('actor_id', filters.actorId);
    }
    if (filters.incidentType) {
      query = query.eq('incident_type', filters.incidentType);
    }
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    if (filters.createdAfter) {
      query = query.gte('created_at', filters.createdAfter.toISOString());
    }
    if (filters.createdBefore) {
      query = query.lte('created_at', filters.createdBefore.toISOString());
    }

    return query;
  }

  /**
   * Applies filters to a policy query builder.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyPolicyFilters(query: any, filters?: SecurityPolicyFilterParams): any {
    if (!filters) return query;

    if (filters.policyType) {
      query = query.eq('policy_type', filters.policyType);
    }
    if (filters.enabled !== undefined) {
      query = query.eq('enabled', filters.enabled);
    }
    if (filters.policyName) {
      query = query.ilike('policy_name', `%${filters.policyName}%`);
    }

    return query;
  }

  /**
   * Applies filters to a session query builder.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applySessionFilters(query: any, filters?: SecuritySessionFilterParams): any {
    if (!filters) return query;

    if (filters.actorId) {
      query = query.eq('actor_id', filters.actorId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.ipAddress) {
      query = query.eq('ip_address', filters.ipAddress);
    }
    if (filters.expiredOnly) {
      query = query.eq('status', 'expired');
    }
    if (filters.activeOnly) {
      query = query.eq('status', 'active');
    }

    return query;
  }

  /**
   * Checks if an error is a "not found" error.
   */
  private isNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as { code?: string; message?: string };
    return err.code === 'PGRST116' || (typeof err.message === 'string' && err.message.includes('No rows'));
  }

  /**
   * Converts a Supabase error to a standard Error.
   */
  private toError(error: unknown): Error | undefined {
    if (error instanceof Error) return error;
    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; code?: string };
      return new Error(err.message || `Database error: ${err.code || 'unknown'}`);
    }
    return undefined;
  }
}
