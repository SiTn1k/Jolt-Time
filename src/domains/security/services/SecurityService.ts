/**
 * Security Service
 *
 * Core security service for managing security incidents, policies, sessions,
 * brute force protection, fraud detection, and permissions.
 *
 * IMPORTANT: Security is a PROTECTION layer. It ONLY:
 * - Detects threats
 * - Evaluates policies
 * - Creates incidents
 * - Manages sessions
 * - Tracks violations
 *
 * Security MUST NEVER:
 * - Grant rewards
 * - Modify gameplay
 * - Modify balances
 * - Modify inventory
 * - Execute business logic
 * - Automatically ban players
 */

import type { ISecurityRepository } from '../interfaces/ISecurityRepository';
import type { ILogger } from '../../../shared/types';
import { getLogger } from '../../../core/logging/logger.service';
import { SecurityIncident } from '../entities/SecurityIncident';
import { IncidentSeverity } from '../types/IncidentSeverity';
import { IncidentStatus } from '../types/IncidentStatus';
import { SecurityPolicy } from '../entities/SecurityPolicy';
import { SecuritySession } from '../entities/SecuritySession';
import { SessionStatus } from '../types/SessionStatus';
import { PolicyType } from '../types/PolicyType';
import type { IncidentMetadata } from '../types/SecurityMetadata';
import type { SecurityStatistics } from '../types/SecurityStatistics';
import { INITIAL_SECURITY_STATISTICS } from '../types/SecurityStatistics';
import type { PaginationParams } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { createSecurityIncidentCreatedEvent, type SecurityIncidentCreatedEvent } from '../events/SecurityIncidentCreated.event';
import { createSecuritySessionCreatedEvent, type SecuritySessionCreatedEvent } from '../events/SecuritySessionCreated.event';
import { createSecuritySessionClosedEvent, type SecuritySessionClosedEvent } from '../events/SecuritySessionClosed.event';
import { IncidentId } from '../value-objects/IncidentId';
import { PolicyId } from '../value-objects/PolicyId';
import { SecuritySessionId } from '../value-objects/SecuritySessionId';

// Permission Types
export enum Permission {
  PLAYER = 'player',
  MODERATOR = 'moderator',
  ADMINISTRATOR = 'administrator',
  SYSTEM = 'system',
  SCHEDULER = 'scheduler',
  SERVICE = 'service',
}

export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  EXECUTE = 'execute',
}

// Session Protection Types
export interface SessionValidationResult {
  isValid: boolean;
  session?: SecuritySession;
  reason?: string;
}

export interface SessionProtectionConfig {
  maxConcurrentSessions: number;
  sessionTtlMinutes: number;
  refreshThresholdMinutes: number;
  enableIpTracking: boolean;
  enableDeviceFingerprinting: boolean;
}

// Brute Force Protection Types
export interface BruteForceProtectionConfig {
  maxAttempts: number;
  cooldownMinutes: number;
  lockoutMinutes: number;
  progressiveDelay: boolean;
  delayMultiplier: number;
  maxDelayMinutes: number;
  resetAfterMinutes: number;
}

export interface BruteForceStatus {
  isLocked: boolean;
  attempts: number;
  lastAttempt: Date | null;
  lockedUntil: Date | null;
  nextRetryAfter: Date | null;
}

// Fraud Detection Types
export interface FraudDetectionConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  duplicateRequestWindowMs: number;
  suspiciousSessionThreshold: number;
  configTamperingScore: number;
  abnormalBehaviorScore: number;
}

export interface FraudDetectionResult {
  isSuspicious: boolean;
  incidentType?: string;
  severity?: IncidentSeverity;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Policy Evaluation Types
export interface PolicyEvaluationResult {
  allowed: boolean;
  policyId?: string;
  policyName?: string;
  reason?: string;
}

/**
 * Security Service
 *
 * Core service for all security operations.
 */
export class SecurityService {
  private readonly repository: ISecurityRepository;
  private readonly logger: ILogger;

  // Configuration defaults
  private sessionProtectionConfig: SessionProtectionConfig = {
    maxConcurrentSessions: 3,
    sessionTtlMinutes: 60,
    refreshThresholdMinutes: 15,
    enableIpTracking: true,
    enableDeviceFingerprinting: true,
  };

  private bruteForceProtectionConfig: BruteForceProtectionConfig = {
    maxAttempts: 5,
    cooldownMinutes: 15,
    lockoutMinutes: 30,
    progressiveDelay: true,
    delayMultiplier: 2,
    maxDelayMinutes: 60,
    resetAfterMinutes: 60,
  };

  private fraudDetectionConfig: FraudDetectionConfig = {
    maxRequestsPerMinute: 100,
    maxRequestsPerHour: 1000,
    duplicateRequestWindowMs: 5000,
    suspiciousSessionThreshold: 50,
    configTamperingScore: 80,
    abnormalBehaviorScore: 70,
  };

  // In-memory tracking for brute force (in production, use Redis)
  private readonly bruteForceTracker = new Map<string, BruteForceStatus>();

  // In-memory tracking for request rates (in production, use Redis)
  private readonly requestTracker = new Map<string, number[]>();

  // Permission matrix
  private readonly permissionMatrix: Record<Permission, PermissionAction[]> = {
    [Permission.PLAYER]: [PermissionAction.READ],
    [Permission.MODERATOR]: [PermissionAction.READ, PermissionAction.WRITE],
    [Permission.ADMINISTRATOR]: [PermissionAction.READ, PermissionAction.WRITE, PermissionAction.DELETE, PermissionAction.ADMIN],
    [Permission.SYSTEM]: [PermissionAction.READ, PermissionAction.WRITE, PermissionAction.DELETE, PermissionAction.ADMIN, PermissionAction.EXECUTE],
    [Permission.SCHEDULER]: [PermissionAction.EXECUTE],
    [Permission.SERVICE]: [PermissionAction.READ, PermissionAction.EXECUTE],
  };

  /**
   * Creates a new SecurityService instance.
   */
  constructor(repository: ISecurityRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? getLogger().child({ module: 'SecurityService' });
  }

  // ============ Session Management ============

  /**
   * Creates a new security session.
   */
  async createSession(params: {
    actorId: string;
    ipAddress: string;
    device: string;
    metadata?: Record<string, unknown>;
  }): Promise<SecuritySession> {
    this.logger.debug('Creating security session', { actorId: params.actorId });

    // Check concurrent sessions
    const concurrentCheck = await this.checkConcurrentSessions(params.actorId);
    if (!concurrentCheck.allowed) {
      this.logger.warn('Concurrent session limit exceeded', { actorId: params.actorId });
      // Create incident for concurrent session violation
      await this.createIncident({
        incidentType: 'concurrent_session_violation',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        actorId: params.actorId,
        source: 'session_management',
        description: `Concurrent session limit (${this.sessionProtectionConfig.maxConcurrentSessions}) exceeded`,
        metadata: { ipAddress: params.ipAddress, device: params.device },
      });
    }

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.sessionProtectionConfig.sessionTtlMinutes);

    // Create session
    const session = SecuritySession.create({
      actorId: params.actorId,
      status: SessionStatus.ACTIVE,
      ipAddress: params.ipAddress,
      device: params.device,
      expiresAt,
      metadata: params.metadata,
    });

    const createdSession = await this.repository.createSession(session);

    this.logger.info('Security session created', {
      sessionId: createdSession.sessionId.value,
      actorId: params.actorId,
    });

    return createdSession;
  }

  /**
   * Finds and validates a session.
   */
  async findSession(sessionId: string): Promise<SessionValidationResult> {
    try {
      const session = await this.repository.findSessionById(
        SecuritySessionId.reconstruct(sessionId)
      );

      if (!session) {
        return { isValid: false, reason: 'Session not found' };
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        return { isValid: false, session, reason: 'Session expired' };
      }

      // Check if session is still active
      if (session.status !== SessionStatus.ACTIVE) {
        return { isValid: false, session, reason: `Session status is ${session.status}` };
      }

      return { isValid: true, session };
    } catch (error) {
      this.logger.error('Error finding session', error instanceof Error ? error : new Error(String(error)));
      return { isValid: false, reason: 'Error validating session' };
    }
  }

  /**
   * Closes a security session.
   */
  async closeSession(sessionId: string, reason?: string): Promise<void> {
    try {
      const session = await this.repository.findSessionById(
        SecuritySessionId.reconstruct(sessionId)
      );

      if (!session) {
        this.logger.warn('Session not found for closure', { sessionId });
        return;
      }

      // Calculate session duration
      const durationMs = new Date().getTime() - session.createdAt.getTime();

      // Update session status
      await this.repository.updateSession(
        SecuritySessionId.reconstruct(sessionId),
        { status: SessionStatus.REVOKED }
      );

      this.logger.info('Security session closed', {
        sessionId,
        actorId: session.actorId,
        reason,
        durationMs,
      });
    } catch (error) {
      this.logger.error('Error closing session', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Refreshes a session, extending its expiration.
   */
  async refreshSession(sessionId: string): Promise<SecuritySession | null> {
    try {
      const session = await this.repository.findSessionById(
        SecuritySessionId.reconstruct(sessionId)
      );

      if (!session || session.status !== SessionStatus.ACTIVE) {
        return null;
      }

      // Check if session is not too old to refresh
      const timeSinceCreation = new Date().getTime() - session.createdAt.getTime();
      const maxRefreshAge = this.sessionProtectionConfig.sessionTtlMinutes * 60 * 1000;
      if (timeSinceCreation > maxRefreshAge) {
        return null;
      }

      // Calculate new expiration
      const newExpiresAt = new Date();
      newExpiresAt.setMinutes(newExpiresAt.getMinutes() + this.sessionProtectionConfig.sessionTtlMinutes);

      // Update session
      const updatedSession = await this.repository.updateSession(
        SecuritySessionId.reconstruct(sessionId),
        { expiresAt: newExpiresAt }
      );

      this.logger.debug('Session refreshed', { sessionId, newExpiresAt });
      return updatedSession;
    } catch (error) {
      this.logger.error('Error refreshing session', error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  /**
   * Checks if actor can create another session.
   */
  private async checkConcurrentSessions(actorId: string): Promise<PolicyEvaluationResult> {
    const activeSessions = await this.repository.countSessions({ actorId, activeOnly: true });

    if (activeSessions >= this.sessionProtectionConfig.maxConcurrentSessions) {
      return {
        allowed: false,
        reason: `Maximum concurrent sessions (${this.sessionProtectionConfig.maxConcurrentSessions}) reached`,
      };
    }

    return { allowed: true };
  }

  /**
   * Validates session IP address matches.
   */
  async validateSessionIp(sessionId: string, currentIp: string): Promise<boolean> {
    if (!this.sessionProtectionConfig.enableIpTracking) {
      return true;
    }

    try {
      const session = await this.repository.findSessionById(
        SecuritySessionId.reconstruct(sessionId)
      );

      if (!session) {
        return false;
      }

      // Allow if IP matches or if IP tracking is disabled
      return session.ipAddress === currentIp;
    } catch {
      return false;
    }
  }

  // ============ Incident Management ============

  /**
   * Creates a security incident.
   */
  async createIncident(params: {
    incidentType: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    actorId: string;
    source: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<SecurityIncident> {
    this.logger.debug('Creating security incident', { incidentType: params.incidentType, actorId: params.actorId });

    const incident = SecurityIncident.create({
      incidentType: params.incidentType,
      severity: params.severity,
      status: params.status,
      actorId: params.actorId,
      source: params.source,
      description: params.description,
      metadata: params.metadata,
    });

    const createdIncident = await this.repository.createIncident(incident);

    this.logger.info('Security incident created', {
      incidentId: createdIncident.incidentId.value,
      incidentType: params.incidentType,
      severity: params.severity,
    });

    return createdIncident;
  }

  /**
   * Finds an incident by ID.
   */
  async findIncident(incidentId: string): Promise<SecurityIncident | null> {
    return this.repository.findIncidentById(IncidentId.reconstruct(incidentId));
  }

  /**
   * Lists incidents with pagination and filtering.
   */
  async listIncidents(
    params: PaginationParams,
    filters?: {
      actorId?: string;
      incidentType?: string;
      severity?: IncidentSeverity;
      status?: IncidentStatus;
      source?: string;
    }
  ): Promise<{ items: SecurityIncident[]; total: number }> {
    const result = await this.repository.listIncidents(params, filters);
    return { items: result.items, total: result.total };
  }

  /**
   * Gets incident summary statistics.
   */
  async getIncidentSummary(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const [total, openResult, criticalResult, highResult, mediumResult, lowResult] = await Promise.all([
      this.repository.countIncidents(),
      this.repository.countIncidents({ status: IncidentStatus.OPEN }),
      this.repository.countIncidents({ status: IncidentStatus.ESCALATED }),
      this.repository.countIncidents({ severity: IncidentSeverity.HIGH }),
      this.repository.countIncidents({ severity: IncidentSeverity.MEDIUM }),
      this.repository.countIncidents({ severity: IncidentSeverity.LOW }),
    ]);

    // Get incidents by type (sample)
    const recentIncidents = await this.repository.listIncidents({ page: 1, pageSize: 100 }, {});
    const byType: Record<string, number> = {};
    for (const incident of recentIncidents.items) {
      byType[incident.incidentType] = (byType[incident.incidentType] || 0) + 1;
    }

    return {
      total,
      bySeverity: {
        critical: criticalResult,
        high: highResult,
        medium: mediumResult,
        low: lowResult,
      },
      byStatus: {
        open: openResult,
        escalated: criticalResult,
      },
      byType,
    };
  }

  // ============ Policy Management ============

  /**
   * Creates a new security policy.
   */
  async createPolicy(params: {
    policyName: string;
    policyType: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): Promise<SecurityPolicy> {
    const policy = SecurityPolicy.create({
      policyName: params.policyName,
      policyType: params.policyType as PolicyType,
      enabled: params.enabled ?? true,
      configuration: params.configuration ?? {},
      metadata: params.metadata ?? {},
    });

    return this.repository.createPolicy(policy);
  }

  /**
   * Finds a policy by ID.
   */
  async findPolicy(policyId: string): Promise<SecurityPolicy | null> {
    return this.repository.findPolicyById(PolicyId.reconstruct(policyId));
  }

  /**
   * Updates a security policy.
   */
  async updatePolicy(params: {
    policyId: string;
    policyName?: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): Promise<SecurityPolicy | null> {
    return this.repository.updatePolicy(
      PolicyId.reconstruct(params.policyId),
      {
        policyName: params.policyName,
        enabled: params.enabled,
        configuration: params.configuration,
        metadata: params.metadata,
      }
    );
  }

  /**
   * Evaluates a policy for a given context.
   */
  async evaluatePolicy(params: {
    policyType: string;
    context: Record<string, unknown>;
  }): Promise<PolicyEvaluationResult> {
    try {
      const policies = await this.repository.listPolicies(
        { page: 1, pageSize: 100 },
        { policyType: params.policyType, enabled: true }
      );

      if (policies.items.length === 0) {
        return { allowed: true, reason: 'No matching policy found' };
      }

      // For now, return based on first matching policy
      const policy = policies.items[0];
      const config = policy.configuration;

      // Check if required fields are present
      if (!config || typeof config !== 'object') {
        return { allowed: true, policyId: policy.policyId.value, policyName: policy.policyName };
      }

      // Simple evaluation based on configuration
      // In production, this would be more sophisticated
      return {
        allowed: true,
        policyId: policy.policyId.value,
        policyName: policy.policyName,
        reason: 'Policy evaluated successfully',
      };
    } catch (error) {
      this.logger.error('Error evaluating policy', error instanceof Error ? error : new Error(String(error)));
      return { allowed: true, reason: 'Policy evaluation error - defaulting to allowed' };
    }
  }

  // ============ Brute Force Protection ============

  /**
   * Records a failed login attempt.
   */
  async recordFailedAttempt(actorId: string): Promise<BruteForceStatus> {
    const currentStatus = this.bruteForceTracker.get(actorId) || {
      isLocked: false,
      attempts: 0,
      lastAttempt: null,
      lockedUntil: null,
      nextRetryAfter: null,
    };

    currentStatus.attempts++;
    currentStatus.lastAttempt = new Date();

    // Check if should be locked
    if (currentStatus.attempts >= this.bruteForceProtectionConfig.maxAttempts) {
      currentStatus.isLocked = true;
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + this.bruteForceProtectionConfig.lockoutMinutes);
      currentStatus.lockedUntil = lockUntil;

      // Create incident for brute force lockout
      await this.createIncident({
        incidentType: 'brute_force_lockout',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        actorId,
        source: 'brute_force_protection',
        description: `Account locked due to ${currentStatus.attempts} failed login attempts`,
        metadata: {
          attempts: currentStatus.attempts,
          lockedUntil: lockUntil.toISOString(),
        },
      });
    }

    this.bruteForceTracker.set(actorId, currentStatus);
    return currentStatus;
  }

  /**
   * Records a successful login, resetting attempts.
   */
  async recordSuccessfulLogin(actorId: string): Promise<void> {
    this.bruteForceTracker.delete(actorId);
  }

  /**
   * Checks if an actor is locked out.
   */
  async checkBruteForceLockout(actorId: string): Promise<BruteForceStatus> {
    const currentStatus = this.bruteForceTracker.get(actorId);

    if (!currentStatus) {
      return {
        isLocked: false,
        attempts: 0,
        lastAttempt: null,
        lockedUntil: null,
        nextRetryAfter: null,
      };
    }

    // Check if lockout has expired
    if (currentStatus.isLocked && currentStatus.lockedUntil && currentStatus.lockedUntil < new Date()) {
      currentStatus.isLocked = false;
      currentStatus.lockedUntil = null;
      currentStatus.attempts = 0;
      this.bruteForceTracker.set(actorId, currentStatus);
    }

    return currentStatus;
  }

  /**
   * Gets the delay before retrying after failed attempts.
   */
  async getRetryDelay(actorId: string): Promise<number> {
    const status = await this.checkBruteForceLockout(actorId);

    if (!status.isLocked) {
      return 0;
    }

    if (this.bruteForceProtectionConfig.progressiveDelay) {
      // Progressive delay: base * multiplier^(attempts-1)
      const baseDelay = this.bruteForceProtectionConfig.cooldownMinutes * 60 * 1000;
      const delay = baseDelay * Math.pow(this.bruteForceProtectionConfig.delayMultiplier, status.attempts - 1);
      return Math.min(delay, this.bruteForceProtectionConfig.maxDelayMinutes * 60 * 1000);
    }

    return this.bruteForceProtectionConfig.cooldownMinutes * 60 * 1000;
  }

  /**
   * Cleans up expired brute force tracking entries.
   */
  async cleanupBruteForceTracker(): Promise<void> {
    const now = new Date();
    for (const [actorId, status] of this.bruteForceTracker.entries()) {
      if (status.lastAttempt) {
        const age = now.getTime() - status.lastAttempt.getTime();
        const maxAge = this.bruteForceProtectionConfig.resetAfterMinutes * 60 * 1000;
        if (age > maxAge) {
          this.bruteForceTracker.delete(actorId);
        }
      }
    }
  }

  // ============ Fraud Detection ============

  /**
   * Detects potential fraud based on request patterns.
   */
  async detectFraud(params: {
    actorId: string;
    action: string;
    ipAddress: string;
    timestamp?: Date;
  }): Promise<FraudDetectionResult> {
    const timestamp = params.timestamp || new Date();
    const key = `${params.actorId}:${params.action}`;

    // Track request
    const requests = this.requestTracker.get(key) || [];
    requests.push(timestamp.getTime());
    this.requestTracker.set(key, requests);

    // Clean old requests
    const oneHourAgo = timestamp.getTime() - 60 * 60 * 1000;
    const recentRequests = requests.filter((t) => t > oneHourAgo);

    // Check for impossible request frequency
    const requestsLastMinute = recentRequests.filter(
      (t) => timestamp.getTime() - t < 60 * 1000
    ).length;

    if (requestsLastMinute > this.fraudDetectionConfig.maxRequestsPerMinute) {
      const incident = await this.createIncident({
        incidentType: 'impossible_request_frequency',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        actorId: params.actorId,
        source: 'fraud_detection',
        description: `Request frequency too high: ${requestsLastMinute} requests/minute (max: ${this.fraudDetectionConfig.maxRequestsPerMinute})`,
        metadata: {
          requestsPerMinute: requestsLastMinute,
          maxAllowed: this.fraudDetectionConfig.maxRequestsPerMinute,
          action: params.action,
          ipAddress: params.ipAddress,
        },
      });

      return {
        isSuspicious: true,
        incidentType: 'impossible_request_frequency',
        severity: IncidentSeverity.HIGH,
        description: incident.description,
        metadata: incident.metadata as Record<string, unknown>,
      };
    }

    // Check for duplicate requests
    const duplicateWindow = this.fraudDetectionConfig.duplicateRequestWindowMs;
    const duplicatesInWindow = recentRequests.filter(
      (t) => timestamp.getTime() - t < duplicateWindow
    ).length;

    if (duplicatesInWindow > 1) {
      const incident = await this.createIncident({
        incidentType: 'duplicate_requests',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        actorId: params.actorId,
        source: 'fraud_detection',
        description: `Duplicate requests detected: ${duplicatesInWindow} requests in ${duplicateWindow}ms window`,
        metadata: {
          duplicateCount: duplicatesInWindow,
          windowMs: duplicateWindow,
          action: params.action,
          ipAddress: params.ipAddress,
        },
      });

      return {
        isSuspicious: true,
        incidentType: 'duplicate_requests',
        severity: IncidentSeverity.MEDIUM,
        description: incident.description,
        metadata: incident.metadata as Record<string, unknown>,
      };
    }

    return { isSuspicious: false };
  }

  /**
   * Detects suspicious session behavior.
   */
  async detectSuspiciousSession(params: {
    sessionId: string;
    actorId: string;
    currentIp: string;
    device: string;
  }): Promise<FraudDetectionResult> {
    try {
      const session = await this.repository.findSessionById(
        SecuritySessionId.reconstruct(params.sessionId)
      );

      if (!session) {
        return { isSuspicious: false };
      }

      const suspiciousIndicators: string[] = [];

      // Check IP change
      if (session.ipAddress !== params.currentIp) {
        suspiciousIndicators.push('ip_change');
      }

      // Check device change
      if (session.device !== params.device) {
        suspiciousIndicators.push('device_change');
      }

      // Calculate session age
      const sessionAge = new Date().getTime() - session.createdAt.getTime();
      const veryNewSession = sessionAge < 5000; // Less than 5 seconds
      if (veryNewSession) {
        suspiciousIndicators.push('very_new_session');
      }

      if (suspiciousIndicators.length > 0) {
        const incident = await this.createIncident({
          incidentType: 'suspicious_session',
          severity: IncidentSeverity.MEDIUM,
          status: IncidentStatus.OPEN,
          actorId: params.actorId,
          source: 'session_monitoring',
          description: `Suspicious session indicators: ${suspiciousIndicators.join(', ')}`,
          metadata: {
            indicators: suspiciousIndicators,
            sessionIp: session.ipAddress,
            currentIp: params.currentIp,
            sessionDevice: session.device,
            currentDevice: params.device,
            sessionAgeMs: sessionAge,
          },
        });

        return {
          isSuspicious: true,
          incidentType: 'suspicious_session',
          severity: IncidentSeverity.MEDIUM,
          description: incident.description,
          metadata: incident.metadata as Record<string, unknown>,
        };
      }

      return { isSuspicious: false };
    } catch (error) {
      this.logger.error('Error detecting suspicious session', error instanceof Error ? error : new Error(String(error)));
      return { isSuspicious: false };
    }
  }

  /**
   * Detects configuration tampering attempts.
   */
  async detectConfigTampering(params: {
    actorId: string;
    configType: string;
    expectedValue: unknown;
    receivedValue: unknown;
  }): Promise<FraudDetectionResult> {
    // Check if values differ significantly
    const isTampered = JSON.stringify(params.expectedValue) !== JSON.stringify(params.receivedValue);

    if (isTampered) {
      const incident = await this.createIncident({
        incidentType: 'configuration_tampering',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        actorId: params.actorId,
        source: 'fraud_detection',
        description: `Configuration tampering detected: ${params.configType}`,
        metadata: {
          configType: params.configType,
          expectedValue: params.expectedValue,
          receivedValue: params.receivedValue,
        },
      });

      return {
        isSuspicious: true,
        incidentType: 'configuration_tampering',
        severity: IncidentSeverity.HIGH,
        description: incident.description,
        metadata: incident.metadata as Record<string, unknown>,
      };
    }

    return { isSuspicious: false };
  }

  // ============ Permission Evaluation ============

  /**
   * Checks if a permission has a specific action.
   */
  hasPermission(permission: Permission, action: PermissionAction): boolean {
    return this.permissionMatrix[permission]?.includes(action) ?? false;
  }

  /**
   * Evaluates if an actor can perform an action.
   */
  async evaluatePermission(params: {
    actorId: string;
    permission: Permission;
    action: PermissionAction;
    resourceId?: string;
  }): Promise<boolean> {
    // System and Scheduler always have all permissions
    if (params.permission === Permission.SYSTEM || params.permission === Permission.SCHEDULER) {
      return true;
    }

    // Check basic permission
    const hasAction = this.hasPermission(params.permission, params.action);
    if (!hasAction) {
      // Create incident for unauthorized access attempt
      await this.createIncident({
        incidentType: 'unauthorized_access_attempt',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        actorId: params.actorId,
        source: 'permission_engine',
        description: `Unauthorized access attempt: ${params.permission} attempted ${params.action} on resource ${params.resourceId || 'unknown'}`,
        metadata: {
          permission: params.permission,
          action: params.action,
          resourceId: params.resourceId,
        },
      });
      return false;
    }

    return true;
  }

  // ============ Statistics ============

  /**
   * Gets comprehensive security statistics.
   */
  async getSecurityStatistics(): Promise<SecurityStatistics> {
    try {
      const [
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        closedIncidents,
        criticalIncidents,
        highIncidents,
        mediumIncidents,
        lowIncidents,
        activeSessions,
        revokedSessions,
        expiredSessions,
        enabledPolicies,
        disabledPolicies,
      ] = await Promise.all([
        this.repository.countIncidents(),
        this.repository.countIncidents({ status: IncidentStatus.OPEN }),
        this.repository.countIncidents({ status: IncidentStatus.RESOLVED }),
        this.repository.countIncidents({ status: IncidentStatus.CLOSED }),
        this.repository.countIncidents({ severity: IncidentSeverity.CRITICAL }),
        this.repository.countIncidents({ severity: IncidentSeverity.HIGH }),
        this.repository.countIncidents({ severity: IncidentSeverity.MEDIUM }),
        this.repository.countIncidents({ severity: IncidentSeverity.LOW }),
        this.repository.countSessions({ activeOnly: true }),
        this.repository.countSessions({ status: SessionStatus.REVOKED }),
        this.repository.countSessions({ status: SessionStatus.EXPIRED }),
        this.repository.countPolicies({ enabled: true }),
        this.repository.countPolicies({ enabled: false }),
      ]);

      // Get incidents by type
      const recentIncidents = await this.repository.listIncidents({ page: 1, pageSize: 500 }, {});
      const incidentsByType: Record<string, number> = {};
      const incidentsBySource: Record<string, number> = {};

      for (const incident of recentIncidents.items) {
        incidentsByType[incident.incidentType] = (incidentsByType[incident.incidentType] || 0) + 1;
        incidentsBySource[incident.source] = (incidentsBySource[incident.source] || 0) + 1;
      }

      // Calculate average resolution time (simplified)
      const averageResolutionTime = 0;

      return {
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        closedIncidents,
        criticalIncidents,
        highIncidents,
        mediumIncidents,
        lowIncidents,
        activeSessions,
        revokedSessions,
        expiredSessions,
        enabledPolicies,
        disabledPolicies,
        incidentsByType,
        incidentsBySource,
        averageResolutionTime,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting security statistics', error instanceof Error ? error : new Error(String(error)));
      return {
        ...INITIAL_SECURITY_STATISTICS,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // ============ Configuration ============

  /**
   * Updates session protection configuration.
   */
  updateSessionProtectionConfig(config: Partial<SessionProtectionConfig>): void {
    this.sessionProtectionConfig = { ...this.sessionProtectionConfig, ...config };
    this.logger.info('Session protection config updated', { config: this.sessionProtectionConfig as unknown as Record<string, unknown> });
  }

  /**
   * Updates brute force protection configuration.
   */
  updateBruteForceProtectionConfig(config: Partial<BruteForceProtectionConfig>): void {
    this.bruteForceProtectionConfig = { ...this.bruteForceProtectionConfig, ...config };
    this.logger.info('Brute force protection config updated', { config: this.bruteForceProtectionConfig as unknown as Record<string, unknown> });
  }

  /**
   * Updates fraud detection configuration.
   */
  updateFraudDetectionConfig(config: Partial<FraudDetectionConfig>): void {
    this.fraudDetectionConfig = { ...this.fraudDetectionConfig, ...config };
    this.logger.info('Fraud detection config updated', { config: this.fraudDetectionConfig as unknown as Record<string, unknown> });
  }

  /**
   * Gets current configuration.
   */
  getConfiguration(): {
    sessionProtection: SessionProtectionConfig;
    bruteForceProtection: BruteForceProtectionConfig;
    fraudDetection: FraudDetectionConfig;
  } {
    return {
      sessionProtection: { ...this.sessionProtectionConfig },
      bruteForceProtection: { ...this.bruteForceProtectionConfig },
      fraudDetection: { ...this.fraudDetectionConfig },
    };
  }
}
