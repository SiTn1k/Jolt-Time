/**
 * Audit Actor Type Enum
 *
 * Defines the types of actors that can perform auditable actions.
 * Each type represents a distinct source of system actions.
 */

/**
 * Supported audit actor types.
 * Actor types are the originators of auditable actions.
 */
export enum AuditActorType {
  /** Player-initiated actions */
  PLAYER = 'player',

  /** Administrator-initiated actions */
  ADMIN = 'admin',

  /** System-initiated actions (scheduled, automated) */
  SYSTEM = 'system',

  /** Scheduler-initiated actions */
  SCHEDULER = 'scheduler',

  /** Service-to-service actions */
  SERVICE = 'service',

  /** Bot-initiated actions */
  BOT = 'bot',
}

/**
 * Constraints for audit actor types.
 */
export const AUDIT_ACTOR_TYPE_CONSTRAINTS = {
  MIN_DISPLAY_NAME_LENGTH: 1,
  MAX_DISPLAY_NAME_LENGTH: 128,
} as const;
