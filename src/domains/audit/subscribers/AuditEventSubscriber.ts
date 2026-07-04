/**
 * Audit Event Subscriber
 *
 * Subscribes to domain events and automatically creates audit records.
 * This is the automatic audit collection system.
 *
 * IMPORTANT: Audit is an IMMUTABLE history layer. It ONLY stores records.
 * Audit MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 *
 * This subscriber ONLY records events - it NEVER executes business logic.
 */

import type { DomainEvent } from '../../../core/events/entities/DomainEvent';
import type { IEventHandler } from '../../../core/events/interfaces/IEventHandler';
import { HandlerId } from '../../../core/events/value-objects/HandlerId';
import { EventType } from '../../../core/events/value-objects/EventType';
import type { IAuditRepository } from '../interfaces/IAuditRepository';
import { AuditRecord } from '../entities/AuditRecord';
import { AuditActorId } from '../value-objects/AuditActorId';
import { AuditCategoryId } from '../value-objects/AuditCategoryId';
import { AuditAction } from '../types/AuditAction';
import { AuditResult } from '../types/AuditResult';
import { AuditActorType } from '../types/AuditActorType';
import { createLogger } from '../../../core/logging/logger.service';

/**
 * Event type patterns for audit collection.
 */
const AUDIT_EVENT_PATTERNS = {
  // Admin events
  ADMIN_CREATED: 'Admin.',
  ADMIN_UPDATED: 'Admin.',
  ADMIN_DELETED: 'Admin.',

  // Reward events
  REWARD_GRANTED: 'Reward.',
  REWARD_CLAIMED: 'Reward.',
  REWARD_EXPIRED: 'Reward.',

  // Configuration events
  CONFIG_CHANGED: 'Configuration.',
  CONFIG_UPDATED: 'Configuration.',

  // Scheduler events
  SCHEDULER_TRIGGERED: 'Scheduler.',
  SCHEDULER_COMPLETED: 'Scheduler.',

  // Authentication events
  AUTH_SUCCESS: 'Authentication.',
  AUTH_FAILED: 'Authentication.',
  AUTH_LOGOUT: 'Authentication.',

  // Player events
  PLAYER_CREATED: 'Player.',
  PLAYER_UPDATED: 'Player.',
  PLAYER_DELETED: 'Player.',

  // Guild events
  GUILD_CREATED: 'Guild.',
  GUILD_UPDATED: 'Guild.',
  GUILD_DELETED: 'Guild.',
  GUILD_MEMBER_JOINED: 'Guild.',
  GUILD_MEMBER_LEFT: 'Guild.',

  // System events
  SYSTEM_STARTED: 'System.',
  SYSTEM_STOPPED: 'System.',
  SYSTEM_ERROR: 'System.',
} as const;

/**
 * Maps event types to audit categories.
 */
const EVENT_CATEGORY_MAP: Record<string, string> = {
  Admin: 'administration',
  Reward: 'economy',
  Configuration: 'configuration',
  Scheduler: 'scheduler',
  Authentication: 'security',
  Player: 'gameplay',
  Guild: 'gameplay',
  System: 'system',
};

/**
 * Maps event types to audit actions.
 */
const EVENT_ACTION_MAP: Record<string, AuditAction> = {
  Created: AuditAction.ENTITY_CREATED,
  Updated: AuditAction.ENTITY_UPDATED,
  Deleted: AuditAction.ENTITY_DELETED,
  Granted: AuditAction.REWARD_DISTRIBUTED,
  Claimed: AuditAction.REWARD_CLAIMED,
  Expired: AuditAction.REWARD_CLAIMED,
  Changed: AuditAction.ENTITY_UPDATED,
  Triggered: AuditAction.SYSTEM_INITIALIZED,
  Completed: AuditAction.SYSTEM_INITIALIZED,
  Success: AuditAction.AUTHENTICATION_LOGIN,
  Failed: AuditAction.AUTHENTICATION_FAILED,
  Logout: AuditAction.AUTHENTICATION_LOGOUT,
  MemberJoined: AuditAction.GUILD_JOINED,
  MemberLeft: AuditAction.GUILD_LEFT,
  Started: AuditAction.SYSTEM_INITIALIZED,
  Stopped: AuditAction.SYSTEM_SHUTDOWN,
  Error: AuditAction.AUTHENTICATION_FAILED,
};

/**
 * Maps event types to audit actor types.
 */
const SOURCE_MODULE_ACTOR_TYPE_MAP: Record<string, AuditActorType> = {
  admin: AuditActorType.ADMIN,
  reward: AuditActorType.SYSTEM,
  configuration: AuditActorType.SYSTEM,
  scheduler: AuditActorType.SCHEDULER,
  authentication: AuditActorType.SERVICE,
  player: AuditActorType.PLAYER,
  guild: AuditActorType.PLAYER,
  system: AuditActorType.SYSTEM,
};

/**
 * Default actor ID for system-generated events.
 */
const SYSTEM_ACTOR_ID = 'system';

/**
 * Audit Event Subscriber
 * Automatically collects audit records from domain events.
 */
export class AuditEventSubscriber implements IEventHandler {
  public readonly handlerId: HandlerId;
  public readonly eventType: EventType;
  public readonly handlerName = 'AuditEventSubscriber';
  private readonly _repository: IAuditRepository;
  private readonly _logger = createLogger('AuditEventSubscriber');
  private readonly _isActive: boolean = true;

  /**
   * Creates a new AuditEventSubscriber instance.
   * @param repository The audit repository for storing audit records
   */
  constructor(repository: IAuditRepository) {
    this.handlerId = HandlerId.generate();
    this.eventType = EventType.reconstruct('DomainEvent'); // Subscribe to all domain events
    this._repository = repository;
  }

  /**
   * Handles a domain event by creating an audit record.
   * This method ONLY records events - it NEVER executes business logic.
   *
   * @param event The domain event to audit
   * @returns True if audit record was created successfully
   */
  async handle(event: DomainEvent): Promise<boolean> {
    try {
      // Extract audit information from the event
      const auditInfo = this._extractAuditInfo(event);

      if (!auditInfo) {
        // Event doesn't need auditing
        return true;
      }

      // Create the audit record
      const record = AuditRecord.create({
        actorId: auditInfo.actorId,
        actorType: auditInfo.actorType,
        action: auditInfo.action,
        targetType: auditInfo.targetType,
        targetId: auditInfo.targetId,
        categoryId: auditInfo.categoryId,
        result: auditInfo.result,
        metadata: {
          correlationId: event.metadata.correlationId,
          reason: `Event: ${event.eventType.value}`,
          extra: {
            sourceModule: event.sourceModule,
            eventOccurredAt: event.occurredAt.toISOString(),
          },
        },
      });

      // Store the audit record (non-blocking - failures are logged but don't block)
      await this._repository.storeRecord(record);

      this._logger.debug('Audit record created from event', {
        auditId: record.auditId.value,
        eventType: event.eventType.value,
        action: auditInfo.action,
      });

      return true;
    } catch (error) {
      // Log failure but don't throw - audit must never block gameplay
      this._logger.error('Failed to create audit record from event', error as Error, {
        eventType: event.eventType.value,
        eventId: event.eventId.value,
      });
      return false;
    }
  }

  /**
   * Checks if this handler can handle the given event type.
   */
  canHandle(eventType: EventType): boolean {
    return this._isActive;
  }

  /**
   * Extracts audit information from a domain event.
   */
  private _extractAuditInfo(event: DomainEvent): {
    actorId: AuditActorId;
    actorType: AuditActorType;
    action: AuditAction;
    targetType: string;
    targetId: string;
    categoryId: AuditCategoryId | null;
    result: AuditResult;
  } | null {
    try {
      const eventTypeParts = event.eventType.value.split('.');
      const domain = eventTypeParts[0] || 'Unknown';
      const action = eventTypeParts[1] || 'Unknown';

      // Determine audit action
      const auditAction = this._mapEventToAction(event.eventType.value, action);
      if (!auditAction) {
        return null; // No mapping found, skip this event
      }

      // Determine target type and ID from payload
      const targetType = event.aggregateType || domain;
      const targetId = this._extractTargetId(event);

      // Determine actor ID and type
      const actorId = this._extractActorId(event);
      const actorType = this._determineActorType(event);

      // Determine category
      const categoryId = this._mapToCategoryId(domain);

      // Determine result based on event metadata
      const result = this._determineResult(event);

      return {
        actorId,
        actorType,
        action: auditAction,
        targetType,
        targetId,
        categoryId,
        result,
      };
    } catch (error) {
      this._logger.error('Failed to extract audit info from event', error as Error, {
        eventType: event.eventType.value,
      });
      return null;
    }
  }

  /**
   * Maps event type to audit action.
   */
  private _mapEventToAction(eventTypeValue: string, actionSuffix: string): AuditAction | null {
    // Try exact match first
    if (EVENT_ACTION_MAP[actionSuffix]) {
      return EVENT_ACTION_MAP[actionSuffix];
    }

    // Try common patterns
    for (const [pattern, action] of Object.entries(EVENT_ACTION_MAP)) {
      if (eventTypeValue.includes(pattern)) {
        return action;
      }
    }

    // Default mappings based on suffix
    switch (actionSuffix.toLowerCase()) {
      case 'created':
        return AuditAction.ENTITY_CREATED;
      case 'updated':
        return AuditAction.ENTITY_UPDATED;
      case 'deleted':
        return AuditAction.ENTITY_DELETED;
      case 'error':
        return AuditAction.AUTHENTICATION_FAILED;
      default:
        return AuditAction.ENTITY_UPDATED;
    }
  }

  /**
   * Extracts target ID from event payload.
   */
  private _extractTargetId(event: DomainEvent): string {
    const payload = event.payload;

    // Try common ID field patterns
    if (payload.id) return String(payload.id);
    if (payload.targetId) return String(payload.targetId);
    if (payload.entityId) return String(payload.entityId);
    if (payload.userId) return String(payload.userId);
    if (payload.playerId) return String(payload.playerId);

    // Fall back to aggregate ID
    return event.aggregateId.value;
  }

  /**
   * Extracts actor ID from event.
   */
  private _extractActorId(event: DomainEvent): AuditActorId {
    // Try to get actor ID from metadata
    if (event.metadata.userId) {
      return AuditActorId.reconstruct(event.metadata.userId);
    }

    if (event.metadata.sessionId) {
      return AuditActorId.reconstruct(`session:${event.metadata.sessionId}`);
    }

    // Default to system actor
    return AuditActorId.reconstruct(SYSTEM_ACTOR_ID);
  }

  /**
   * Determines actor type from event.
   */
  private _determineActorType(event: DomainEvent): AuditActorType {
    const sourceModule = event.sourceModule?.toLowerCase() || 'system';

    if (SOURCE_MODULE_ACTOR_TYPE_MAP[sourceModule]) {
      return SOURCE_MODULE_ACTOR_TYPE_MAP[sourceModule];
    }

    // Try to determine from metadata
    if (event.metadata.userId) {
      return AuditActorType.PLAYER;
    }

    if (sourceModule.includes('admin')) {
      return AuditActorType.ADMIN;
    }

    if (sourceModule.includes('scheduler')) {
      return AuditActorType.SCHEDULER;
    }

    return AuditActorType.SYSTEM;
  }

  /**
   * Maps domain to category ID.
   */
  private _mapToCategoryId(domain: string): AuditCategoryId | null {
    const categoryName = EVENT_CATEGORY_MAP[domain];

    if (!categoryName) {
      return null;
    }

    return AuditCategoryId.create(categoryName);
  }

  /**
   * Determines audit result from event.
   */
  private _determineResult(event: DomainEvent): AuditResult {
    // Check if event contains error information
    const payload = event.payload;

    if (payload.error || payload.isError || payload.failed) {
      return AuditResult.FAILURE;
    }

    if (payload.denied || payload.accessDenied) {
      return AuditResult.DENIED;
    }

    if (payload.rolledBack || payload.isRolledBack) {
      return AuditResult.ROLLED_BACK;
    }

    // Default to success for most events
    return AuditResult.SUCCESS;
  }
}

/**
 * Factory function to create an AuditEventSubscriber.
 */
export function createAuditEventSubscriber(repository: IAuditRepository): AuditEventSubscriber {
  return new AuditEventSubscriber(repository);
}
