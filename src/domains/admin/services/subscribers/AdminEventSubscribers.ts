/**
 * Admin Event Subscribers
 *
 * Built-in event subscribers for admin domain events.
 * Handles side effects and integrations when admin events occur.
 */

import type { EventEmitter } from '../../../core/event-bus';
import type { AdminCreatedEvent } from '../../events/AdminCreated.event';
import type { AdminRoleChangedEvent } from '../../events/AdminRoleChanged.event';
import type { AdminPermissionUpdatedEvent } from '../../events/AdminPermissionUpdated.event';
import type { AdminLoggedInEvent } from '../../events/AdminLoggedIn.event';
import { AuditService, AuditEventType, AuditResult } from '../AuditService';
import type { ILogger } from '../../../shared/types';
import { getLogger } from '../../../core/logging/logger.service';

/**
 * Admin event subscriber configuration.
 */
export interface AdminEventSubscriberConfig {
  /** Whether to enable audit logging */
  enableAuditLogging: boolean;

  /** Whether to enable notifications */
  enableNotifications: boolean;

  /** Custom audit service (uses default if not provided) */
  auditService?: AuditService;

  /** Custom event emitter for publishing events */
  eventEmitter?: EventEmitter;
}

/**
 * Admin Event Subscribers
 *
 * Handles all admin domain events and triggers appropriate side effects.
 */
export class AdminEventSubscribers {
  private readonly logger: ILogger;
  private readonly auditService: AuditService;
  private readonly config: AdminEventSubscriberConfig;

  /**
   * Creates a new AdminEventSubscribers instance.
   */
  constructor(config: AdminEventSubscriberConfig) {
    this.config = config;
    this.auditService = config.auditService ?? new AuditService();
    this.logger = getLogger().child({ module: 'AdminEventSubscribers' });
  }

  /**
   * Registers all event handlers with an event emitter.
   * @param eventEmitter The event emitter to register with
   */
  register(eventEmitter: EventEmitter): void {
    // Admin Created
    eventEmitter.on('admin:created', this.handleAdminCreated.bind(this));

    // Admin Role Changed
    eventEmitter.on('admin:role-changed', this.handleRoleChanged.bind(this));

    // Admin Permission Updated
    eventEmitter.on('admin:permission-updated', this.handlePermissionUpdated.bind(this));

    // Admin Logged In
    eventEmitter.on('admin:logged-in', this.handleLoggedIn.bind(this));

    this.logger.info('Admin event subscribers registered');
  }

  /**
   * Unregisters all event handlers.
   * @param eventEmitter The event emitter to unregister from
   */
  unregister(eventEmitter: EventEmitter): void {
    eventEmitter.off('admin:created', this.handleAdminCreated.bind(this));
    eventEmitter.off('admin:role-changed', this.handleRoleChanged.bind(this));
    eventEmitter.off('admin:permission-updated', this.handlePermissionUpdated.bind(this));
    eventEmitter.off('admin:logged-in', this.handleLoggedIn.bind(this));

    this.logger.info('Admin event subscribers unregistered');
  }

  // #region Event Handlers
  // ================================================================================

  /**
   * Handles admin created event.
   */
  private handleAdminCreated(event: AdminCreatedEvent): void {
    this.logger.info('Admin created event received', {
      adminId: event.data.adminId,
      telegramId: event.data.telegramId,
    });

    // Audit logging
    if (this.config.enableAuditLogging) {
      this.auditService.logSuccess(
        event.data.adminId,
        'admin',
        AuditEventType.ADMIN_CREATED,
        'create',
        'admin_account',
        {
          resourceId: event.data.adminId,
          metadata: {
            telegramId: event.data.telegramId,
            username: event.data.username,
            displayName: event.data.displayName,
            roleType: event.data.roleType,
            status: event.data.status,
          },
        }
      );
    }

    // Publish notification event for other subscribers
    if (this.config.enableNotifications && this.config.eventEmitter) {
      this.config.eventEmitter.emit('notification:admin_created', {
        adminId: event.data.adminId,
        displayName: event.data.displayName,
        roleType: event.data.roleType,
        occurredAt: event.data.occurredAt,
      });
    }
  }

  /**
   * Handles role changed event.
   */
  private handleRoleChanged(event: AdminRoleChangedEvent): void {
    this.logger.info('Role changed event received', {
      adminId: event.data.adminId,
      previousRoleId: event.data.previousRoleId,
      newRoleId: event.data.newRoleId,
      changedBy: event.data.changedBy,
    });

    // Audit logging
    if (this.config.enableAuditLogging) {
      this.auditService.logSuccess(
        event.data.changedBy,
        'admin',
        AuditEventType.ROLE_ASSIGNED,
        'assign_role',
        'admin_account',
        {
          resourceId: event.data.adminId,
          targetType: 'admin_role',
          targetId: event.data.newRoleId,
          metadata: {
            previousRoleId: event.data.previousRoleId,
            newRoleId: event.data.newRoleId,
            previousRoleType: event.data.previousRoleType,
            newRoleType: event.data.newRoleType,
            reason: event.data.reason,
          },
        }
      );
    }

    // Publish notification event
    if (this.config.enableNotifications && this.config.eventEmitter) {
      this.config.eventEmitter.emit('notification:admin_role_changed', {
        adminId: event.data.adminId,
        previousRoleType: event.data.previousRoleType,
        newRoleType: event.data.newRoleType,
        changedBy: event.data.changedBy,
        occurredAt: event.data.occurredAt,
      });
    }
  }

  /**
   * Handles permission updated event.
   */
  private handlePermissionUpdated(event: AdminPermissionUpdatedEvent): void {
    this.logger.info('Permission updated event received', {
      adminId: event.data.adminId,
      roleId: event.data.roleId,
    });

    // Audit logging
    if (this.config.enableAuditLogging) {
      this.auditService.logSuccess(
        event.data.updatedBy,
        'admin',
        AuditEventType.PERMISSION_UPDATED,
        'update',
        'admin_permission',
        {
          resourceId: event.data.roleId,
          targetType: 'admin_role',
          targetId: event.data.roleId,
          metadata: {
            addedPermissions: event.data.addedPermissions,
            removedPermissions: event.data.removedPermissions,
          },
        }
      );
    }

    // Publish notification event
    if (this.config.enableNotifications && this.config.eventEmitter) {
      this.config.eventEmitter.emit('notification:admin_permission_updated', {
        adminId: event.data.adminId,
        roleId: event.data.roleId,
        addedPermissions: event.data.addedPermissions,
        removedPermissions: event.data.removedPermissions,
        occurredAt: event.data.occurredAt,
      });
    }
  }

  /**
   * Handles logged in event.
   */
  private handleLoggedIn(event: AdminLoggedInEvent): void {
    this.logger.info('Logged in event received', {
      adminId: event.data.adminId,
      sessionId: event.data.sessionId,
      loginMethod: event.data.loginMethod,
    });

    // Audit logging
    if (this.config.enableAuditLogging) {
      this.auditService.logSuccess(
        event.data.adminId,
        'admin',
        AuditEventType.ADMIN_LOGIN,
        'login',
        'admin_session',
        {
          resourceId: event.data.sessionId,
          metadata: {
            loginMethod: event.data.loginMethod,
            ipAddress: event.data.ipAddress,
            userAgent: event.data.userAgent,
          },
          ipAddress: event.data.ipAddress,
          userAgent: event.data.userAgent,
          sessionId: event.data.sessionId,
        }
      );
    }
  }

  // ================================================================================
  // #endregion

  // #region Utility Methods
  // ================================================================================

  /**
   * Gets the audit service for querying logs.
   */
  getAuditService(): AuditService {
    return this.auditService;
  }

  // ================================================================================
  // #endregion
}

/**
 * Default admin event subscribers instance.
 */
let adminEventSubscribersInstance: AdminEventSubscribers | null = null;

/**
 * Creates and registers default admin event subscribers.
 */
export function setupAdminEventSubscribers(
  eventEmitter: EventEmitter,
  config?: Partial<AdminEventSubscriberConfig>
): AdminEventSubscribers {
  const subscribers = new AdminEventSubscribers({
    enableAuditLogging: config?.enableAuditLogging ?? true,
    enableNotifications: config?.enableNotifications ?? true,
    eventEmitter,
    auditService: config?.auditService,
  });

  subscribers.register(eventEmitter);
  adminEventSubscribersInstance = subscribers;

  return subscribers;
}

/**
 * Gets the default admin event subscribers instance.
 */
export function getAdminEventSubscribers(): AdminEventSubscribers | null {
  return adminEventSubscribersInstance;
}