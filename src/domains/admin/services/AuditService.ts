/**
 * Audit Service
 *
 * Comprehensive audit logging for all admin operations.
 * Records who, what, when, and the result of every administrative action.
 */

import type { AdminId } from '../value-objects/AdminId';
import type { ILogger } from '../../../shared/types';
import { getLogger } from '../../../core/logging/logger.service';

/**
 * Audit event types.
 */
export enum AuditEventType {
  // Admin Account Events
  ADMIN_CREATED = 'admin.created',
  ADMIN_UPDATED = 'admin.updated',
  ADMIN_DELETED = 'admin.deleted',
  ADMIN_ENABLED = 'admin.enabled',
  ADMIN_DISABLED = 'admin.disabled',
  ADMIN_SUSPENDED = 'admin.suspended',
  ADMIN_LOGIN = 'admin.login',
  ADMIN_LOGOUT = 'admin.logout',

  // Role Events
  ROLE_CREATED = 'role.created',
  ROLE_UPDATED = 'role.updated',
  ROLE_DELETED = 'role.deleted',
  ROLE_ASSIGNED = 'role.assigned',
  ROLE_REMOVED = 'role.removed',

  // Permission Events
  PERMISSION_CREATED = 'permission.created',
  PERMISSION_UPDATED = 'permission.updated',
  PERMISSION_DELETED = 'permission.deleted',

  // Configuration Events
  CONFIG_CHANGED = 'config.changed',
  CONFIG_READ = 'config.read',

  // System Events
  SYSTEM_MAINTENANCE_STARTED = 'system.maintenance_started',
  SYSTEM_MAINTENANCE_ENDED = 'system.maintenance_ended',

  // Player Management Events
  PLAYER_BANNED = 'player.banned',
  PLAYER_UNBANNED = 'player.unbanned',
  PLAYER_DATA_INSPECTED = 'player.data_inspected',

  // Economy Events
  ECONOMY_ADJUSTED = 'economy.adjusted',
  CURRENCY_GRANTED = 'currency.granted',
  CURRENCY_REVOKED = 'currency.revoked',

  // Reward Events
  REWARD_ISSUED = 'reward.issued',
  REWARD_REVOKED = 'reward.revoked',

  // Generic Events
  UNKNOWN = 'unknown',
}

/**
 * Audit result status.
 */
export enum AuditResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PARTIAL = 'partial',
}

/**
 * Audit log entry.
 */
export interface AuditLogEntry {
  /** Unique identifier for the audit entry */
  id: string;

  /** Who performed the action */
  actorId: string;
  actorType: 'admin' | 'system';
  actorName?: string;

  /** What action was performed */
  eventType: AuditEventType;
  action: string;
  resource: string;
  resourceId?: string;

  /** Target entity information */
  targetType?: string;
  targetId?: string;
  targetName?: string;

  /** When the action occurred */
  timestamp: Date;

  /** Result of the action */
  result: AuditResult;
  success: boolean;

  /** Failure information (if applicable) */
  failureReason?: string;
  errorCode?: string;

  /** Additional context */
  metadata?: Record<string, unknown>;

  /** Request context */
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

/**
 * Audit query filters.
 */
export interface AuditQueryFilters {
  /** Filter by actor ID */
  actorId?: string;

  /** Filter by event type */
  eventType?: AuditEventType;

  /** Filter by target ID */
  targetId?: string;

  /** Filter by result */
  result?: AuditResult;

  /** Filter by date range */
  startDate?: Date;
  endDate?: Date;

  /** Filter by resource */
  resource?: string;

  /** Pagination */
  page?: number;
  pageSize?: number;
}

/**
 * Audit query result.
 */
export interface AuditQueryResult {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Audit entry builder for fluent API.
 */
export class AuditEntryBuilder {
  private entry: Partial<AuditLogEntry>;

  constructor() {
    this.entry = {
      id: this.generateId(),
      timestamp: new Date(),
      success: true,
    };
  }

  /**
   * Sets the actor information.
   */
  actor(id: string, type: 'admin' | 'system', name?: string): this {
    this.entry.actorId = id;
    this.entry.actorType = type;
    this.entry.actorName = name;
    return this;
  }

  /**
   * Sets the action and resource.
   */
  action(eventType: AuditEventType, action: string, resource: string, resourceId?: string): this {
    this.entry.eventType = eventType;
    this.entry.action = action;
    this.entry.resource = resource;
    this.entry.resourceId = resourceId;
    return this;
  }

  /**
   * Sets the target entity.
   */
  target(type: string, id: string, name?: string): this {
    this.entry.targetType = type;
    this.entry.targetId = id;
    this.entry.targetName = name;
    return this;
  }

  /**
   * Sets the result as success.
   */
  success(): this {
    this.entry.result = AuditResult.SUCCESS;
    this.entry.success = true;
    return this;
  }

  /**
   * Sets the result as failure.
   */
  failure(reason: string, errorCode?: string): this {
    this.entry.result = AuditResult.FAILURE;
    this.entry.success = false;
    this.entry.failureReason = reason;
    this.entry.errorCode = errorCode;
    return this;
  }

  /**
   * Sets additional metadata.
   */
  metadata(data: Record<string, unknown>): this {
    this.entry.metadata = data;
    return this;
  }

  /**
   * Sets request context.
   */
  context(ipAddress?: string, userAgent?: string, sessionId?: string): this {
    this.entry.ipAddress = ipAddress;
    this.entry.userAgent = userAgent;
    this.entry.sessionId = sessionId;
    return this;
  }

  /**
   * Builds the audit entry.
   */
  build(): AuditLogEntry {
    return {
      id: this.entry.id!,
      actorId: this.entry.actorId!,
      actorType: this.entry.actorType!,
      actorName: this.entry.actorName,
      eventType: this.entry.eventType!,
      action: this.entry.action!,
      resource: this.entry.resource!,
      resourceId: this.entry.resourceId,
      targetType: this.entry.targetType,
      targetId: this.entry.targetId,
      targetName: this.entry.targetName,
      timestamp: this.entry.timestamp!,
      result: this.entry.result!,
      success: this.entry.success!,
      failureReason: this.entry.failureReason,
      errorCode: this.entry.errorCode,
      metadata: this.entry.metadata,
      ipAddress: this.entry.ipAddress,
      userAgent: this.entry.userAgent,
      sessionId: this.entry.sessionId,
    };
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Audit Service
 *
 * Service for recording and querying audit logs.
 */
export class AuditService {
  private readonly logger: ILogger;
  private readonly auditLogs: AuditLogEntry[] = [];
  private readonly maxLogs: number;

  /**
   * Creates a new AuditService instance.
   * @param maxLogs Maximum number of logs to keep in memory (default: 10000)
   */
  constructor(maxLogs: number = 10000) {
    this.logger = getLogger().child({ module: 'AuditService' });
    this.maxLogs = maxLogs;
  }

  // #region Logging
  // ================================================================================

  /**
   * Records an audit log entry.
   * @param entry The audit entry to record
   */
  log(entry: AuditLogEntry): void {
    // Store in memory
    this.auditLogs.push(entry);

    // Trim if exceeds max
    if (this.auditLogs.length > this.maxLogs) {
      this.auditLogs.shift();
    }

    // Log to application logger
    this.logger.info('Audit log', {
      eventType: entry.eventType,
      actorId: entry.actorId,
      action: entry.action,
      resource: entry.resource,
      result: entry.result,
      success: entry.success,
    });
  }

  /**
   * Creates and logs an audit entry from a builder.
   * @param builder The audit entry builder
   */
  logFromBuilder(builder: AuditEntryBuilder): void {
    this.log(builder.build());
  }

  /**
   * Logs a successful admin action.
   */
  logSuccess(
    actorId: string,
    actorType: 'admin' | 'system',
    eventType: AuditEventType,
    action: string,
    resource: string,
    options?: {
      resourceId?: string;
      targetType?: string;
      targetId?: string;
      targetName?: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
    }
  ): void {
    const entry = new AuditEntryBuilder()
      .actor(actorId, actorType)
      .action(eventType, action, resource, options?.resourceId)
      .success()
      .metadata(options?.metadata ?? {})
      .context(options?.ipAddress, options?.userAgent, options?.sessionId);

    if (options?.targetType) {
      entry.target(options.targetType, options.targetId!, options?.targetName);
    }

    this.log(entry.build());
  }

  /**
   * Logs a failed admin action.
   */
  logFailure(
    actorId: string,
    actorType: 'admin' | 'system',
    eventType: AuditEventType,
    action: string,
    resource: string,
    reason: string,
    errorCode?: string,
    options?: {
      resourceId?: string;
      targetType?: string;
      targetId?: string;
      targetName?: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
    }
  ): void {
    const entry = new AuditEntryBuilder()
      .actor(actorId, actorType)
      .action(eventType, action, resource, options?.resourceId)
      .failure(reason, errorCode)
      .metadata(options?.metadata ?? {})
      .context(options?.ipAddress, options?.userAgent, options?.sessionId);

    if (options?.targetType) {
      entry.target(options.targetType, options.targetId!, options?.targetName);
    }

    this.log(entry.build());
  }

  // ================================================================================
  // #endregion

  // #region Querying
  // ================================================================================

  /**
   * Queries audit logs with filters.
   * @param filters Query filters
   * @returns Query result with paginated entries
   */
  query(filters: AuditQueryFilters = {}): AuditQueryResult {
    let results = [...this.auditLogs];

    // Apply filters
    if (filters.actorId) {
      results = results.filter((entry) => entry.actorId === filters.actorId);
    }

    if (filters.eventType) {
      results = results.filter((entry) => entry.eventType === filters.eventType);
    }

    if (filters.targetId) {
      results = results.filter((entry) => entry.targetId === filters.targetId);
    }

    if (filters.result) {
      results = results.filter((entry) => entry.result === filters.result);
    }

    if (filters.startDate) {
      results = results.filter((entry) => entry.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      results = results.filter((entry) => entry.timestamp <= filters.endDate!);
    }

    if (filters.resource) {
      results = results.filter((entry) => entry.resource === filters.resource);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      entries: results.slice(start, end),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Gets all audit logs for a specific admin.
   * @param adminId The admin ID to get logs for
   * @param limit Maximum number of logs to return
   * @returns Array of audit entries
   */
  getLogsForAdmin(adminId: string, limit: number = 100): AuditLogEntry[] {
    return this.auditLogs
      .filter((entry) => entry.actorId === adminId || entry.targetId === adminId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Gets audit logs for a specific resource.
   * @param resourceType The resource type
   * @param resourceId The resource ID
   * @param limit Maximum number of logs to return
   * @returns Array of audit entries
   */
  getLogsForResource(
    resourceType: string,
    resourceId: string,
    limit: number = 100
  ): AuditLogEntry[] {
    return this.auditLogs
      .filter(
        (entry) =>
          entry.resource === resourceType &&
          entry.resourceId === resourceId
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Gets recent audit logs.
   * @param limit Maximum number of logs to return
   * @returns Array of recent audit entries
   */
  getRecentLogs(limit: number = 50): AuditLogEntry[] {
    return this.auditLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Gets failed operations.
   * @param limit Maximum number of logs to return
   * @returns Array of failed audit entries
   */
  getFailedOperations(limit: number = 100): AuditLogEntry[] {
    return this.auditLogs
      .filter((entry) => entry.result === AuditResult.FAILURE)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // ================================================================================
  // #endregion

  // #region Statistics
  // ================================================================================

  /**
   * Gets audit statistics.
   * @returns Statistics object
   */
  getStatistics(): {
    totalLogs: number;
    successCount: number;
    failureCount: number;
    byEventType: Record<string, number>;
    byResource: Record<string, number>;
  } {
    const stats = {
      totalLogs: this.auditLogs.length,
      successCount: 0,
      failureCount: 0,
      byEventType: {} as Record<string, number>,
      byResource: {} as Record<string, number>,
    };

    for (const entry of this.auditLogs) {
      if (entry.success) {
        stats.successCount++;
      } else {
        stats.failureCount++;
      }

      stats.byEventType[entry.eventType] = (stats.byEventType[entry.eventType] || 0) + 1;
      stats.byResource[entry.resource] = (stats.byResource[entry.resource] || 0) + 1;
    }

    return stats;
  }

  // ================================================================================
  // #endregion

  // #region Utility
  // ================================================================================

  /**
   * Clears all audit logs.
   */
  clear(): void {
    this.auditLogs.length = 0;
    this.logger.info('Audit logs cleared');
  }

  /**
   * Exports audit logs to JSON format.
   * @param filters Optional filters for export
   * @returns JSON string of audit logs
   */
  exportToJson(filters?: AuditQueryFilters): string {
    const results = this.query({ ...filters, pageSize: this.maxLogs });
    return JSON.stringify(results.entries, null, 2);
  }

  /**
   * Creates a new audit entry builder.
   */
  createEntry(): AuditEntryBuilder {
    return new AuditEntryBuilder();
  }

  // ================================================================================
  // #endregion
}

/**
 * Default audit service instance.
 */
let auditServiceInstance: AuditService | null = null;

/**
 * Gets the default audit service instance.
 */
export function getAuditService(): AuditService {
  if (!auditServiceInstance) {
    auditServiceInstance = new AuditService();
  }
  return auditServiceInstance;
}