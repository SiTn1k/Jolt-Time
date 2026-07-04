/**
 * Security Repository Interface
 *
 * Interface defining the contract for Security persistence.
 * All security repository implementations must adhere to this interface.
 */

import type { IncidentId } from '../value-objects/IncidentId';
import type { PolicyId } from '../value-objects/PolicyId';
import type { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { SecurityIncident } from '../entities/SecurityIncident';
import type { SecurityPolicy } from '../entities/SecurityPolicy';
import type { SecuritySession } from '../entities/SecuritySession';
import type { IncidentSeverity } from '../types/IncidentSeverity';
import type { IncidentStatus } from '../types/IncidentStatus';
import type { SessionStatus } from '../types/SessionStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying security incidents.
 */
export interface SecurityIncidentFilterParams {
  actorId?: string;
  incidentType?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  source?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Filter parameters for querying security policies.
 */
export interface SecurityPolicyFilterParams {
  policyType?: string;
  enabled?: boolean;
  policyName?: string;
}

/**
 * Filter parameters for querying security sessions.
 */
export interface SecuritySessionFilterParams {
  actorId?: string;
  status?: SessionStatus;
  ipAddress?: string;
  expiredOnly?: boolean;
  activeOnly?: boolean;
}

/**
 * Security repository interface.
 * Defines all data access operations for security entities.
 *
 * IMPORTANT: Security is a FOUNDATION layer. It ONLY stores incidents, policies, and sessions.
 * Security MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 * Security MUST NEVER ban users, grant permissions, or enforce access control.
 */
export interface ISecurityRepository {
  // ============ Security Incident Operations ============

  /**
   * Creates a new security incident.
   * @param incident The incident to create
   * @returns The created incident
   */
  createIncident(incident: SecurityIncident): Promise<SecurityIncident>;

  /**
   * Finds an incident by its ID.
   * @param id The incident ID to find
   * @returns The incident if found, null otherwise
   */
  findIncidentById(id: IncidentId): Promise<SecurityIncident | null>;

  /**
   * Lists incidents with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of incidents
   */
  listIncidents(
    params: PaginationParams,
    filters?: SecurityIncidentFilterParams
  ): Promise<PaginatedResult<SecurityIncident>>;

  /**
   * Counts incidents with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching incidents
   */
  countIncidents(filters?: SecurityIncidentFilterParams): Promise<number>;

  /**
   * Finds incidents by actor ID.
   * @param actorId The actor ID to search for
   * @param params Optional pagination parameters
   * @returns Paginated result of incidents
   */
  findIncidentsByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<SecurityIncident>>;

  // ============ Security Policy Operations ============

  /**
   * Creates a new security policy.
   * @param policy The policy to create
   * @returns The created policy
   */
  createPolicy(policy: SecurityPolicy): Promise<SecurityPolicy>;

  /**
   * Finds a policy by its ID.
   * @param id The policy ID to find
   * @returns The policy if found, null otherwise
   */
  findPolicyById(id: PolicyId): Promise<SecurityPolicy | null>;

  /**
   * Lists policies with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of policies
   */
  listPolicies(
    params: PaginationParams,
    filters?: SecurityPolicyFilterParams
  ): Promise<PaginatedResult<SecurityPolicy>>;

  /**
   * Counts policies with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching policies
   */
  countPolicies(filters?: SecurityPolicyFilterParams): Promise<number>;

  /**
   * Updates a policy.
   * @param id The policy ID to update
   * @param updates The updates to apply
   * @returns The updated policy
   */
  updatePolicy(id: PolicyId, updates: Partial<SecurityPolicy>): Promise<SecurityPolicy>;

  // ============ Security Session Operations ============

  /**
   * Creates a new security session.
   * @param session The session to create
   * @returns The created session
   */
  createSession(session: SecuritySession): Promise<SecuritySession>;

  /**
   * Finds a session by its ID.
   * @param id The session ID to find
   * @returns The session if found, null otherwise
   */
  findSessionById(id: SecuritySessionId): Promise<SecuritySession | null>;

  /**
   * Lists sessions with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of sessions
   */
  listSessions(
    params: PaginationParams,
    filters?: SecuritySessionFilterParams
  ): Promise<PaginatedResult<SecuritySession>>;

  /**
   * Counts sessions with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching sessions
   */
  countSessions(filters?: SecuritySessionFilterParams): Promise<number>;

  /**
   * Finds sessions by actor ID.
   * @param actorId The actor ID to search for
   * @param params Optional pagination parameters
   * @returns Paginated result of sessions
   */
  findSessionsByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<SecuritySession>>;

  /**
   * Updates a session.
   * @param id The session ID to update
   * @param updates The updates to apply
   * @returns The updated session
   */
  updateSession(id: SecuritySessionId, updates: Partial<SecuritySession>): Promise<SecuritySession>;

  /**
   * Expires old sessions.
   * @param olderThan Date threshold for expiring
   * @returns Number of sessions expired
   */
  expireSessions(olderThan: Date): Promise<number>;
}
